// Generate truthful web previews from the published PDFs. Requires Poppler.
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
for (const format of ['poster', 'drawing', 'detailed']) {
  const result = spawnSync('pdftoppm', ['-f', '1', '-l', '1', '-scale-to', '900',
    '-singlefile', '-png', `downloads/data-inspection-${format}-a4.pdf`, `assets/guide-${format}`],
    { cwd: root, stdio: 'inherit' });
  if (result.error) throw new Error('Install Poppler (pdftoppm) to render the guide previews.', { cause: result.error });
  if (result.status !== 0) process.exit(result.status || 1);
  console.log(`Rendered ${format} PDF preview`);
}
