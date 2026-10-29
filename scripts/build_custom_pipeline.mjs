import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as k from '../vendor/anatomy/iso-kit.mjs';
import * as G from '../vendor/anatomy/lathe.mjs';
import * as A from '../vendor/anatomy/audit.mjs';
import { shop, paint, inspectorPartial, publish, camera, UP, DOWN } from './anatomy-shop.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const model = {
  title: 'Custom feed pipeline',
  subtitle: 'From target website to verified delivery',
  stages: [
    { id: 'ingest', label: '1. Ingestion', metric: '100%', sub: 'Proxy reach rate', note: 'Distributed workers fetch through static residential proxies with automated retry loops and circuit breakers.' },
    { id: 'sift', label: '2. Deduplicate', metric: '0 dupes', sub: 'Zero repeated keys', note: 'Canonical entity IDs and URLs are verified; duplicate rows and ghost listings are systematically discarded.' },
    { id: 'audit', label: '3. Quality audit', metric: '>99.5%', sub: 'Schema conformance', note: 'Every column is validated against strict types, bounding coordinates, and published minimum fill rates.' },
    { id: 'dispatch', label: '4. Delivery', metric: 'SHA-256', sub: 'Checksum verified', note: 'Files land as clean CSV or Snappy Parquet with approved.txt cryptographic handshake in your AWS S3 bucket.' }
  ]
};

// A six-position indexing table: every stage is one 60° index, one turn of the drive crank.
const DEG = Math.PI / 180;
const STEP = 60 * DEG;
const STATION_A = [-140, -80, -20, 40].map((d) => d * DEG);
const NEST_A = Array.from({ length: 6 }, (_, j) => STATION_A[0] + j * STEP);
const DETENT_A = 100 * DEG;
const CRANK_A = 160 * DEG;
const u = (a) => [Math.sin(a), -Math.cos(a)];
const t = (a) => [Math.cos(a), Math.sin(a)];
const polar = (a, r, s = 0, z) => { const [ux, uy] = u(a), [tx, ty] = t(a); const p = [ux * r + tx * s, uy * r + ty * s]; return z === undefined ? p : [...p, z]; };

const BASE = { x: -100, y: -100, w: 200, d: 200, r: 12 };
const HOUSING_R = 60, HOUSING_H = 10;
const TABLE_R = 56, TABLE_TOP = 18;
const RN = 40;
const NEST_R = 9, NEST_TOP = TABLE_TOP + 3;
const PUCK_R = 6.5, PUCK_TOP = NEST_TOP + 7;
const RC = 82;

const W = 640, H = 440;
const P = k.fitProjection([
  ...k.boxCorners(BASE, -20, 0),
  ...STATION_A.map((a) => polar(a, RC, -19, 92)), ...STATION_A.map((a) => polar(a, RN, 0, 100))
], W, H, { pad: 10, azimuth: 40, elevation: 33 });
const R = A.recorder(P, {});
const T = shop(P, R);
const { S, L, at } = T;

// A radial bar from radius r0 to r1 at angle a: arms, crowns and brackets.
function box(name, a, r0, r1, s0, s1, z, h, tone = 'mid', o = {}) {
  const ring = [polar(a, r0, s0), polar(a, r1, s0), polar(a, r1, s1), polar(a, r0, s1)];
  const { inner = '', extra = '', ...rest } = o;
  T.put(name, polar(a, (r0 + r1) / 2, (s0 + s1) / 2, z + h / 2), S(k.extrude(ring, z, h, P, { bevel: 0.5 }), { tone, inner }) + extra, [A.extruded(ring, z, h)], rest);
  return ring;
}
const bar = (name, a, r0, r1, half, z, h, tone, o) => box(name, a, r0, r1, -half, half, z, h, tone, o);

