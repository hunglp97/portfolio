import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as k from '../vendor/anatomy/iso-kit.mjs';
import * as A from '../vendor/anatomy/audit.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const model = {
  title: 'API & S3 delivery gateway',
  subtitle: 'Automated data delivery mechanisms',
  stages: [
    {
      id: 'auth',
      label: '1. Bearer gate',
      metric: '0 ms',
      sub: 'Token validation',
      note: 'Every HTTP request carries your feed key; invalid keys are rejected at the edge with zero latency.',
      x: -90
    },
    {
      id: 'rest',
      label: '2. REST stream',
      metric: '1,000/req',
      sub: 'Paginated JSON',
      note: 'Filtered, paginated records through /v1/records with field projection and date bounds.',
      x: -30
    },
    {
      id: 'parquet',
      label: '3. Parquet press',
      metric: 'Snappy',
      sub: 'Columnar compression',
      note: 'Large datasets compress into snappy columnar Parquet for instant Polars/DuckDB queries.',
      x: 30
    },
    {
      id: 's3',
      label: '4. S3 handshake',
      metric: 'Receipt',
      sub: 'approved.txt verified',
      note: 'Pushed directly to your AWS S3 bucket with SHA-256 checksums and automated confirmation receipt.',
      x: 90
    }
  ]
};

const W = 640, H = 340;
const base = { x: -140, y: -65, w: 280, d: 120, r: 6 };
const P = k.fitProjection([...k.boxCorners(base, -6, 8), ...k.boxCorners({ x: -110, y: -45, w: 220, d: 80, r: 0 }, 16, 92)], W, H, { pad: 16, azimuth: 36, elevation: 35 });
const R = A.recorder(P, { order: ['selector'] });
let count = 0;

function slab(name, plan, z, h, tone = 'mid', options = {}) {
  const { moving = false, inner = '', lit = false, piece = 'fixed', ...meta } = options;
  const paths = k.slabOf(plan, z, h, P, 5, Math.min(0.7, h / 3));
  const svg = k.solidSvg(paths, { tone, lit, inner });
  R.put({
    name, piece: moving ? 'selector' : piece, move: moving ? [180, 0, 0] : undefined,
    at: [plan.x + plan.w / 2, plan.y + plan.d / 2, z + h / 2], svg,
    shapes: [R.solid(A.slab(plan, z, h, { name, ...meta }, 5))], moving
  });
  count++;
}

function screws(plan, z) {
  return k.dotsSvg(k.corners(plan, Math.min(3, plan.w / 4, plan.d / 4)).map(([x, y]) => k.iso([x, y, z], P)), { size: 0.6, tone: 'hi' });
}

// 1. Console Plinth on 4 Vibration Isolation Feet (Named stand.* so audit recognizes ground)
for (const [i, [x, y]] of k.corners(base, 18).entries()) {
  slab(`stand.foot.${i}`, { x: x - 7, y: y - 7, w: 14, d: 14, r: 3 }, -6, 3, 'lo');
  slab(`stand.pad.${i}`, { x: x - 6, y: y - 6, w: 12, d: 12, r: 2 }, -3, 3, 'lo');
}
slab('stand.deck', base, 0, 8, 'mid', { inner: screws(base, 8) + k.lineSvg(k.planOutline(k.insetPlan(base, 5), 8, P), { tone: 'faint' }) });

// 2. Main Console Slanted Cabinet Enclosure
// Rear upright housing (z = 8..64)
const rearHousing = { x: -130, y: -52, w: 260, d: 36, r: 4 };
slab('console.rear.tier1', rearHousing, 8, 24, 'mid', { inner: screws(rearHousing, 32) });
slab('console.rear.tier2', { x: -126, y: -48, w: 252, d: 28, r: 3 }, 32, 28, 'lo');
slab('console.rear.cap', { x: -128, y: -50, w: 256, d: 32, r: 3 }, 60, 4, 'hi');

// 3. Rear Selector Guide Rail along top cap
for (const x of [-124, 112]) {
  const mountPlan = { x, y: -44, w: 12, d: 16, r: 2 };
  slab(`rail.mount.${x}`, mountPlan, 64, 4, 'mid', { inner: screws(mountPlan, 68) });
}
slab('rail.bar', { x: -124, y: -39, w: 248, d: 6, r: 1 }, 68, 4, 'hi');
for (const x of [-130, 124]) {
  slab(`rail.stop.${x}`, { x, y: -41, w: 6, d: 10, r: 1 }, 64, 10, 'lo');
}

// 4. Sloping Forward Desk Deck (y = -14..40, z = 8..20)
const deskPlate = { x: -128, y: -14, w: 256, d: 52, r: 4 };
slab('console.desk.slab', deskPlate, 8, 12, 'mid', { inner: screws(deskPlate, 20) });

