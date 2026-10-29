import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as k from '../vendor/anatomy/iso-kit.mjs';
import * as A from '../vendor/anatomy/audit.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const model = {
  title: 'Retail price index caliper',
  subtitle: 'Continente shelf analysis · 38,383 products',
  stages: [
    {
      id: 'overall',
      label: '1. All 209 groups',
      metric: '56.0%',
      sub: 'Own-brand price index',
      note: 'Overall median: retailer private label sells at 56.0% of the manufacturer-brand price (€0.56 vs €1.00).',
      x: -90
    },
    {
      id: 'dairy',
      label: '2. Dairy & Milk',
      metric: '52.4%',
      sub: 'High volume staples',
      note: 'Staple dairy products show aggressive private-label penetration with deep price gaps (€0.52 vs €1.00).',
      x: -30
    },
    {
      id: 'pantry',
      label: '3. Dry Groceries',
      metric: '58.1%',
      sub: 'Packaged foods',
      note: 'Manufacturer brand equity holds a stronger price premium in packaged dry foods (€0.58 vs €1.00).',
      x: 30
    },
    {
      id: 'cleaning',
      label: '4. Cleaning & Home',
      metric: '48.7%',
      sub: 'Deepest discount gap',
      note: 'Chemical and cleaning categories exhibit the largest absolute unit-price discount (€0.49 vs €1.00).',
      x: 90
    }
  ]
};

const W = 640, H = 340;
const base = { x: -140, y: -65, w: 280, d: 120, r: 6 };
const P = k.fitProjection([...k.boxCorners(base, -6, 8), ...k.boxCorners({ x: -100, y: -45, w: 200, d: 80, r: 0 }, 16, 96)], W, H, { pad: 16, azimuth: 35, elevation: 36 });
const R = A.recorder(P, { order: ['gauge'] });
let count = 0;

function slab(name, plan, z, h, tone = 'mid', options = {}) {
  const { moving = false, inner = '', lit = false, piece = 'fixed', ...meta } = options;
  const paths = k.slabOf(plan, z, h, P, 5, Math.min(0.7, h / 3));
  const svg = k.solidSvg(paths, { tone, lit, inner });
  R.put({
    name, piece: moving ? 'gauge' : piece, move: moving ? [180, 0, 0] : undefined,
    at: [plan.x + plan.w / 2, plan.y + plan.d / 2, z + h / 2], svg,
    shapes: [R.solid(A.slab(plan, z, h, { name, ...meta }, 5))], moving
  });
  count++;
}

function screws(plan, z) {
  return k.dotsSvg(k.corners(plan, Math.min(3, plan.w / 4, plan.d / 4)).map(([x, y]) => k.iso([x, y, z], P)), { size: 0.6, tone: 'hi' });
}

// 1. Surface Plate on 4 Leveling Feet
for (const [i, [x, y]] of k.corners(base, 18).entries()) {
  slab(`stand.foot.${i}`, { x: x - 7, y: y - 7, w: 14, d: 14, r: 3 }, -6, 3, 'lo');
  slab(`stand.pad.${i}`, { x: x - 6, y: y - 6, w: 12, d: 12, r: 2 }, -3, 3, 'lo');
}
slab('stand.deck', base, 0, 8, 'mid', { inner: screws(base, 8) + k.lineSvg(k.planOutline(k.insetPlan(base, 5), 8, P), { tone: 'faint' }) });

// 2. Rear Precision Ground Guide Rail for Stand Carriage
for (const x of [-124, 112]) {
  const mountPlan = { x, y: -52, w: 12, d: 16, r: 2 };
  slab(`rail.mount.${x}`, mountPlan, 8, 5, 'mid', { inner: screws(mountPlan, 13) });
}
slab('rail.bar', { x: -124, y: -47, w: 248, d: 6, r: 1 }, 13, 4, 'hi');
for (const x of [-130, 124]) {
  slab(`rail.stop.${x}`, { x, y: -49, w: 6, d: 10, r: 1 }, 8, 11, 'lo');
}