// 1. Cast bed on four levelling mounts, with a coolant gutter and a name plate.
for (const [i, [x, y]] of k.corners(BASE, 20).entries()) {
  T.cyl(`stand.foot.${i}.pad`, x, y, 8, -20, 3, 'lo', { bevel: 0.5 });
  T.cyl(`stand.foot.${i}.nut`, x, y, 6, -17, 5, 'mid', { knurl: 30 });
}
const LABEL = { x: 54, y: 80, w: 34, d: 10, r: 1 };
T.slab('stand.bed', BASE, -12, 12, 'mid', {
  bevel: 1.6, steps: 10,
  inner: L(k.sideSeam(BASE, -8, P, 10), { tone: 'faint' }) + L(k.planOutline(k.insetPlan(BASE, 5), 0, P, 10), { tone: 'faint' }) +
    L(k.ring(0, 0, HOUSING_R + 6, 0, P, 96), { tone: 'lo' }) + T.screwsAt(k.corners(BASE, 10), 0, 2)
});
T.slab('label.plate', LABEL, 0, 0.8, 'lo', {
  bevel: 0, steps: 3,
  inner: L(k.planOutline(k.insetPlan(LABEL, 1.4), 0.8, P, 3), { tone: 'faint' }) +
    L([[3.2, 22], [5.4, 14], [7.4, 18]].map(([d, len]) => k.lineOnTop([LABEL.x + 4, LABEL.y + d], [LABEL.x + 4 + len, LABEL.y + d], 0.8, P)).join(''), { tone: 'lo', free: true })
});

// 2. Indexing table: a housing with a fixed scale, the turning table with its own graduations, a hub.
const housingTicks = k.radialTicks(0, 0, HOUSING_R - 0.3, 72, 6, HOUSING_H, [1.4, 2.6], P);
T.cyl('stand.housing', 0, 0, HOUSING_R, 0, HOUSING_H, 'lo', {
  steps: 120, bevel: 0.6, seams: [4],
  inner: L(housingTicks.minor, { tone: 'lo' }) + L(housingTicks.major, { tone: 'mid' }) +
    L(k.lineOnTop(polar(DETENT_A, HOUSING_R - 3.6), polar(DETENT_A, HOUSING_R), HOUSING_H, P), { tone: 'hi' })
});
const TABLE_TICK_R = TABLE_R - 2;
const tableTicks = k.radialTicks(0, 0, TABLE_TICK_R, 72, 6, TABLE_TOP, [1.4, 3], P, NEST_A[0]);
const notchLines = (phi) => NEST_A.map((a) => a + phi).filter((a) => { const [ux, uy] = u(a); return ux * Math.cos(40 * DEG) + uy * Math.sin(40 * DEG) > 0.12; })
  .map((a) => [-1.6, 1.6].map((dt) => k.segment(polar(a, TABLE_R, dt, TABLE_TOP - 8), polar(a, TABLE_R, dt, TABLE_TOP), P)).join('')).join('');
T.cyl('stand.table', 0, 0, TABLE_R, HOUSING_H, TABLE_TOP - HOUSING_H, 'mid', {
  steps: 120, bevel: 0.8,
  inner: L(k.ring(0, 0, TABLE_R - 6, TABLE_TOP, P, 96), { tone: 'faint' }) + `<path data-notches class="iso-line" data-tone="lo" d="${notchLines(0)}"/>`,
  extra: `<path data-ticks="minor" class="iso-line" data-tone="lo" d="${tableTicks.minor}"/><path data-ticks="major" class="iso-line" data-tone="mid" d="${tableTicks.major}"/>`
});
const HUB_DOTS = Array.from({ length: 6 }, (_, j) => NEST_A[0] + j * STEP + STEP / 2);
T.cyl('stand.hub', 0, 0, 12, TABLE_TOP, 5, 'hi', {
  bevel: 0.6, inner: L(k.ring(0, 0, 8.6, TABLE_TOP + 5, P, 40), { tone: 'faint' }),
  extra: `<g data-hub>${k.dotsSvg(HUB_DOTS.map((a) => at(polar(a, 10.2, 0, TABLE_TOP + 5))), { size: 0.55, tone: 'hi' })}</g>`
});
T.cyl('stand.hub.cap', 0, 0, 6, TABLE_TOP + 5, 2.4, 'mid', { bevel: 0.4 });

