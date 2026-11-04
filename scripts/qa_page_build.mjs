// Browser QA for the real, interactive page underneath the construction sequence.
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';
const skill = process.env.TASTE_SKILL_HOME || join(homedir(), '.codex/skills/design-taste-frontend');
const { Browser, sleep } = await import(pathToFileURL(join(skill, 'scripts/lib/cdp.mjs')));
const base = process.argv[2] || 'http://127.0.0.1:8765/';
const out = '.taste-skill/page-build-qa';
mkdirSync(out, { recursive: true });
const results = [];
const check = (ok, name) => { results.push({ ok: !!ok, name }); if (!ok) console.error('FAIL ' + name); };
const browser = await Browser.launch();

async function open(path = '', width = 1440, theme = 'light', motion = 'reduce', setup) {
  const p = await browser.newPage({ width, height: 1000, mobile: width < 600 });
  await p.send('Network.enable');
  await p.send('Network.setBlockedURLs', { urls: ['*cloud.umami.is*', '*payhip.com*', '*fonts.googleapis.com*', '*fonts.gstatic.com*', '*unpkg.com*'] });
  await p.send('Emulation.setEmulatedMedia', { features: [
    { name: 'prefers-color-scheme', value: theme }, { name: 'prefers-reduced-motion', value: motion }
  ] });
  if (setup) await setup(p);
  await p.goto(new URL(path, base).href, { settleMs: 160 });
  return p;
}

async function click(p, selector) {
  const pos = await p.eval(sel => {
    const el = document.querySelector(sel); el.scrollIntoView({ block: 'center', behavior: 'instant' });
    const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  }, selector);
  await p.send('Input.dispatchMouseEvent', { type: 'mousePressed', ...pos, button: 'left', clickCount: 1 });
  await p.send('Input.dispatchMouseEvent', { type: 'mouseReleased', ...pos, button: 'left', clickCount: 1 });
}

async function settleVisible(p) {
  let settled = false;
  for (let i = 0; i < 55 && !settled; i++) {
    await sleep(100);
    settled = await p.eval(() => [...document.querySelectorAll('[data-build-state]:not([data-build-state="done"])')].every(e => {
      const r = e.getBoundingClientRect(); return r.width < 1 || r.height < 1 || r.bottom <= 68 || r.top >= innerHeight - 12;
    }));
  }
  return settled;
}

const skipped = new Set(['.git', '.taste-skill', 'node_modules', 'partials', 'scripts', 'tmp', 'vendor', 'preview', 'delta-force', 'api', 'downloads', 'samples']);
function pages(dir = '.', prefix = '') {
  return readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory()
    ? skipped.has(e.name) ? [] : pages(join(dir, e.name), prefix + e.name + '/')
    : e.name.endsWith('.html') ? [prefix + e.name] : []);
}

