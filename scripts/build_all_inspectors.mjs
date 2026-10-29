import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const audit = process.argv.includes('--audit');

const builders = [
  'scripts/build_inspector.mjs',
  'scripts/build_custom_pipeline.mjs',
  'scripts/build_api_gateway.mjs',
  'scripts/build_retail_caliper.mjs'
];

for (const b of builders) {
  console.log(`\n--- Running ${b} ${audit ? '(--audit)' : ''} ---`);
  const res = spawnSync('node', [resolve(ROOT, b), ...(audit ? ['--audit'] : [])], { stdio: 'inherit' });
  if (res.status !== 0) {
    console.error(`Failed: ${b}`);
    process.exit(res.status ?? 1);
  }
}

console.log('\n--- Syncing Layout ---');
const sync = spawnSync('python3', [resolve(ROOT, 'scripts/sync_layout.py')], { stdio: 'inherit' });
if (sync.status !== 0) process.exit(sync.status ?? 1);

console.log('\n--- Running Site Linter ---');
const lint = spawnSync('python3', [resolve(ROOT, 'scripts/lint_site.py')], { stdio: 'inherit' });
if (lint.status !== 0) process.exit(lint.status ?? 1);

console.log('\nAll Anatomy instruments built, synced, and lint-verified successfully!');
