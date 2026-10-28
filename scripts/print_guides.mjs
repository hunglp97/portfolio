// Requires the installed Anatomy skill and Chrome; no npm packages needed.
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const anatomy = process.env.ANATOMY_HOME || resolve(homedir(), '.agents/skills/anatomy');
const printer = resolve(anatomy, 'scripts/print.mjs');
if (!existsSync(printer)) throw new Error('Install Anatomy or set ANATOMY_HOME to its skill directory.');
function run(script, args = []) {
  const result = spawnSync(process.execPath, [script, ...args], { cwd: root, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}
mkdirSync(resolve(root, 'tmp/pdfs'), { recursive: true });
mkdirSync(resolve(root, 'downloads'), { recursive: true });
run('scripts/build_inspector.mjs', ['--audit']);
// Freeze the same generated figure offline, without analytics, checkout or CDN requests.
const figure = readFileSync(resolve(root, 'partials/data-inspector.html'), 'utf8');
const css = readFileSync(resolve(root, 'assets/inspector.css'), 'utf8');
const js = readFileSync(resolve(root, 'assets/inspector.js'), 'utf8');
writeFileSync(resolve(root, 'tmp/pdfs/inspection-light.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>HLP Data inspection - print source</title><style>:root{color-scheme:light;--text:#151517;--text-2:#55555b;--surface:#fff;--surface-2:#f7f7f6;--border:#ccc;--bg:#fff}body{margin:40px;font:16px/1.5 Arial,sans-serif}figure{max-width:800px}${css}</style></head><body class="iso" data-theme="light">${figure}<script>${js}</script></body></html>`);
run(printer, ['scripts/inspection-sheet.mjs', '--format', 'all', ...(process.argv.includes('--png') ? ['--png'] : [])]);
for (const format of ['poster', 'drawing', 'detailed']) {
  const name = `data-inspection-${format}-a4.pdf`;
  copyFileSync(resolve(root, 'tmp/pdfs', name), resolve(root, 'downloads', name));
}
// Add the card link only after all three printable files exist.
run('scripts/build_inspector.mjs', ['--audit']);