// The nests and their batches turn with the table: one item, each nest a group the page moves and re-sorts.
const nests = NEST_A.map((a, j) => {
  const [x, y] = polar(a, RN);
  const tracked = j === 0;
  const svg = S(k.cylinder(x, y, NEST_R, TABLE_TOP, 3, P, 40, 0.4), { tone: 'mid', inner: L(k.ring(x, y, PUCK_R + 1, NEST_TOP, P, 32), { tone: 'faint' }) }) +
    S(k.cylinder(x, y, PUCK_R, NEST_TOP, PUCK_TOP - NEST_TOP, P, 36, 0.5), {
      tone: 'hi', lit: tracked,
      inner: L(k.sideArc(x, y, PUCK_R, NEST_TOP + 2.4, P, 24) + k.sideArc(x, y, PUCK_R, NEST_TOP + 4.6, P, 24), { tone: 'faint' }) + L(k.ring(x, y, 3.4, PUCK_TOP, P, 24), { tone: 'lo' })
    });
  return { svg: `<g data-nest="${j}"${tracked ? ' data-payload' : ''}>${svg}</g>`, shapes: [A.cylinder(x, y, NEST_R, TABLE_TOP, 3), A.cylinder(x, y, PUCK_R, NEST_TOP, PUCK_TOP - NEST_TOP)] };
});
T.put('table.nests', [0, 0, NEST_TOP], `<g data-orbit>${nests.map((n) => n.svg).join('')}</g>`, nests.flatMap((n) => n.shapes).map((s) => ({ ...s, owner: 'table.nests' })));

// 3. Spring detent: a housing on the bed whose plunger drops into a rim notch at every index.
{
  const a = DETENT_A;
  bar('detent.body', a, HOUSING_R + 0.2, HOUSING_R + 14, 6, 0, HOUSING_H, 'mid');
  bar('detent.block', a, TABLE_R + 4, HOUSING_R + 12, 4.5, HOUSING_H, 8, 'mid', { inner: T.screwsAt([polar(a, HOUSING_R + 9, -2.6), polar(a, HOUSING_R + 9, 2.6)], HOUSING_H + 8, 0.9) });
  const F = G.frameAlong(polar(a, TABLE_R + 4, 0, HOUSING_H + 4), [-u(a)[0], -u(a)[1], 0]);
  const rod = G.rodOut(F, 0, 4, 1.2, P, { stroke: 3 });
  T.put('detent.plunger', polar(a, TABLE_R + 2, 0, HOUSING_H + 4),
    `<g data-detent><clipPath id="pipeline-detent-clip"><path data-hold d="${rod.clip}"/></clipPath><g clip-path="url(#pipeline-detent-clip)">${S(rod.paths, { tone: 'hi' })}</g></g>`,
    [A.disc(F, 0, 4, 1.2)]);
  T.cyl('detent.cap', ...polar(a, HOUSING_R + 9), 2.4, HOUSING_H + 8, 2.4, 'mid', { knurl: 16 });
}

// 4. Drive: a motor into a gearbox whose crank turns once per index (a Geneva input).
const CRANK = { c: polar(CRANK_A, 80, 0, 16.4), r: 4.6 };
{
  const a = CRANK_A;
  const box = bar('drive.gearbox', a, 70, 90, 9, 0, 14, 'mid', { inner: '' });
  const F = G.frameAlong(polar(a, 80, 9, 7), [t(a)[0], t(a)[1], 0]);
  T.disc('drive.motor.flange', F, 0, 2, 6.4, 'mid');
  const fins = G.ribsOf(F, 2.4, 19, 6, 24, P, { fade: [0.05, 0.45], seams: true });
  T.disc('drive.motor', F, 2, 20, 6, 'hi', { inner: k.fadedSvg(fins, { tone: 'lo' }) });
  T.disc('drive.motor.cap', F, 20, 22, 4.4, 'mid');
  T.cyl('drive.crank', ...polar(a, 80), 6.8, 14, 2.4, 'hi', { bevel: 0.4, knurl: 40, inner: L(k.ring(...polar(a, 80), 2, 16.4, P, 16), { tone: 'faint' }) });
  const [px, py] = [CRANK.c[0] + u(0)[0] * CRANK.r, CRANK.c[1] + u(0)[1] * CRANK.r];
  T.cyl('drive.crank.pin', px, py, 1.2, 16.4, 3.4, 'hi', { attrs: 'data-crank', bevel: 0.3 });
}

