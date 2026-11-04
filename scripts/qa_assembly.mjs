// Local browser checks. Third-party requests are blocked; no forms or checkout are submitted.
import { homedir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
const skill = process.env.TASTE_SKILL_HOME || join(homedir(), '.codex/skills/design-taste-frontend');
const { Browser, sleep } = await import(pathToFileURL(join(skill, 'scripts/lib/cdp.mjs')));
const url = process.argv[2] || 'http://127.0.0.1:8765/';
import { mkdirSync, writeFileSync } from 'node:fs';
const out = '.taste-skill/swarm-qa';
mkdirSync(out, { recursive: true });
const b = await Browser.launch();
const results = [];
function check(value, message) {
  results.push({ ok: !!value, message });
  if (!value) console.error('FAIL ' + message);
}
async function click(p, selector) {
  const at = await p.eval((sel) => {
    const el = document.querySelector(sel);
    el.scrollIntoView({ block: 'center', behavior: 'instant' });
    const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  }, selector);
  await p.send('Input.dispatchMouseEvent', { type: 'mousePressed', ...at, button: 'left', clickCount: 1 });
  await p.send('Input.dispatchMouseEvent', { type: 'mouseReleased', ...at, button: 'left', clickCount: 1 });
}
async function page(width, theme, motion, js = true) {
  const p = await b.newPage({ width, height: 1000, mobile: width < 600 });
  await p.send('Network.enable');
  await p.send('Network.setBlockedURLs', { urls: ['https://*'] });
  await p.send('Emulation.setEmulatedMedia', { features: [
    { name: 'prefers-reduced-motion', value: motion }, { name: 'prefers-color-scheme', value: theme }
  ] });
  if (!js) await p.send('Emulation.setScriptExecutionDisabled', { value: true });
  await p.goto(url, { settleMs: 200 });
  return p;
}
try {
  for (const width of [1440, 768, 390]) for (const theme of ['light', 'dark']) for (const motion of ['no-preference', 'reduce']) {
    const key = `${width}-${theme}-${motion}`;
    const p = await page(width, theme, motion);
    if (motion === 'no-preference') {
      check(await p.eval((w) => document.querySelector('[data-assembly]').hasAttribute('data-assembling') === (w > 900 && matchMedia('(pointer: fine)').matches), width), `${key}: introduction follows device capability`);
    }
    await sleep(1800);
    check(await p.eval('document.documentElement.scrollWidth <= innerWidth'), `${key}: no page overflow`);
    check(await p.eval('getComputedStyle(document.querySelector("h1")).opacity === "1"'), `${key}: title readable`);
    const hidden = await p.eval('document.querySelector("[data-assembly-play]").hidden');
    check(hidden === (motion === 'reduce'), `${key}: motion preference respected`);
    if (motion === 'no-preference') {
      await click(p, '[data-assembly-play]');
      await sleep(250);
      check(await p.eval('document.querySelector("[data-assembly]").hasAttribute("data-assembling")'), `${key}: build starts`);
      check(await p.eval('[...document.querySelectorAll(".assembly-cursor")].every(c => +getComputedStyle(c).opacity > 0)'), `${key}: four cursors appear`);
      check(await p.eval(() => {
        const r = document.querySelector('.inspector-art').getBoundingClientRect();
        return [...document.querySelectorAll('.assembly-cursor > span')].every(el => {
          const s = el.getBoundingClientRect();
          return s.left >= r.left - 1 && s.right <= r.right + 1 && s.top >= r.top - 1 && s.bottom <= r.bottom + 1;
        });
      }), `${key}: cursor labels stay inside the artwork`);
      if (theme === 'light') {
        await p.screenshot({ path: `${out}/${width}-building.jpg` });
      }
      await click(p, '[data-inspect-choice="3"]');
      check(await p.eval('!document.querySelector("[data-assembly]").hasAttribute("data-assembling")'), `${key}: field click interrupts build`);
      check(await p.eval(() => document.querySelector('[data-inspect-choice="3"]').getAttribute('aria-pressed') === 'true'), `${key}: real field selection works`);
      check(await p.eval('[...document.querySelectorAll(".iso-solid")].every(el => el.getAnimations().length === 0)'), `${key}: cancelled animations cleaned up`);
      await click(p, '[data-assembly-play]');
      await sleep(3600);
      check(await p.eval('!document.querySelector("[data-assembly]").hasAttribute("data-assembling")'), `${key}: finite build completes`);
      check(await p.eval('[...document.querySelectorAll(".iso-solid")].every(el => el.getAnimations().length === 0)'), `${key}: no retained animations`);
      await click(p, '[data-assembly-play]');
      await p.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape' });
      check(await p.eval('!document.querySelector("[data-assembly]").hasAttribute("data-assembling")'), `${key}: Escape skips`);
      await click(p, '[data-assembly-play]');
      await p.eval('window.scrollTo({top:document.body.scrollHeight,behavior:"instant"})');
      await sleep(350);
      check(await p.eval('!document.querySelector("[data-assembly]").hasAttribute("data-assembling")'), `${key}: offscreen work stops`);
    } else {
      check(await p.eval('!document.querySelector("[data-assembly]").hasAttribute("data-assembling") && document.querySelectorAll(".iso-solid")[0].getAnimations().length === 0'), `${key}: no assembly under reduced motion`);
      await click(p, '[data-inspect-choice="2"]');
      check(await p.eval('document.querySelector("[data-inspect-rate]").textContent === "53.7%"'), `${key}: reduced motion retains interaction`);
    }
    await p.eval('document.querySelector(".inspector-art").focus()');
    await p.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Home', code: 'Home' });
    check(await p.eval('document.querySelector(".inspector-art").getAttribute("aria-valuenow") === "0"'), `${key}: keyboard inspection works`);
    await p.eval('window.scrollTo({top:0,behavior:"instant"})');
    await p.screenshot({ path: `${out}/${key}.jpg` });
    check(p.consoleErrors.length === 0, `${key}: no runtime errors ${p.consoleErrors.join(';')}`);
    await p.send('Page.close');
  }
  const p = await page(1440, 'light', 'no-preference');
  await sleep(1800);
  await click(p, '[data-assembly-play]');
  await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  // Media-query changes are delivered asynchronously on Chrome's rendering task.
  // Wait for the observable state, rather than assuming event delivery within 100ms.
  let stopped = false;
  for (let i = 0; i < 20 && !stopped; i++) {
    await sleep(50);
    stopped = await p.eval('!document.querySelector("[data-assembly]").hasAttribute("data-assembling") && document.querySelector("[data-assembly-play]").hidden');
  }
  check(stopped, 'changing preference while playing cancels the build');
  await p.send('Page.close');
  const nojs = await page(390, 'light', 'reduce', false);
  check(await nojs.eval('document.querySelector("[data-assembly-play]").hidden && document.querySelectorAll(".iso-solid").length === 63'), 'no JavaScript: original figure and source remain');
  await nojs.screenshot({ path: `${out}/390-no-js.jpg` });
  await nojs.send('Page.close');
} finally { await b.close(); }
writeFileSync(`${out}/results.json`, JSON.stringify(results, null, 2));
console.log(`${results.filter(r=>r.ok).length}/${results.length} checks passed`);
if (results.some(r=>!r.ok)) process.exitCode = 1;
