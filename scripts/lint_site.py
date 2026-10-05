#!/usr/bin/env python3
"""Static checks for the site pages. Run before every push; exit 0 means clean.

    python3 scripts/lint_site.py

Rules (design system, accessibility, honesty of links):
- shared chrome is in sync with partials/ (scripts/sync_layout.py --check);
- no em dash anywhere on a page (taste-skill rule), no <style> or on*= handlers, no inline
  style="" except a CSS custom property carrying a number (bar lengths);
- one <h1>, <main id="main">, <html lang>, <title>, meta description, canonical, og:title,
  og:description and og:image on every page;
- every <img> has alt, every <button> has a type;
- every relative href/src points at a file that exists.
"""
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import sync_layout  # noqa: E402

ROOT = sync_layout.ROOT
EM_DASH = ("—", "&mdash;", "&#8212;", "&#x2014;")
# A bar's length is data, not styling: style="--pct: 37.7%" is the one inline style allowed.
_CUSTOM_PROPS_ONLY = re.compile(r"^\s*(--[a-z-]+\s*:\s*[0-9.]+%?\s*;?\s*)+$")


class PageScan(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.errors = []
        self.h1 = 0
        self.main_id = False
        self.lang = False
        self.title = False
        self.meta = set()
        self.links = []
        self._in_title = False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        line = self.getpos()[0]
        if "style" in a and not _CUSTOM_PROPS_ONLY.match(a["style"] or ""):
            self.errors.append(f"line {line}: inline style on <{tag}> (only --custom-property data is allowed)")
        for k in a:
            if k.startswith("on"):
                self.errors.append(f"line {line}: inline handler {k} on <{tag}>")
        if tag == "style":
            self.errors.append(f"line {line}: <style> block (use style.css)")
        if tag == "html" and a.get("lang"):
            self.lang = True
        if tag == "h1":
            self.h1 += 1
        if tag == "main" and a.get("id") == "main":
            self.main_id = True
        if tag == "title":
            self.title = True
        if tag == "meta":
            key = a.get("name") or a.get("property")
            if key and a.get("content"):
                self.meta.add(key)
        if tag == "link" and a.get("rel") == "canonical":
            self.meta.add("canonical")
        if tag == "img" and "alt" not in a:
            self.errors.append(f"line {line}: <img> without alt")
        if tag == "button" and "type" not in a:
            self.errors.append(f"line {line}: <button> without type")
        for attr in ("href", "src"):
            if a.get(attr):
                self.links.append((line, a[attr]))


def local_target(page: Path, url: str):
    if re.match(r"^(?:[a-z]+:|//|#|\{)", url, re.I):
        return None
    clean = url.split("#", 1)[0].split("?", 1)[0]
    if not clean:
        return None
    if clean.startswith("/"):
        return (ROOT / clean.lstrip("/")).resolve()
    return (page.parent / clean).resolve()


def lint_page(page: Path):
    text = page.read_text(encoding="utf-8")
    errs = []
    for dash in EM_DASH:
        for m in re.finditer(re.escape(dash), text):
            errs.append(f"line {text.count(chr(10), 0, m.start()) + 1}: em dash {dash!r}")
    scan = PageScan()
    scan.feed(text)
    errs += scan.errors
    if scan.h1 != 1:
        errs.append(f"{scan.h1} <h1> elements (need exactly 1)")
    if not scan.main_id:
        errs.append('missing <main id="main">')
    if not scan.lang:
        errs.append("missing <html lang>")
    if not scan.title:
        errs.append("missing <title>")
    for key in ("description", "canonical", "og:title", "og:description", "og:image"):
        if key not in scan.meta:
            errs.append(f"missing {key}")
    for line, url in scan.links:
        target = local_target(page, url)
        if target is not None and not target.exists():
            errs.append(f"line {line}: broken link {url}")
    return errs


def main() -> int:
    bad = 0
    if sync_layout.main(["--check"]) != 0:
        print("run: python3 scripts/sync_layout.py")
        bad += 1
    for page in sync_layout.pages():
        for e in lint_page(page):
            print(f"{page.relative_to(ROOT)}: {e}")
            bad += 1
    print("lint: clean" if not bad else f"lint: {bad} problem(s)")
    return 0 if not bad else 1


if __name__ == "__main__":
    sys.exit(main())