// Columns stand on the bed outside the table; every tool hangs from an arm over its nest.
function column(n, a, top, r = 6) {
  const [x, y] = polar(a, RC);
  T.cyl(`${n}.column.foot`, x, y, r + 4, 0, 2.4, 'lo', { bevel: 0.4, inner: T.screwsAt([0, 1, 2, 3].map((q) => [x + Math.cos(q * Math.PI / 2 + 0.6) * (r + 2), y + Math.sin(q * Math.PI / 2 + 0.6) * (r + 2)]), 2.4, 0.8) });
  T.cyl(`${n}.column`, x, y, r, 2.4, top - 2.4, 'hi', { crease: 'none', seams: [top - 14] });
}

// 5. Station 1 (Ingestion): hopper cone under a lid with an agitator motor, a slide gate at the spout,
//    and a feed pipe up the column through a throttle valve with a handwheel.
const ING = { a: STATION_A[0] };
{
  const n = 'station.0', a = ING.a, [hx, hy] = polar(a, RN);
  column(n, a, 66);
  bar(`${n}.arm`, a, RC - 6, RN + 15.2, 3.4, 66, 4, 'mid');
  const F = G.frameAlong([hx, hy, 34], UP);
  T.turned(`${n}.hopper`, F, [[0, 3.5], [6, 3.5], [30, 14], [33, 14]], 'hi', { inner: L(G.arcOf(F, 6, 3.5, P) + G.arcOf(F, 30, 14, P), { tone: 'faint' }) });
  T.cyl(`${n}.lid`, hx, hy, 15.5, 67, 2, 'mid', { bevel: 0.4, inner: T.screwsAt([0, 1, 2, 3, 4, 5].map((q) => [hx + Math.cos(q * 1.047) * 13.4, hy + Math.sin(q * 1.047) * 13.4]), 69, 0.7) });
  T.cyl(`${n}.agitator`, hx, hy, 6, 69, 10, 'hi', { seams: [71.5, 74, 76.5], bevel: 0.4 });
  ING.shaft = [hx, hy, 79];
  T.cyl(`${n}.agitator.coupling`, hx, hy, 3, 79, 2, 'mid', { extra: `<path data-agitator class="iso-line" data-tone="hi" d="${k.lineOnTop([hx - 2.4, hy], [hx + 2.4, hy], 81, P)}"/>` });
  // Slide gate under the spout, opening outward along the radius.
  const gate = [polar(a, RN - 5, -5), polar(a, RN + 5, -5), polar(a, RN + 5, 5), polar(a, RN - 5, 5)];
  T.put(`${n}.gate`, [hx, hy, 33.3], `<g data-gate>${S(k.extrude(gate, 32.6, 1.4, P), { tone: 'mid', lit: true })}</g>`, [A.extruded(gate, 32.6, 1.4)]);
  ING.gate = [u(a)[0] * 8, u(a)[1] * 8, 0];
  // Feed pipe with a throttle valve on its top leg.
  const s = 19, top = 86;
  const [fx, fy] = polar(a, RC, s);
  T.cyl(`${n}.feed.flange`, fx, fy, 3.6, 0, 1.6, 'mid', { bevel: 0.3 });
  const inlet = polar(a, RN + 10, s * 0.3);
  T.cyl(`${n}.feed.boss`, ...inlet, 3, 69, 2, 'mid');
  const route = [[fx, fy, 1.6], [fx, fy, top], [...inlet, top], [...inlet, 71]];
  const corner = route[1], mid = [(corner[0] + inlet[0]) / 2, (corner[1] + inlet[1]) / 2, top];
  const line = G.fillet(route, 6, 10, { P, tube: 1.8 });
  const total = G.pathLength(line);
  // Find the arc length nearest the valve centre so the pipe can be gapped there.
  let best = 0, bestD = Infinity;
  for (let sAt = 0; sAt <= total; sAt += 0.2) { const p = G.pointAlong(line, sAt); const d = Math.hypot(p[0] - mid[0], p[1] - mid[1], p[2] - mid[2]); if (d < bestD) { bestD = d; best = sAt; } }
  const VR = 3.6, half = Math.sqrt(VR * VR - 1.8 * 1.8);
  T.pipe(`${n}.feed`, route, 1.8, { bend: 3.4, tone: 'hi', gaps: [[best - half, best + half]], maxLength: 12 });
  T.ball(`${n}.valve`, mid, VR, 'mid', { meta: { owner: `${n}.feed` } });
  T.cyl(`${n}.valve.stem`, mid[0], mid[1], 0.9, top + VR - 0.4, 3.4, 'hi');
  ING.wheel = { c: [mid[0], mid[1], top + VR + 4.2], r: 4.6 };
  const spokes = [0, 1, 2].map((j) => `<path data-valve-spoke class="iso-line" data-tone="mid" d="${k.lineOnTop([mid[0], mid[1]], [mid[0] + Math.sin(j * 2.094) * 4, mid[1] - Math.cos(j * 2.094) * 4], ING.wheel.c[2], P)}"/>`).join('');
  T.cyl(`${n}.valve.wheel`, mid[0], mid[1], 4.6, top + VR + 3, 1.2, 'hi', { knurl: 30, extra: spokes + k.dotsSvg([at(ING.wheel.c)], { size: 0.6, tone: 'hi' }) });
}