try {
  for (const width of [1440, 768, 390]) for (const theme of ['light', 'dark']) for (const motion of ['reduce', 'no-preference']) {
    const key = `${width}-${theme}-${motion}`;
    const p = await open('', width, theme, motion);
    check(await p.eval('document.documentElement.hasAttribute("data-page-build")'), key + ': automatic full-page construction starts');
    check(await p.eval('document.querySelector("h1").getAttribute("data-build-state") === "building"'), key + ': the real headline is being typed');
    check(await p.eval('document.querySelectorAll("[data-build-state]").length > 100'), key + ': covers the whole page');
    check(await p.eval('[...document.querySelectorAll("[data-build-state]")].every(e=>!e.parentElement.closest("[data-build-state]"))'), key + ': no conflicting nested masks');
    check(await p.eval('getComputedStyle(document.querySelector(".page-build-layer")).pointerEvents === "none"'), key + ': cursors cannot block controls');
    if (theme === 'light' && motion === 'reduce') await p.screenshot({ path: `${out}/${width}-intro.jpg` });
    check(await settleVisible(p), key + ': first viewport finishes without scrolling');
    check(await p.eval('document.querySelector(".site-header .brand").getAttribute("data-build-state") === "done"'), key + ': navigation is built and visible');
    await p.eval('document.querySelector("#datasets").scrollIntoView({behavior:"instant"})');
    await sleep(220);
    check(await p.eval('!!document.querySelector("#datasets [data-build-state=building]")'), key + ': new section builds on scroll');
    if (theme === 'light' && motion === 'reduce') await p.screenshot({ path: `${out}/${width}-datasets-building.jpg` });
    check(await settleVisible(p), key + ': visible dataset rows finish');
    await click(p, '[data-filter="retail"]');
    check(await p.eval('document.querySelector("[data-filter=retail]").getAttribute("aria-pressed") === "true"'), key + ': native filter works');
    check(await p.eval('[...document.querySelectorAll("#home-list > li:not([hidden])")].every(e=>e.dataset.tags.includes("retail"))'), key + ': filter still selects the right rows');
    await click(p, '[data-page-build-toggle]');
    check(await p.eval('document.querySelectorAll("[data-build-state=pending],[data-build-state=building]").length === 0'), key + ': Show full page reveals everything');
    check(await p.eval('document.querySelectorAll(".page-build-agent").length === (innerWidth<600?3:4)'), key + ': cursor budget is bounded');
    check(await p.eval('document.documentElement.scrollWidth <= innerWidth'), key + ': no horizontal overflow');
    await click(p, '[data-page-build-toggle]');
    let replaying = false;
    for (let i = 0; i < 20 && !replaying; i++) {
      await sleep(100);
      replaying = await p.eval('!!document.querySelector("#datasets [data-build-state=building]")');
    }
    check(replaying, key + ': replay rebuilds the current section');
    await p.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape' });
    check(await p.eval('document.querySelectorAll("[data-build-state=pending],[data-build-state=building]").length === 0'), key + ': Escape reveals the full page');
    check(p.consoleErrors.length === 0, key + ': no runtime errors ' + p.consoleErrors.join(';'));
    await p.send('Page.close');
  }

  // Every section must visibly construct, including the bottom half and footer.
  for (const width of [1440, 390]) {
    const p = await open('', width);
    for (const selector of ['#inspect-sample', '#datasets', '#what-you-get', '#guides', '#insights', '#buying', '#faq', '.project-invitation', '.site-footer']) {
      await p.eval(sel => document.querySelector(sel).scrollIntoView({ behavior: 'instant', block: 'start' }), selector);
      let built = false;
      for (let i = 0; i < 25 && !built; i++) {
        await sleep(100);
        built = await p.eval(sel => [...document.querySelectorAll(sel + ' [data-build-state]')].some(e => e.dataset.buildState === 'building' || e.dataset.buildState === 'done'), selector);
      }
      check(built, `${width}: builds ${selector}`);
      await settleVisible(p);
    }
    check(p.consoleErrors.length === 0, width + ': complete scroll has no exceptions');
    await p.send('Page.close');
  }

  // Smoke all published routes. The exact same shared engine owns every page.
  for (const path of pages().sort()) {
    const p = await open(path, path === 'custom-data.html' ? 390 : 1440);
    check(await p.eval('document.documentElement.hasAttribute("data-page-build")'), path + ': shared engine attached');
    if (path === 'custom-data.html') {
      await p.eval(() => { const el = document.querySelector('input[type=email]'); el.scrollIntoView({ behavior: 'instant' }); el.focus(); });
      await p.send('Input.insertText', { text: 'qa@example.invalid' });
      check(await p.eval('document.querySelector("input[type=email]").value === "qa@example.invalid"'), 'form: native typing retains its value');
      check(await p.eval('document.querySelector("input[type=email]").closest("[data-build-state]").dataset.buildState === "done"'), 'form: focus reveals the field immediately');
    }
    await click(p, '[data-page-build-toggle]');
    check(await p.eval('document.querySelectorAll("[data-build-state=pending],[data-build-state=building]").length === 0'), path + ': complete native page is available');
    check(await p.eval('getComputedStyle(document.querySelector("h1")).opacity === "1"'), path + ': title visible');
    check(p.consoleErrors.length === 0, path + ': no runtime exceptions ' + p.consoleErrors.join(';'));
    await p.send('Page.close');
  }

  for (const width of [1440, 768, 390]) {
    const p = await open('', width);
    await p.eval(() => { const el = document.querySelector('[data-inspect-choice="3"]'); el.focus(); el.click(); });
    check(await p.eval('document.querySelector("[data-inspect-rate]").textContent === "42.9%"'), width + ': field inspection survives construction');
    check(await p.eval('document.querySelector(".inspector-fields").dataset.buildState === "done"'), width + ': keyboard focus reveals the real control group');
    await p.eval('document.querySelector(".inspector-art").focus()');
    await p.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Home', code: 'Home' });
    check(await p.eval('document.querySelector(".inspector-art").getAttribute("aria-valuenow") === "0"'), width + ': drawing keyboard controls work');
    await p.eval(() => document.querySelector('[data-guide-image*="guide-drawing"]').focus());
    let previewed = false;
    for (let i = 0; i < 20 && !previewed; i++) {
      await sleep(100); previewed = await p.eval('document.querySelector("[data-guide-preview]").src.includes("guide-drawing")');
    }
    check(previewed, width + ': guide preview changes on focus');
    await p.eval(() => { const el = document.querySelector('[data-metric="price"]'); el.focus(); el.click(); });
    check(await p.eval(() => document.querySelector('[data-metric="price"]').getAttribute('aria-pressed') === 'true'), width + ': chart metric switch works');
    await p.eval(() => { const el = document.querySelector('#faq summary'); el.focus(); el.click(); });
    check(await p.eval('document.querySelector("#faq details").open'), width + ': FAQ remains native and expandable');
    if (width === 390) {
      await click(p, '.menu-button'); await sleep(100);
      check(await p.eval('document.querySelector(".menu-button").getAttribute("aria-expanded") === "true"'), 'mobile: menu opens');
      check(await p.eval('!document.querySelector("[data-build-state=building]")'), 'mobile: construction pauses behind the open menu');
      await click(p, '.menu-button');
      check(await p.eval('document.querySelector(".menu-button").getAttribute("aria-expanded") === "false"'), 'mobile: menu closes');
    }
    check(p.consoleErrors.length === 0, width + ': native interactions have no exceptions');
    await p.send('Page.close');
  }

  const nojs = await open('', 390, 'light', 'reduce', p => p.send('Emulation.setScriptExecutionDisabled', { value: true }));
  check(await nojs.eval('!document.documentElement.hasAttribute("data-page-build") && getComputedStyle(document.querySelector("h1")).opacity === "1"'), 'no JavaScript: complete static page');
  await nojs.send('Page.close');
  const unsupported = await open('', 390, 'light', 'reduce', p => p.send('Page.addScriptToEvaluateOnNewDocument', { source: 'Element.prototype.animate=undefined;' }));
  check(await unsupported.eval('!document.documentElement.hasAttribute("data-page-build") && !document.querySelector("[data-build-state]")'), 'no animation support: complete native fallback');
  await unsupported.send('Page.close');
  const failed = await open();
  await failed.eval('window.dispatchEvent(new ErrorEvent("error",{message:"QA simulated downstream failure"}))');
  check(await failed.eval('!document.documentElement.hasAttribute("data-page-build") && !document.querySelector(".page-build-tools")'), 'simulated runtime failure: reveal page and remove animation UI');
  check(await failed.eval('[...document.querySelectorAll("[data-build-state]")].every(e=>e.dataset.buildState==="done")'), 'simulated runtime failure: no content left pending');
  await failed.send('Page.close');
} finally { await browser.close(); }

writeFileSync(resolve(out, 'results.json'), JSON.stringify(results, null, 2));
console.log(`${results.filter(r => r.ok).length}/${results.length} checks passed`);
if (results.some(r => !r.ok)) process.exitCode = 1;
