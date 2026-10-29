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
      note: 'Distributed workers fetch through static residential proxies with automated retry loops and circuit breakers.',
      x: -90
    },
    {
      id: 'sift',
      label: '2. Deduplicate',
      metric: '0 dupes',
      sub: 'Zero repeated keys',
      note: 'Canonical entity IDs and URLs are verified; duplicate rows and ghost listings are systematically discarded.',
      x: -30
    },
    {
      id: 'audit',
      label: '3. Quality audit',
      metric: '>99.5%',
      sub: 'Schema conformance',
      note: 'Every column is validated against strict types, bounding coordinates, and published minimum fill rates.',
      x: 30
    },
    {
      id: 'dispatch',
      label: '4. Delivery',
      metric: 'SHA-256',
      sub: 'Checksum verified',
      note: 'Files land as clean CSV or Snappy Parquet with approved.txt cryptographic handshake in your AWS S3 bucket.',
      x: 90
    }
  ]
};

const W = 640, H = 340;
const base = { x: -140, y: -65, w: 280, d: 120, r: 6 };
const P = k.fitProjection([...k.boxCorners(base, -6, 8), ...k.boxCorners({ x: -100, y: -45, w: 200, d: 80, r: 0 }, 16, 96)], W, H, { pad: 16, azimuth: 35, elevation: 36 });
const R = A.recorder(P, { order: ['indexer'] });
let count = 0;

function slab(name, plan, z, h, tone = 'mid', options = {}) {
  const { moving = false, inner = '', lit = false, piece = 'fixed', ...meta } = options;
  const paths = k.slabOf(plan, z, h, P, 5, Math.min(0.7, h / 3));
  const svg = k.solidSvg(paths, { tone, lit, inner });
  R.put({
    name, piece: moving ? 'indexer' : piece, move: moving ? [180, 0, 0] : undefined,
    at: [plan.x + plan.w / 2, plan.y + plan.d / 2, z + h / 2], svg,
    shapes: [R.solid(A.slab(plan, z, h, { name, ...meta }, 5))], moving
  });
  count++;
}

function screws(plan, z) {
  return k.dotsSvg(k.corners(plan, Math.min(3, plan.w / 4, plan.d / 4)).map(([x, y]) => k.iso([x, y, z], P)), { size: 0.6, tone: 'hi' });
}

// 1. Heavy Cast Machine Bed on 4 Leveling Mounts (Named stand.* so audit recognizes ground)
for (const [i, [x, y]] of k.corners(base, 18).entries()) {
  slab(`stand.foot.${i}`, { x: x - 7, y: y - 7, w: 14, d: 14, r: 3 }, -6, 3, 'lo');
  slab(`stand.pad.${i}`, { x: x - 6, y: y - 6, w: 12, d: 12, r: 2 }, -3, 3, 'lo');
}
slab('stand.deck', base, 0, 8, 'mid', { inner: screws(base, 8) + k.lineSvg(k.planOutline(k.insetPlan(base, 5), 8, P), { tone: 'faint' }) });

// 2. Rear Heavy Indexing Drive Spine & Guide Track (y = -52..-36, z = 8..24)
const rearSpine = { x: -128, y: -52, w: 256, d: 16, r: 3 };
slab('spine.housing', rearSpine, 8, 8, 'lo', { inner: screws(rearSpine, 16) });
for (const x of [-124, 112]) {
  const mountPlan = { x, y: -50, w: 12, d: 12, r: 2 };
  slab(`rail.mount.${x}`, mountPlan, 16, 4, 'mid', { inner: screws(mountPlan, 20) });
}
slab('rail.bar', { x: -124, y: -46, w: 248, d: 5, r: 1 }, 20, 4, 'hi');
for (const x of [-130, 124]) {
  slab(`rail.stop.${x}`, { x, y: -48, w: 6, d: 8, r: 1 }, 16, 9, 'lo');
}

// 3. Central Rotary Drive Motor behind the track (y = -62..-52, completely behind carriage path!)
slab('spine.motor.plinth', { x: -18, y: -62, w: 36, d: 10, r: 2 }, 8, 8, 'mid');
slab('spine.motor.drum', { x: -14, y: -60, w: 28, d: 8, r: 4 }, 16, 16, 'hi');
slab('spine.motor.cap', { x: -16, y: -61, w: 32, d: 9, r: 2 }, 32, 3, 'lo', { lit: true });