// 6. Station 2 (Deduplicate): a centrifuge drum of woven mesh on a spindle under its drive motor.
const DRUM = { variants: 6 };
{
  const n = 'station.1', a = STATION_A[1], [hx, hy] = polar(a, RN);
  column(n, a, 72);
  bar(`${n}.arm`, a, RC - 6, RN - 7, 4, 72, 4, 'mid');
  T.cyl(`${n}.motor`, hx, hy, 6.5, 76, 10, 'hi', { seams: [78.5, 81, 83.5], bevel: 0.4 });
  T.cyl(`${n}.motor.cap`, hx, hy, 4.4, 86, 1.6, 'mid');
  T.cyl(`${n}.spindle`, hx, hy, 1.6, 64, 8, 'mid', { crease: 'none' });
  T.cyl(`${n}.drum.top`, hx, hy, 11.6, 61.4, 2.6, 'mid', { bevel: 0.4, inner: L(k.ring(hx, hy, 3, 64, P, 18), { tone: 'faint' }) });
  const F = G.frameAlong([hx, hy, 40], UP);
  const mesh = Array.from({ length: DRUM.variants }, (_, v) => {
    const phase = (v / DRUM.variants) * (Math.PI * 2 / 28);
    const weave = [...G.ribsOf(F, 0.6, 20.8, 11, 28, P, { phase, twist: 0.9, fade: [0.04, 0.4] }), ...G.ribsOf(F, 0.6, 20.8, 11, 28, P, { phase, twist: -0.9, fade: [0.04, 0.4] })];
    return `<g data-mesh="${v}"${v ? ' display="none"' : ''}>${k.fadedSvg(weave, { tone: 'lo' })}</g>`;
  }).join('');
  T.put(`${n}.drum`, [hx, hy, 50.7], S(G.disc(0, 21.4, 11, F, P), { tone: 'hi', inner: L(G.arcOf(F, 0.6, 11, P) + G.arcOf(F, 20.8, 11, P), { tone: 'faint' }) }) + mesh, [A.disc(F, 0, 21.4, 11)]);
  T.cyl(`${n}.drum.foot`, hx, hy, 8, 37.6, 2.4, 'mid', { bevel: 0.4 });
}