// 3. Four Anvil Stations with Calibrated FMCG Price-Index Gauge Blocks (centered at y = 0)
const rates = [56.0, 52.4, 58.1, 48.7];
model.stages.forEach((st, i) => {
  const cx = st.x;
  const anvil = { x: cx - 18, y: -16, w: 36, d: 32, r: 3 };
  slab(`station.${i}.anvil`, anvil, 8, 4, 'mid', { inner: screws(anvil, 12) });
  // Calibrated steel gauge block (height 20 to 24)
  const blockH = Math.round(rates[i] * 0.40);
  const block = { x: cx - 12, y: -10, w: 24, d: 20, r: 1 };
  slab(`station.${i}.block`, block, 12, blockH, 'hi', { lit: true });
  // Reference cap (max top is 12 + 23 + 1 = 36)
  slab(`station.${i}.cap`, { x: cx - 10, y: -8, w: 20, d: 16, r: 1 }, 12 + blockH, 1, 'hi');
});

// 4. Front Reference Ruler on Base
const ruler = { x: -120, y: 44, w: 240, d: 5, r: 1 };
const ticks = k.topTicks(-115, 115, 5, 5, 44, 8.6, [2, 3.8], P);
slab('ruler', ruler, 8, 0.6, 'lo', { inner: k.lineSvg(ticks.minor, { tone: 'lo' }) + k.lineSvg(ticks.major, { tone: 'mid' }) });

// 5. Moving Precision Dial Indicator Height Stand (Initial X = -90 over Station 0)
const cx = -90;
const carriage = { x: cx - 18, y: -52, w: 36, d: 16, r: 2 };
slab('gauge.carriage', carriage, 17, 8, 'hi', { moving: true, inner: screws(carriage, 25) });
// Post plinth
slab('gauge.post.plinth', { x: cx - 10, y: -48, w: 20, d: 8, r: 2 }, 25, 5, 'mid', { moving: true });
// Segmented post: lower column
slab('gauge.column.lower', { x: cx - 6, y: -47, w: 12, d: 6, r: 1.5 }, 30, 46, 'hi', { moving: true });
// Articulated Clamp Collar
const collar = { x: cx - 11, y: -49, w: 22, d: 10, r: 2 };
slab('gauge.clamp.collar', collar, 76, 12, 'lo', { moving: true });
// Knurled Locking Thumbscrew on collar side
slab('gauge.clamp.screw', { x: cx - 18, y: -47, w: 7, d: 6, r: 1.5 }, 79, 6, 'hi', { moving: true });
// Upper post
slab('gauge.column.upper', { x: cx - 6, y: -47, w: 12, d: 6, r: 1.5 }, 88, 8, 'hi', { moving: true });
// Column Finial Knob
slab('gauge.column.knob', { x: cx - 8, y: -48, w: 16, d: 8, r: 2 }, 96, 4, 'lo', { moving: true });

// Horizontal Cross-Arm extending forward from collar to y = -6
slab('gauge.cross.arm', { x: cx - 4, y: -39, w: 8, d: 33, r: 1.5 }, 79, 6, 'hi', { moving: true });
// Arm End Collar holding the dial indicator
slab('gauge.arm.collar', { x: cx - 7, y: -6, w: 14, d: 12, r: 2 }, 77, 10, 'lo', { moving: true });

// Top Spindle Dust Cap & Stem above collar
slab('gauge.spindle.stem', { x: cx - 4, y: -4, w: 8, d: 8, r: 2 }, 87, 8, 'hi', { moving: true });
slab('gauge.spindle.cap', { x: cx - 5, y: -5, w: 10, d: 10, r: 2 }, 95, 4, 'lo', { moving: true });

// Dial Main Casing (flush below collar, z = 63..77, centered at y = 0)
const dialPlan = { x: cx - 15, y: -14, w: 30, d: 28, r: 14 };
const dialRings = k.ring(cx, 0, 11, 77, P, 24) + k.ring(cx, 0, 9, 77, P, 24) + k.ring(cx, 0, 2, 77, P, 12);
slab('gauge.dial.casing', dialPlan, 63, 14, 'hi', { moving: true, inner: screws(dialPlan, 77) });

// Lower Spindle Sleeve (flush below casing, z = 49..63, centered at y = 0)
slab('gauge.spindle.sleeve', { x: cx - 4, y: -4, w: 8, d: 8, r: 2 }, 49, 14, 'mid', { moving: true });
// Vertical Plunger Stylus / Contact Point (z = 38..49, clears block tops at z <= 36)
slab('gauge.plunger.stem', { x: cx - 2.5, y: -2.5, w: 5, d: 5, r: 1 }, 40, 9, 'hi', { moving: true, lit: true });
slab('gauge.plunger.tip', { x: cx - 3.5, y: -3.5, w: 7, d: 7, r: 2 }, 38, 2, 'lo', { moving: true });

