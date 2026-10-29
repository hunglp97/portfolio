import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as k from '../vendor/anatomy/iso-kit.mjs';
import * as A from '../vendor/anatomy/audit.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const model = {
  title: 'Custom feed pipeline',
  subtitle: 'From target website to verified delivery',
  stages: [
    {
      id: 'ingest',
      label: '1. Ingestion',
      metric: '100%',
      sub: 'Proxy reach rate',
      note: 'Distributed workers fetch through static proxies with automated retry loops.',
      x: -90
    },
    {
      id: 'sift',
      label: '2. Deduplicate',
      metric: '0 dupes',
      sub: 'Zero repeated keys',
      note: 'Canonical entity IDs and URLs are verified; duplicate rows are discarded.',
      x: -30
    },
    {
      id: 'audit',
      label: '3. Quality audit',
      metric: '>99.5%',
      sub: 'Schema conformance',
      note: 'Every column is checked against types, coordinates, and measured fill rates.',
      x: 30
    },
    {
      id: 'dispatch',
      label: '4. Delivery',
      metric: 'SHA-256',
      sub: 'Checksum verified',
      note: 'Files land as clean CSV or Parquet with approved.txt handshake in your S3.',
      x: 90
    }
  ]
};

const W = 640, H = 320;
const base = { x: -144, y: -65, w: 288, d: 119, r: 6 };
const scannerBounds = { x: -101, y: -53, w: 202, d: 79, r: 0 };
const P = k.fitProjection([...k.boxCorners(base, -6, 8), ...k.boxCorners(scannerBounds, 16, 72)], W, H, { pad: 16, azimuth: 35, elevation: 36 });
const R = A.recorder(P, { order: ['indicator'] });
let count = 0;

function slab(name, plan, z, h, tone = 'mid', options = {}) {
  const { moving = false, inner = '', lit = false, ...meta } = options;
  const paths = k.slabOf(plan, z, h, P, 5, Math.min(0.7, h / 3));
  const svg = k.solidSvg(paths, { tone, lit, inner });
  R.put({
    name, piece: moving ? 'indicator' : 'fixed', move: moving ? [180, 0, 0] : undefined,
    at: [plan.x + plan.w / 2, plan.y + plan.d / 2, z + h / 2], svg,
    shapes: [R.solid(A.slab(plan, z, h, { name, ...meta }, 5))], moving
  });
  count++;
}

function screws(plan, z) {
  return k.dotsSvg(k.corners(plan, Math.min(3, plan.w / 4, plan.d / 4)).map(([x, y]) => k.iso([x, y, z], P)), { size: 0.6, tone: 'hi' });
}

// Feet and deck
for (const [i, [x, y]] of k.corners(base, 18).entries()) {
  slab(`stand.foot.${i}`, { x: x - 7, y: y - 7, w: 14, d: 14, r: 3 }, -6, 3, 'lo');
  slab(`stand.pad.${i}`, { x: x - 6, y: y - 6, w: 12, d: 12, r: 2 }, -3, 3, 'lo');
}
slab('stand.deck', base, 0, 8, 'mid', { inner: screws(base, 8) + k.lineSvg(k.planOutline(k.insetPlan(base, 5), 8, P), { tone: 'faint' }) });

// Rail assembly
for (const x of [-128, 116]) for (const y of [-53, -35]) {
  const p = { x, y, w: 12, d: 10, r: 2 };
  slab(`rail.mount.${x}.${y}`, p, 8, 5, 'mid', { inner: screws(p, 13) });
}
for (const y of [-49, -31]) slab(`rail.${y}`, { x: -128, y, w: 256, d: 4, r: 1 }, 13, 3, 'hi');
for (const x of [-134, 128]) for (const y of [-51, -33]) slab(`rail.stop.${x}.${y}`, { x, y, w: 6, d: 8, r: 1 }, 8, 11, 'mid');

// 4 Pipeline Stations
model.stages.forEach((st, i) => {
  const cx = st.x;
  // Stage platform
  const plat = { x: cx - 22, y: -10, w: 44, d: 46, r: 2 };
  slab(`station.${i}.platform`, plat, 8, 3, 'mid', { inner: screws(plat, 11) });
  
  if (i === 0) {
    // Ingest: hopper tower with dual cylinders
    slab(`station.0.chute`, { x: cx - 14, y: 0, w: 28, d: 26, r: 3 }, 11, 14, 'hi');
    slab(`station.0.funnel`, { x: cx - 10, y: 4, w: 20, d: 18, r: 2 }, 25, 8, 'mid');
  } else if (i === 1) {
    // Sift: dual filter chambers
    slab(`station.1.sifter_l`, { x: cx - 16, y: 2, w: 14, d: 22, r: 2 }, 11, 20, 'hi');
    slab(`station.1.sifter_r`, { x: cx + 2, y: 2, w: 14, d: 22, r: 2 }, 11, 16, 'mid');
  } else if (i === 2) {
    // Audit: quality gauge & pillar
    slab(`station.2.pillar`, { x: cx - 12, y: 2, w: 24, d: 22, r: 2 }, 11, 12, 'mid');
    slab(`station.2.micrometer`, { x: cx - 8, y: 6, w: 16, d: 14, r: 1.5 }, 23, 10, 'hi', { lit: true });
  } else if (i === 3) {
    // Package: sealed vault crate & clamp
    slab(`station.3.crate`, { x: cx - 16, y: -2, w: 32, d: 30, r: 2 }, 11, 18, 'hi');
    slab(`station.3.seal`, { x: cx - 10, y: 4, w: 20, d: 18, r: 1 }, 29, 4, 'hi', { lit: true });
  }
});

