// Publish immutable cursor-renderer assets so CDN caches cannot mix releases.
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const partial = resolve(root, 'partials/assets.html');
let html = readFileSync(partial, 'utf8');
for (const extension of ['js', 'css']) {
  const bytes = readFileSync(resolve(root, 'assets/page-build.' + extension));
  const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 12);
  const name = 'swarm-render.' + hash + '.' + extension;
  writeFileSync(resolve(root, 'assets', name), bytes);
  const previous = new RegExp('assets/(?:page-build|swarm-render\\.[a-f0-9]+)\\.' + extension + '(?:\\?v=\\{\\{v\\}\\})?', 'g');
  if (!previous.test(html)) throw new Error('Missing shared renderer reference for ' + extension);
  html = html.replace(previous, 'assets/' + name);
  console.log(name);
}
writeFileSync(partial, html);