// 7. Station 3 (Quality audit): a dial gauge head whose probe touches the batch; the needle swings to 99.5.
const QA = {};
{
  const n = 'station.2', a = STATION_A[2], [hx, hy] = polar(a, RN);
  column(n, a, 74);
  bar(`${n}.arm`, a, RC - 6, RN, 3.4, 74, 4, 'mid');
  T.cyl(`${n}.lug`, hx, hy, 3.4, 66, 8, 'mid');
  const DR = 11, top = 66;
  const ticks = k.radialTicks(hx, hy, DR - 2.2, 50, 5, top, [0.9, 1.8], P);
  QA.needle = { c: [hx, hy, top + 0.2], r: DR - 3.4, tail: 2.6 };
  const needle = `<path data-qa-needle class="iso-line" data-tone="lit" data-free="start" d="${k.lineOnTop([hx, hy + 2.6], [hx, hy - QA.needle.r], top + 0.2, P)}"/>`;
  T.cyl(`${n}.dial`, hx + 0, hy, DR, 58, 8, 'hi', {
    steps: 64, bevel: 0.6, crease: 'lo',
    inner: L(k.knurl(hx, hy, DR, top - 2.6, top, 64, P, 0.3), { tone: 'lo' }) + L(k.ring(hx, hy, DR - 1.8, top, P, 56), { tone: 'lo' }) +
      L(ticks.minor, { tone: 'lo' }) + L(ticks.major, { tone: 'mid' }) + L(k.radialTicks(hx, hy, DR - 2.2, 2, 1, top, [2.6, 2.6], P, 0.99 * 2 * Math.PI, 0.01 * 2 * Math.PI).major, { tone: 'green' }),
    extra: needle + k.dotsSvg([at(QA.needle.c)], { size: 0.8, tone: 'hi' })
  });
  T.cyl(`${n}.stem`, hx, hy, 2.6, 46, 12, 'mid', { seams: [52] });
  const RF = G.frameAlong([hx, hy, 46], DOWN);
  const rod = G.rodOut(RF, 0, 46 - (PUCK_TOP + 4 + 1.4), 1, P, { stroke: 5 });
  const tip = [hx, hy, PUCK_TOP + 4 + 1.4];
  T.put(`${n}.probe`, [hx, hy, 38], `<g data-qa-probe><clipPath id="pipeline-qa-clip"><path data-hold d="${rod.clip}"/></clipPath><g clip-path="url(#pipeline-qa-clip)">${S(rod.paths, { tone: 'hi', crease: 'none' })}</g>${S(G.sphereOf(tip, 1.4, P), { tone: 'hi' })}</g>`,
    [A.disc(RF, 0, 46 - tip[2], 1, { owner: `${n}.probe` }), A.ball(tip, 1.4, { owner: `${n}.probe` })]);
  QA.drop = 4;
}