// Indicator carriage
slab('carriage.base', { x: -101, y: -53, w: 22, d: 26, r: 2 }, 16, 8, 'hi', { moving: true });
slab('carriage.cover', { x: -100, y: -51, w: 20, d: 22, r: 1 }, 24, 2, 'hi', { moving: true, inner: screws({ x: -100, y: -51, w: 20, d: 22, r: 1 }, 26) });
slab('carriage.upright', { x: -94, y: -39, w: 8, d: 6, r: 1 }, 26, 38, 'mid', { moving: true });
slab('carriage.arm', { x: -94, y: -39, w: 8, d: 63, r: 1 }, 64, 6, 'hi', { moving: true });
slab('carriage.head', { x: -100, y: 10, w: 20, d: 18, r: 2 }, 50, 14, 'hi', { moving: true });
slab('carriage.sensor', { x: -96, y: 14, w: 12, d: 10, r: 0.5 }, 49, 1, 'hi', { moving: true, lit: true });
slab('carriage.top', { x: -97, y: 13, w: 14, d: 12, r: 1 }, 70, 2, 'hi', { moving: true });

// Front ruler
const ruler = { x: -124, y: 44, w: 248, d: 5, r: 1 };
const ticks = k.topTicks(-120, 120, 5, 5, 44, 8.6, [2, 3.8], P);
slab('ruler', ruler, 8, 0.6, 'lo', { inner: k.lineSvg(ticks.minor, { tone: 'lo' }) + k.lineSvg(ticks.major, { tone: 'mid' }) });

const states = A.uniformStates(12);
A.settle(R, P, { states });
R.items.sort((a, b) => a.key - b.key);

const svg = k.figureSvg({
  width: W, height: H,
  label: 'An isometric custom feed pipeline machine showing the 4 verification stages: Ingest, Deduplicate, Audit, and Dispatch.',
  body: R.items.map(item => {
    const st = item.name.match(/^station\.(\d)\./)?.[1];
    return `<g data-name="${item.name}"${item.moving ? ' data-scanner' : ''}${st !== undefined ? ` data-stage="${st}"${st === '0' ? ' data-active="true"' : ''}` : ''}>${item.svg}</g>`;
  })
}).replace('viewBox="0 0 640 320"', 'viewBox="130 10 380 304"');

const delta = k.iso([180, 0, 0], P).map((n, i) => n - k.iso([0, 0, 0], P)[i]);
const first = model.stages[0];

const partial = `<figure class="data-inspector data-pipeline iso iso-plate" data-ui aria-labelledby="pipeline-title">
  <figcaption class="inspector-head">
    <h2 id="pipeline-title">Pipeline Foundry · 4 Verification Stages</h2>
    <span class="inspector-source">Every custom feed passes all four stages</span>
  </figcaption>
  <p class="inspector-meta">Automated ingest &middot; Deduplication &middot; Fill audit &middot; S3 dispatch</p>
  <div class="inspector-layout">
    <div class="inspector-art" tabindex="-1" role="slider" aria-disabled="true" aria-label="Select a pipeline stage. Use the arrow keys, Home or End." aria-valuemin="0" aria-valuemax="3" aria-valuenow="0" aria-valuetext="${first.label}: ${first.metric}" data-delta-x="${delta[0]}" data-delta-y="${delta[1]}">
      ${svg}
    </div>
    <div class="inspector-desk">
      <div class="inspector-fields" aria-label="Pipeline stages" hidden>
        ${model.stages.map((st, i) => `
          <button type="button" data-inspect-choice="${i}" aria-pressed="${i === 0}">
            <span>${st.label}</span>
            <strong>${st.metric}</strong>
            <span class="inspector-field-fill" aria-hidden="true" style="--field-fill:100%"></span>
          </button>
        `).join('')}
      </div>
      <div class="inspector-control">
        <label for="inspect-stage">Inspect stage</label>
        <select id="inspect-stage" data-inspect-field disabled>
          ${model.stages.map((st, i) => `<option value="${i}">${st.label} · ${st.sub}</option>`).join('')}
        </select>
        <span class="inspector-hint">Tap a station to inspect.</span>
        <button type="button" class="inspector-tour" data-inspect-tour aria-pressed="false" hidden>Play tour</button>
      </div>
      <div class="inspector-result" aria-live="polite" aria-atomic="true">
        <p><strong data-inspect-rate>${first.metric}</strong><span data-inspect-sub>${first.sub}</span></p>
        <p data-inspect-note>${first.note}</p>
      </div>
    </div>
  </div>
  <div class="inspector-foot">
    <p class="inspector-caption">All feeds run through automated verification before any invoice or delivery receipt is issued.</p>
  </div>
  <script type="application/json" id="pipeline-model">${JSON.stringify(model)}</script>
</figure>`;

writeFileSync(resolve(ROOT, 'partials/data-pipeline.html'), partial + '\n');

const customPath = resolve(ROOT, 'custom-data.html');
let custom = readFileSync(customPath, 'utf8');
const start = '<!-- anatomy:custom-pipeline -->', end = '<!-- /anatomy:custom-pipeline -->';
if (custom.includes(start)) {
  custom = custom.replace(new RegExp(start + '[\\s\\S]*?' + end), start + '\n' + partial + '\n' + end);
} else {
  // Insert before form-layout
  custom = custom.replace('<div class="form-layout">', `${start}\n${partial}\n${end}\n\n      <div class="form-layout">`);
}
writeFileSync(customPath, custom);

console.log(`Built custom pipeline: ${count} solids across 4 stages`);
A.auditOrExit(R, P, { states });