// 4. Four Distinct Specialized Workstations along Deck (centered at y = 0)
// Station 0 (x = -90): Raw Ingestion Funnel & Feed Hopper (Proxy Ingestion)
const s0 = { x: -108, y: -16, w: 36, d: 32, r: 3 };
slab('station.0.platform', s0, 8, 4, 'mid', { inner: screws(s0, 12) });
slab('station.0.collar', { x: -102, y: -10, w: 24, d: 20, r: 3 }, 12, 4, 'lo');
slab('station.0.chute', { x: -98, y: -6, w: 16, d: 12, r: 2 }, 16, 14, 'hi');
slab('station.0.hopper.cone', { x: -104, y: -12, w: 28, d: 24, r: 5 }, 30, 18, 'hi', { lit: true });
slab('station.0.hopper.rim', { x: -106, y: -14, w: 32, d: 28, r: 6 }, 48, 4, 'mid');

// Station 1 (x = -30): Centrifugal Deduplication Sifter Drums (0 Dupes)
const s1 = { x: -48, y: -16, w: 36, d: 32, r: 3 };
slab('station.1.platform', s1, 8, 4, 'mid', { inner: screws(s1, 12) });
slab('station.1.drum.base', { x: -44, y: -12, w: 28, d: 24, r: 3 }, 12, 4, 'lo');
// Twin Sifter Cannisters
slab('station.1.sifter.a', { x: -42, y: -10, w: 11, d: 10, r: 3 }, 16, 28, 'hi');
slab('station.1.sifter.b', { x: -29, y: 0, w: 11, d: 10, r: 3 }, 16, 28, 'hi');
slab('station.1.cap.a', { x: -43, y: -11, w: 13, d: 12, r: 3 }, 44, 4, 'mid');
slab('station.1.cap.b', { x: -30, y: -1, w: 13, d: 12, r: 3 }, 44, 4, 'mid');
slab('station.1.bridge', { x: -39, y: -6, w: 18, d: 12, r: 2 }, 48, 3, 'lo', { lit: true });

// Station 2 (x = 30): Quality Audit Micrometer Ram & Optical Probe (>99.5% Schema)
const s2 = { x: 12, y: -16, w: 36, d: 32, r: 3 };
slab('station.2.platform', s2, 8, 4, 'mid', { inner: screws(s2, 12) });
slab('station.2.anvil', { x: 18, y: -10, w: 24, d: 20, r: 2 }, 12, 6, 'hi');
slab('station.2.column', { x: 26, y: 2, w: 8, d: 8, r: 2 }, 18, 30, 'mid');
slab('station.2.gauge.head', { x: 16, y: -12, w: 28, d: 24, r: 4 }, 48, 8, 'hi', { lit: true });
slab('station.2.spindle', { x: 27, y: -6, w: 6, d: 6, r: 2 }, 42, 6, 'hi');

// Station 3 (x = 90): Hydraulic Delivery Press & Sealed Output Chute (SHA-256 S3)
const s3 = { x: 72, y: -16, w: 36, d: 32, r: 3 };
slab('station.3.platform', s3, 8, 4, 'mid', { inner: screws(s3, 12) });
slab('station.3.ram.base', { x: 78, y: -10, w: 24, d: 20, r: 3 }, 12, 6, 'lo');
slab('station.3.pillars', { x: 82, y: -6, w: 16, d: 12, r: 2 }, 18, 26, 'mid');
slab('station.3.press.head', { x: 76, y: -12, w: 28, d: 24, r: 4 }, 44, 10, 'hi', { lit: true });
slab('station.3.chute.lip', { x: 80, y: 10, w: 20, d: 6, r: 1 }, 12, 4, 'hi');

// 5. Front Reference Status Strip on Base
const ruler = { x: -120, y: 44, w: 240, d: 5, r: 1 };
const ticks = k.topTicks(-115, 115, 5, 5, 44, 8.6, [2, 3.8], P);
slab('ruler', ruler, 8, 0.6, 'lo', { inner: k.lineSvg(ticks.minor, { tone: 'lo' }) + k.lineSvg(ticks.major, { tone: 'mid' }) });

// 6. Moving Indexing Transfer Gantry (Initial X = -90 over Station 0)
const cx = -90;
const carriage = { x: cx - 18, y: -50, w: 36, d: 12, r: 2 };
slab('indexer.carriage', carriage, 24, 8, 'hi', { moving: true, inner: screws(carriage, 32) });
// Vertical Ground Steel Mast (rises up to z = 72)
slab('indexer.mast', { x: cx - 6, y: -48, w: 12, d: 8, r: 2 }, 32, 40, 'hi', { moving: true });