// 8. Station 4 (S3 delivery): a press crown with two chrome rams lowering a sealing bell over the batch.
const PRESS = { drop: 40 - TABLE_TOP };
{
  const n = 'station.3', a = STATION_A[3], [hx, hy] = polar(a, RN);
  column(n, a, 76, 7.5);
  const crown = [polar(a, RC - 7.5, -10), polar(a, RN - 8, -10), polar(a, RN - 8, 10), polar(a, RC - 7.5, 10)];
  bar(`${n}.crown`, a, RC - 7.5, RN - 8, 10, 76, 7, 'mid', { inner: L(k.ringSeam(crown, 79.5, P), { tone: 'faint' }) + L(k.onTop(crown.map(([x, y]) => [x * 0.98 + polar(a, 60)[0] * 0.02, y * 0.98 + polar(a, 60)[1] * 0.02]), 83, P, true), { tone: 'faint' }) + T.screwsAt([polar(a, RC - 3, -6), polar(a, RC - 3, 6)], 83, 1) });
  const BELL_Z = 40;
  const BF = G.frameAlong([hx, hy, BELL_Z], UP);
  const bell = [[0, 10.5], [9.5, 10.5], [11, 9], [12, 9], [12, 0]];
  T.put(`${n}.bell`, [hx, hy, BELL_Z + 6], `<g data-press>${S(G.solidOf(bell, BF, P), { tone: 'hi', inner: L(G.arcOf(BF, 3, 10.5, P) + G.arcOf(BF, 6.5, 10.5, P), { tone: 'faint' }) })}</g>`, [A.solid(BF, bell)]);
  [-6, 6].forEach((side, j) => {
    const [cx2, cy2] = polar(a, RN, side);
    T.cyl(`${n}.ram.${j}.barrel`, cx2, cy2, 3.4, 83, 15, 'hi', { seams: [86, 95], bevel: 0.4 });
    T.cyl(`${n}.ram.${j}.cap`, cx2, cy2, 2.6, 98, 2, 'mid', { inner: L(k.ring(cx2, cy2, 1.2, 100, P, 12), { tone: 'faint' }) });
    const RF = G.frameAlong([cx2, cy2, 76], DOWN);
    const rod = G.rodOut(RF, 0, 76 - (BELL_Z + 12), 1.3, P, { stroke: PRESS.drop });
    T.put(`${n}.ram.${j}.rod`, [cx2, cy2, 64], `<g data-press data-press-rod><clipPath id="pipeline-ram-${j}-clip"><path data-hold d="${rod.clip}"/></clipPath><g clip-path="url(#pipeline-ram-${j}-clip)">${S(rod.paths, { tone: 'hi', lit: true, crease: 'none' })}</g></g>`,
      [A.disc(RF, 0, 76 - BELL_Z - 12, 1.3)]);
  });
}

const svg = paint(R, P, {
  width: W, height: H, states: [0],
  label: 'A six-position rotary indexing table on a cast bed. One turn of the drive crank indexes the table 60°, a spring detent locks it, and the tracked batch visits four stations: an ingestion hopper with a slide gate and a throttle valve, a woven-mesh centrifuge drum, a dial gauge that reads schema conformance, and a press whose two chrome rams lower a sealing bell for S3 delivery.'
});

model.rig = {
  kind: 'pipeline', P: camera(P), step: STEP, rn: RN, nests: NEST_A, tickR: TABLE_TICK_R, top: TABLE_TOP, tickFrom: NEST_A[0],
  hub: { a: HUB_DOTS, r: 10.2, z: TABLE_TOP + 5 }, notch: { r: TABLE_R, z0: TABLE_TOP - 8, z1: TABLE_TOP, view: 40 * DEG },
  detent: { dir: [u(DETENT_A)[0] * 3, u(DETENT_A)[1] * 3, 0] }, crank: CRANK,
  gate: ING.gate, shaft: ING.shaft, wheel: ING.wheel, mesh: DRUM.variants, qa: QA, press: PRESS
};

const delta = [0, 0];
const partial = inspectorPartial({
  cls: 'data-pipeline', id: 'pipeline', model, svg, delta,
  title: 'Custom Data Pipeline · Rotary Indexing Foundry',
  source: 'End-to-End Extraction &amp; Quality Gates',
  meta: 'Automated ingestion &middot; Zero-duplication sift &middot; Strict schema audit &middot; Checksum delivery',
  ariaLabel: 'Select a pipeline stage to inspect. Use the arrow keys, Home or End.',
  fieldsLabel: 'Pipeline stages', selectLabel: 'Inspect stage', hint: 'Tap a foundry station to index the table.',
  fill: () => 100,
  caption: 'The lit batch rides a six-position indexing table. Each stage is one 60° index: the detent lifts, the crank turns once, the table locks and the station works: the hopper gate opens, the mesh drum spins out duplicates, the gauge reads conformance, and the press seals the batch for S3.'
});
publish(ROOT, { partialPath: 'partials/data-pipeline.html', pagePath: 'custom-data.html', marker: 'custom-pipeline', partial });

console.log(`Built custom pipeline foundry: ${T.count()} solids; 4 pipeline stages`);
A.auditOrExit(R, P, { states: [0] });