// 5. Four Functional Instrumentation Workstations on Desk
// Station 0 (x = -90): Bearer Gate Authentication Console
const s0 = { x: -110, y: -4, w: 40, d: 36, r: 3 };
slab('station.0.platform', s0, 20, 3, 'mid', { inner: screws(s0, 23) });
slab('station.0.bezel', { x: -106, y: 0, w: 32, d: 28, r: 2 }, 23, 2, 'lo');
// Keylock switch cylinder & Tumbler
slab('station.0.lock.housing', { x: -102, y: 4, w: 14, d: 14, r: 7 }, 25, 4, 'hi');
slab('station.0.lock.pin', { x: -97, y: 9, w: 4, d: 4, r: 2 }, 29, 2, 'lo');
// Ruby Status Jewel Lamp (Indicating 200 OK Token Live)
slab('station.0.jewel.bezel', { x: -84, y: 4, w: 12, d: 12, r: 6 }, 25, 3, 'hi');
slab('station.0.jewel.lens', { x: -82, y: 6, w: 8, d: 8, r: 4 }, 28, 5, 'hi', { lit: true });

// Station 1 (x = -30): REST Paginated Stream Matrix & Patch Field
const s1 = { x: -50, y: -4, w: 40, d: 36, r: 3 };
slab('station.1.platform', s1, 20, 3, 'mid', { inner: screws(s1, 23) });
slab('station.1.patch.field', { x: -46, y: 0, w: 32, d: 28, r: 2 }, 23, 2, 'lo');
// 4 Channel Jacks & Rotary Commutator
for (let j = 0; j < 3; j++) {
  const jx = -44 + j * 10;
  slab(`station.1.jack.${j}.socket`, { x: jx, y: 4, w: 6, d: 6, r: 2 }, 25, 3, 'lo');
  slab(`station.1.jack.${j}.pin`, { x: jx + 1.5, y: 5.5, w: 3, d: 3, r: 1 }, 28, 2, 'hi');
}
slab('station.1.rotary.knob', { x: -35, y: 16, w: 10, d: 8, r: 2 }, 25, 6, 'hi', { lit: true });

// Station 2 (x = 30): Parquet Columnar Compression Press
const s2 = { x: 10, y: -4, w: 40, d: 36, r: 3 };
slab('station.2.platform', s2, 20, 3, 'mid', { inner: screws(s2, 23) });
slab('station.2.die.base', { x: 14, y: 0, w: 32, d: 28, r: 2 }, 23, 3, 'lo');
for (let c = 0; c < 3; c++) {
  const cx = 17 + c * 9;
  slab(`station.2.col.${c}.plate`, { x: cx, y: 4, w: 7, d: 20, r: 1 }, 26, 8, 'mid');
  slab(`station.2.col.${c}.core`, { x: cx + 1, y: 6, w: 5, d: 16, r: 0.5 }, 34, 3, 'hi', { lit: true });
}

// Station 3 (x = 90): S3 Cartridge Dock & Receipt Dispenser
const s3 = { x: 70, y: -4, w: 40, d: 36, r: 3 };
slab('station.3.platform', s3, 20, 3, 'mid', { inner: screws(s3, 23) });
// Cartridge Dock Slot Wall
slab('station.3.dock.bay', { x: 74, y: 0, w: 32, d: 14, r: 2 }, 23, 6, 'lo');
slab('station.3.dock.cart', { x: 78, y: 2, w: 24, d: 10, r: 1 }, 29, 12, 'hi', { lit: true });
// Receipt Chute & Paper Strip (approved.txt verification slip)
slab('station.3.chute.lip', { x: 74, y: 18, w: 32, d: 10, r: 1 }, 23, 3, 'lo');
slab('station.3.receipt.paper', { x: 78, y: 22, w: 24, d: 12, r: 0.5 }, 26, 1.2, 'hi', { lit: true });

// 6. Front Reference Status Strip on Base
const ruler = { x: -120, y: 44, w: 240, d: 5, r: 1 };
const ticks = k.topTicks(-115, 115, 5, 5, 44, 8.6, [2, 3.8], P);
slab('ruler', ruler, 8, 0.6, 'lo', { inner: k.lineSvg(ticks.minor, { tone: 'lo' }) + k.lineSvg(ticks.major, { tone: 'mid' }) });