// Overhead Transfer Arm extending forward across the stations (y = -40..4, z = 72..78)
// Clears all station tooling below (all station tools end at z <= 56)
slab('indexer.arm', { x: cx - 4, y: -40, w: 8, d: 44, r: 1.5 }, 72, 6, 'hi', { moving: true });
slab('indexer.mast.cap', { x: cx - 8, y: -49, w: 16, d: 10, r: 2 }, 78, 4, 'lo', { moving: true });

// Indexing Tooling Head & Optical Sensor Jewel
slab('indexer.head', { x: cx - 8, y: 4, w: 16, d: 14, r: 3 }, 68, 12, 'lo', { moving: true });
slab('indexer.jewel', { x: cx - 6, y: 6, w: 12, d: 10, r: 2 }, 80, 4, 'hi', { moving: true, lit: true });
// Vertical Alignment Probe Tip (z = 58..68, perfectly clears the z <= 56 stations!)
slab('indexer.probe', { x: cx - 3, y: 8, w: 6, d: 6, r: 1 }, 58, 10, 'hi', { moving: true });

const states = A.uniformStates(12);
A.settle(R, P, { states });
R.items.sort((a, b) => a.key - b.key);

const svg = k.figureSvg({
  width: W, height: H,
  label: 'An automated multi-stage rotary indexing pipeline moving from raw web ingestion to deduplication, schema quality gates, and verified S3 delivery.',
  body: R.items.map(item => {
    const st = item.name.match(/^station\.(\d)\./)?.[1];
    return `<g data-name="${item.name}"${item.moving ? ' data-scanner' : ''}${st !== undefined ? ` data-stage="${st}"${st === '0' ? ' data-active="true"' : ''}` : ''}>${item.svg}</g>`;
  })
}).replace('viewBox="0 0 640 340"', 'viewBox="130 10 380 320"');

const delta = k.iso([180, 0, 0], P).map((n, i) => n - k.iso([0, 0, 0], P)[i]);
const first = model.stages[0];

const partial = `<figure class="data-inspector data-pipeline iso iso-plate" data-ui aria-labelledby="pipeline-title">
  <figcaption class="inspector-head">
    <h2 id="pipeline-title">Custom Data Pipeline · Multi-Stage Foundry</h2>
    <span class="inspector-source">End-to-End Extraction &amp; Quality Gates</span>
  </figcaption>
  <p class="inspector-meta">Automated ingestion &middot; Zero-duplication sift &middot; Strict schema audit &middot; Checksum delivery</p>
  <div class="inspector-layout">
    <div class="inspector-art" tabindex="-1" role="slider" aria-disabled="true" aria-label="Select a pipeline stage to inspect. Use the arrow keys, Home or End." aria-valuemin="0" aria-valuemax="3" aria-valuenow="0" aria-valuetext="${first.label}: ${first.metric}" data-delta-x="${delta[0]}" data-delta-y="${delta[1]}">
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
        <label for="inspect-pipeline-stage">Inspect stage</label>
        <select id="inspect-pipeline-stage" data-inspect-field disabled>
          ${model.stages.map((st, i) => `<option value="${i}">${st.label} · ${st.sub}</option>`).join('')}
        </select>
        <span class="inspector-hint">Tap a foundry station to inspect.</span>
        <button type="button" class="inspector-tour" data-inspect-tour aria-pressed="false" hidden>Play tour</button>
      </div>
      <div class="inspector-result" aria-live="polite" aria-atomic="true">
        <p><strong data-inspect-rate>${first.metric}</strong><span data-inspect-sub>${first.sub}</span></p>
        <p data-inspect-note>${first.note}</p>
      </div>
    </div>
  </div>
  <div class="inspector-foot">
    <p class="inspector-caption">Automated indexing gantry transfers data payloads across Ingestion hopper, Deduplication sifter drums, Schema micrometer gate, and S3 stamping press.</p>
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
  custom = custom.replace('<aside class="buy-panel"', `${start}\n${partial}\n${end}\n\n      <aside class="buy-panel"`);
}
writeFileSync(customPath, custom);

console.log(`Built custom pipeline foundry: ${count} solids; 4 pipeline stages`);
A.auditOrExit(R, P, { states });