const states = A.uniformStates(12);
A.settle(R, P, { states });
R.items.sort((a, b) => a.key - b.key);

const svg = k.figureSvg({
  width: W, height: H,
  label: 'A precision dial indicator height gauge stand measuring calibrated retail price parity blocks across FMCG categories.',
  body: R.items.map(item => {
    const st = item.name.match(/^station\.(\d)\./)?.[1];
    return `<g data-name="${item.name}"${item.moving ? ' data-scanner' : ''}${st !== undefined ? ` data-stage="${st}"${st === '0' ? ' data-active="true"' : ''}` : ''}>${item.svg}</g>`;
  })
}).replace('viewBox="0 0 640 340"', 'viewBox="130 10 380 320"');

const delta = k.iso([180, 0, 0], P).map((n, i) => n - k.iso([0, 0, 0], P)[i]);
const first = model.stages[0];

const partial = `<figure class="data-inspector data-caliper iso iso-plate" data-ui aria-labelledby="caliper-title">
  <figcaption class="inspector-head">
    <h2 id="caliper-title">Price Index Caliper · Measured Own-Brand Gap</h2>
    <span class="inspector-source">Continente Portugal Online Shelf Census</span>
  </figcaption>
  <p class="inspector-meta">209 comparable groups &middot; 38,383 products &middot; Precision dial indicator height gauge</p>
  <div class="inspector-layout">
    <div class="inspector-art" tabindex="-1" role="slider" aria-disabled="true" aria-label="Select a retail category to inspect. Use the arrow keys, Home or End." aria-valuemin="0" aria-valuemax="3" aria-valuenow="0" aria-valuetext="${first.label}: ${first.metric}" data-delta-x="${delta[0]}" data-delta-y="${delta[1]}">
      ${svg}
    </div>
    <div class="inspector-desk">
      <div class="inspector-fields" aria-label="Retail categories" hidden>
        ${model.stages.map((st, i) => `
          <button type="button" data-inspect-choice="${i}" aria-pressed="${i === 0}">
            <span>${st.label}</span>
            <strong>${st.metric}</strong>
            <span class="inspector-field-fill" aria-hidden="true" style="--field-fill:${rates[i]}%"></span>
          </button>
        `).join('')}
      </div>
      <div class="inspector-control">
        <label for="inspect-caliper-stage">Inspect category</label>
        <select id="inspect-caliper-stage" data-inspect-field disabled>
          ${model.stages.map((st, i) => `<option value="${i}">${st.label} · ${st.sub}</option>`).join('')}
        </select>
        <span class="inspector-hint">Tap a category anvil to inspect.</span>
        <button type="button" class="inspector-tour" data-inspect-tour aria-pressed="false" hidden>Play tour</button>
      </div>
      <div class="inspector-result" aria-live="polite" aria-atomic="true">
        <p><strong data-inspect-rate>${first.metric}</strong><span data-inspect-sub>${first.sub}</span></p>
        <p data-inspect-note>${first.note}</p>
      </div>
    </div>
  </div>
  <div class="inspector-foot">
    <p class="inspector-caption">Height gauge indicator measures calibrated price-index blocks. Low block = deep private-label discount gap; tall block = strong manufacturer brand equity.</p>
  </div>
  <script type="application/json" id="caliper-model">${JSON.stringify(model)}</script>
</figure>`;

writeFileSync(resolve(ROOT, 'partials/data-caliper.html'), partial + '\n');

const reportPath = resolve(ROOT, 'retail-report.html');
let report = readFileSync(reportPath, 'utf8');
const start = '<!-- anatomy:retail-caliper -->', end = '<!-- /anatomy:retail-caliper -->';
if (report.includes(start)) {
  report = report.replace(new RegExp(start + '[\\s\\S]*?' + end), start + '\n' + partial + '\n' + end);
} else {
  report = report.replace('<aside class="buy-panel"', `${start}\n${partial}\n${end}\n\n      <aside class="buy-panel"`);
}
writeFileSync(reportPath, report);

console.log(`Built retail caliper height stand: ${count} solids; rates from Continente census`);
A.auditOrExit(R, P, { states });