// 7. Moving Electromechanical Selector Head (Starts over Station 0 at x = -90)
const cx = -90;
const carriage = { x: cx - 16, y: -44, w: 32, d: 16, r: 2 };
slab('selector.carriage', carriage, 72, 8, 'hi', { moving: true, inner: screws(carriage, 80) });
slab('selector.post', { x: cx - 6, y: -41, w: 12, d: 10, r: 2 }, 80, 8, 'mid', { moving: true });
// Overhead Bus Arm extending over the desk (y = -31..6)
slab('selector.bus.arm', { x: cx - 4, y: -31, w: 8, d: 36, r: 1.5 }, 84, 5, 'hi', { moving: true });
// Route Indicator Jewel Head & Optical Contact
slab('selector.jewel.head', { x: cx - 8, y: 5, w: 16, d: 14, r: 3 }, 78, 12, 'lo', { moving: true });
slab('selector.jewel.lens', { x: cx - 6, y: 7, w: 12, d: 10, r: 2 }, 90, 4, 'hi', { moving: true, lit: true });
slab('selector.probe.tip', { x: cx - 3, y: 9, w: 6, d: 6, r: 1 }, 42, 36, 'hi', { moving: true });

const states = A.uniformStates(12);
A.settle(R, P, { states });
R.items.sort((a, b) => a.key - b.key);

const svg = k.figureSvg({
  width: W, height: H,
  label: 'An electromechanical patchboard terminal and S3 delivery dock routing authenticated API streams and columnar Parquet packages.',
  body: R.items.map(item => {
    const st = item.name.match(/^station\.(\d)\./)?.[1];
    return `<g data-name="${item.name}"${item.moving ? ' data-scanner' : ''}${st !== undefined ? ` data-stage="${st}"${st === '0' ? ' data-active="true"' : ''}` : ''}>${item.svg}</g>`;
  })
}).replace('viewBox="0 0 640 340"', 'viewBox="130 10 380 320"');

const delta = k.iso([180, 0, 0], P).map((n, i) => n - k.iso([0, 0, 0], P)[i]);
const first = model.stages[0];

const partial = `<figure class="data-inspector data-gateway iso iso-plate" data-ui aria-labelledby="gateway-title">
  <figcaption class="inspector-head">
    <h2 id="gateway-title">API &amp; S3 Gateway · Automated Delivery Bus</h2>
    <span class="inspector-source">High-Frequency Data Delivery Infrastructure</span>
  </figcaption>
  <p class="inspector-meta">Bearer authentication &middot; Paginated REST &middot; Snappy Parquet &middot; Direct S3 bucket push</p>
  <div class="inspector-layout">
    <div class="inspector-art" tabindex="-1" role="slider" aria-disabled="true" aria-label="Select an API delivery stage to inspect. Use the arrow keys, Home or End." aria-valuemin="0" aria-valuemax="3" aria-valuenow="0" aria-valuetext="${first.label}: ${first.metric}" data-delta-x="${delta[0]}" data-delta-y="${delta[1]}">
      ${svg}
    </div>
    <div class="inspector-desk">
      <div class="inspector-fields" aria-label="Delivery stages" hidden>
        ${model.stages.map((st, i) => `
          <button type="button" data-inspect-choice="${i}" aria-pressed="${i === 0}">
            <span>${st.label}</span>
            <strong>${st.metric}</strong>
            <span class="inspector-field-fill" aria-hidden="true" style="--field-fill:100%"></span>
          </button>
        `).join('')}
      </div>
      <div class="inspector-control">
        <label for="inspect-gateway-stage">Inspect stage</label>
        <select id="inspect-gateway-stage" data-inspect-field disabled>
          ${model.stages.map((st, i) => `<option value="${i}">${st.label} · ${st.sub}</option>`).join('')}
        </select>
        <span class="inspector-hint">Tap a console station to route.</span>
        <button type="button" class="inspector-tour" data-inspect-tour aria-pressed="false" hidden>Play tour</button>
      </div>
      <div class="inspector-result" aria-live="polite" aria-atomic="true">
        <p><strong data-inspect-rate>${first.metric}</strong><span data-inspect-sub>${first.sub}</span></p>
        <p data-inspect-note>${first.note}</p>
      </div>
    </div>
  </div>
  <div class="inspector-foot">
    <p class="inspector-caption">Electromechanical selector head routes delivery protocols across Bearer auth, paginated REST streaming, snappy Parquet compression, and verified S3 dock.</p>
  </div>
  <script type="application/json" id="gateway-model">${JSON.stringify(model)}</script>
</figure>`;

writeFileSync(resolve(ROOT, 'partials/data-gateway.html'), partial + '\n');

const apiPath = resolve(ROOT, 'api.html');
let api = readFileSync(apiPath, 'utf8');
const start = '<!-- anatomy:api-gateway -->', end = '<!-- /anatomy:api-gateway -->';
if (api.includes(start)) {
  api = api.replace(new RegExp(start + '[\\s\\S]*?' + end), start + '\n' + partial + '\n' + end);
} else {
  api = api.replace('<aside class="buy-panel"', `${start}\n${partial}\n${end}\n\n      <aside class="buy-panel"`);
}
writeFileSync(apiPath, api);

console.log(`Built API gateway console: ${count} solids; 4 delivery stages`);
A.auditOrExit(R, P, { states });
