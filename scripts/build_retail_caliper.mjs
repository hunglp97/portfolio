import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as k from '../vendor/anatomy/iso-kit.mjs';
import * as G from '../vendor/anatomy/lathe.mjs';
import * as A from '../vendor/anatomy/audit.mjs';
import { shop, paint, inspectorPartial, publish, camera, DOWN } from './anatomy-shop.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const model = {
  title: 'Retail price index caliper',
  subtitle: 'Continente shelf analysis · 38,383 products',
  stages: [
    { id: 'overall', label: '1. All 209 groups', metric: '56.0%', rate: 56.0, sub: 'Own-brand price index', note: 'Overall median: retailer private label sells at 56.0% of the manufacturer-brand price (€0.56 vs €1.00).' },
    { id: 'dairy', label: '2. Dairy & Milk', metric: '52.4%', rate: 52.4, sub: 'High volume staples', note: 'Staple dairy products show aggressive private-label penetration with deep price gaps (€0.52 vs €1.00).' },
    { id: 'pantry', label: '3. Dry Groceries', metric: '58.1%', rate: 58.1, sub: 'Packaged foods', note: 'Manufacturer brand equity holds a stronger price premium in packaged dry foods (€0.58 vs €1.00).' },
    { id: 'cleaning', label: '4. Cleaning & Home', metric: '48.7%', rate: 48.7, sub: 'Deepest discount gap', note: 'Chemical and cleaning categories exhibit the largest absolute unit-price discount (€0.49 vs €1.00).' }
  ]
};

// One dial turn is 40 units of plunger travel and reads 100%, so a block 0.4 × rate tall reads its own rate.
const PER_TURN = 40;
const STATION_X = [-90, -30, 30, 90];
const PLATE = { x: -150, y: -72, w: 300, d: 134, r: 6 };
const PLATE_H = 16;
const FENCE = { x: -138, y: -68, w: 276, d: 8, r: 1 };
const ANVIL_TOP = 3.5;
const BLOCK_H = model.stages.map((st) => st.rate * 0.4);
const BLOCK_TOPS = BLOCK_H.map((h) => ANVIL_TOP + h);
const DIAL = { r: 18, z: 76, h: 10 };
const DIAL_TOP = DIAL.z + DIAL.h;
const GLAND = 64;
const TIP_REST = 31;
const TIP_R = 1.7;
const STROKE = 8;
const POST_Y = -48;
const X0 = STATION_X[0];

const W = 640, H = 450;
const P = k.fitProjection([
  ...k.boxCorners(PLATE, -PLATE_H - 10, 0),
  ...[X0, -X0].flatMap((x) => [[x, POST_Y, 112], [x - DIAL.r, 0, DIAL_TOP], [x + DIAL.r + 6, 0, DIAL_TOP]])
], W, H, { pad: 10, azimuth: 56, elevation: 32 });
const R = A.recorder(P, { order: ['gauge'] });
const T = shop(P, R, { piece: 'gauge', move: [STATION_X[3] - X0, 0, 0] });
const { S, L, at } = T;

// 1. Granite surface plate on four levelling feet with knurled lock nuts.
for (const [i, [x, y]] of k.corners(PLATE, 24).entries()) {
  T.cyl(`stand.foot.${i}.pad`, x, y, 8, -PLATE_H - 10, 2.5, 'lo', { bevel: 0.5 });
  T.cyl(`stand.foot.${i}.stem`, x, y, 2.6, -PLATE_H - 7.5, 3, 'mid', { crease: 'none' });
  T.cyl(`stand.foot.${i}.nut`, x, y, 6, -PLATE_H - 4.5, 4.5, 'mid', { knurl: 30 });
}
const slot = (y) => ({ x: -134, y, w: 268, d: 4.4, r: 2.2 });
const tSlot = (plan) => `<path class="iso-shade" data-shade="0" d="${k.onTop(k.ringOf(plan, 6), 0, P, true)}"/>` +
  L(k.planOutline(plan, 0, P, 6), { tone: 'lo' }) + L(k.planOutline(k.insetPlan(plan, 1.1), 0, P, 6), { tone: 'faint' });
const RULER = { x: -126, y: 44, w: 200, d: 7, r: 1 };
const LABEL = { x: 92, y: 40, w: 40, d: 15, r: 1.5 };
T.slab('stand.plate', PLATE, -PLATE_H, PLATE_H, 'mid', {
  bevel: 1.6, steps: 8,
  inner: L(k.sideSeam(PLATE, -PLATE_H + 4, P, 8), { tone: 'faint' }) +
    L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: 'faint' }) +
    tSlot(slot(-25)) + tSlot(slot(21)) +
    T.screwsAt(k.corners(PLATE, 10), 0, 2)
});

// 2. Rear straightedge fence with a scale along its top, and two end stops.
const fenceTicks = k.topTicks(-132, 132, 4, 5, FENCE.y + 0.6, 10, [1.4, 2.6], P);
T.slab('fence.bar', FENCE, 0, 10, 'mid', {
  bevel: 0.5, steps: 3,
  inner: L(fenceTicks.minor, { tone: 'lo' }) + L(fenceTicks.major, { tone: 'mid' }) +
    T.screwsAt([-120, -60, 0, 60, 120].map((x) => [x, FENCE.y + 5.6]), 10, 1.2)
});
for (const x of [-143, 143]) {
  T.cyl(`fence.stop.${x}`, x, FENCE.y + 4, 4, 0, 9, 'mid', { bevel: 0.5, seams: [3] });
  T.cyl(`fence.stop.${x}.cap`, x, FENCE.y + 4, 2.4, 9, 2, 'lo');
}

// 3. Front scale strip and a name plate.
const rulerTicks = k.topTicks(RULER.x + 4, RULER.x + RULER.w - 4, 4, 5, RULER.y + 0.8, 0.6, [2, 3.6], P);
T.slab('ruler', RULER, 0, 0.6, 'lo', { crease: 'none', bevel: 0, steps: 3, inner: L(rulerTicks.minor, { tone: 'lo' }) + L(rulerTicks.major, { tone: 'mid' }) });
const ruleLine = (y, len) => L(k.lineOnTop([LABEL.x + 5, y], [LABEL.x + 5 + len, y], 0.8, P), { tone: 'lo', free: true });
T.slab('label.plate', LABEL, 0, 0.8, 'lo', {
  bevel: 0, steps: 4,
  inner: L(k.planOutline(k.insetPlan(LABEL, 1.6), 0.8, P, 4), { tone: 'faint' }) + ruleLine(LABEL.y + 4.5, 24) + ruleLine(LABEL.y + 7.5, 18) + ruleLine(LABEL.y + 10.5, 21) +
    k.dotsSvg([at([LABEL.x + 2.8, LABEL.y + 7.5, 0.8]), at([LABEL.x + LABEL.w - 2.8, LABEL.y + 7.5, 0.8])], { size: 0.45 })
});

// 4. Four stations: a lapped platen, a wrung stack of gauge blocks 0.4 × rate tall, and a strap clamp.
STATION_X.forEach((sx, i) => {
  const n = `station.${i}`;
  T.cyl(`${n}.platen`, sx, 0, 15, 0, ANVIL_TOP, 'mid', { bevel: 0.6, steps: 64, inner: L(k.ring(sx, 0, 12.2, ANVIL_TOP, P, 48), { tone: 'faint' }) });
  const plan = { x: sx - 9, y: -7, w: 18, d: 14, r: 0.6 };
  const lower = BLOCK_H[i] - 6;
  const size = k.faceTextSvg(k.sideMatrix([sx + 8, 7, ANVIL_TOP + lower * 0.62], ANVIL_TOP + lower * 0.62, P, 'left'), BLOCK_H[i].toFixed(2), { size: 2.2, tone: 'lo', anchor: 'end' });
  T.slab(`${n}.block.lower`, plan, ANVIL_TOP, lower, 'hi', { bevel: 0.5, steps: 3, inner: size });
  T.slab(`${n}.block.upper`, plan, ANVIL_TOP + lower, 6, 'hi', { bevel: 0.5, steps: 3, inner: L(k.planOutline(k.insetPlan(plan, 2), BLOCK_TOPS[i], P, 3), { tone: 'faint' }) });
  T.slab(`${n}.heel`, { x: sx - 4, y: 21, w: 8, d: 6, r: 0.8 }, 0, ANVIL_TOP, 'lo', { steps: 3 });
  T.slab(`${n}.strap`, { x: sx - 3.5, y: 9, w: 7, d: 18, r: 1 }, ANVIL_TOP, 2, 'mid', { steps: 3, bevel: 0.4 });
  T.cyl(`${n}.washer`, sx, 18, 2.9, ANVIL_TOP + 2, 0.6, 'lo');
  T.cyl(`${n}.bolt`, sx, 18, 2.2, ANVIL_TOP + 2.6, 2, 'mid', { steps: 6, extra: k.dotsSvg([at([sx, 18, ANVIL_TOP + 4.6])], { size: 0.5, tone: 'lo' }) });
});

// 5. The height stand, built over station 1 and slid along the fence: magnetic base, post, clamp, arm.
const cx = X0;
const BASE = { x: cx - 21, y: FENCE.y + FENCE.d, w: 42, d: 30, r: 2.5 };
const DECK = k.insetPlan(BASE, 1.5);
const KNOB = [cx + 11, -38];
T.slab('gauge.base', BASE, 0, 13, 'mid', { moving: true, bevel: 0.6, steps: 4, inner: L(k.sideSeam(BASE, 6.5, P, 4), { tone: 'faint' }) });
const MAG_OFF = -Math.PI / 2, MAG_ON = Math.PI / 2;
const magMark = (a) => L(k.lineOnTop([KNOB[0] + Math.sin(a) * 6.2, KNOB[1] - Math.cos(a) * 6.2], [KNOB[0] + Math.sin(a) * 8.2, KNOB[1] - Math.cos(a) * 8.2], 17, P), { tone: 'mid', free: 'end' });
// The needle and the MAG lever are rebuilt by the page; drawn here at rest so the still picture is true.
const NEEDLE = { c: [cx, 0, DIAL_TOP + 0.2], r: DIAL.r - 4, tail: 3.4 };
const needleAt = (turn) => {
  const a = turn * Math.PI * 2, [x, y, z] = NEEDLE.c;
  return k.lineOnTop([x - Math.sin(a) * NEEDLE.tail, y + Math.cos(a) * NEEDLE.tail], [x + Math.sin(a) * NEEDLE.r, y - Math.cos(a) * NEEDLE.r], z, P);
};
const MAG = { c: [KNOB[0], KNOB[1], 22.2], r: 4.2, off: MAG_OFF, on: MAG_ON };
const leverAt = (a) => k.lineOnTop([MAG.c[0] - Math.sin(a) * 1.6, MAG.c[1] + Math.cos(a) * 1.6], [MAG.c[0] + Math.sin(a) * MAG.r, MAG.c[1] - Math.cos(a) * MAG.r], MAG.c[2], P);
const lever = `<path data-lever class="iso-line" data-tone="hi" data-free="end" d="${leverAt(MAG_ON)}"/>` + k.dotsSvg([at(MAG.c)], { size: 0.6, tone: 'hi' });
const needle = `<path data-needle class="iso-line" data-tone="lit" data-free="start" d="${needleAt((BLOCK_TOPS[0] - ANVIL_TOP) / PER_TURN)}"/>` + k.dotsSvg([at(NEEDLE.c)], { size: 0.9, tone: 'hi' });
T.slab('gauge.deck', DECK, 13, 4, 'mid', {
  moving: true, bevel: 0.5, steps: 4,
  inner: magMark(MAG_OFF) + magMark(MAG_ON) + T.screwsAt([[DECK.x + 3, DECK.y + DECK.d - 3], [DECK.x + DECK.w - 3, DECK.y + DECK.d - 3]], 17, 1.1)
});
T.cyl('gauge.mag.knob', KNOB[0], KNOB[1], 5, 17, 5, 'mid', { moving: true, knurl: 34, bevel: 0.4, inner: L(k.ring(KNOB[0], KNOB[1], 3.6, 22, P, 24), { tone: 'faint' }), extra: lever });
T.cyl('gauge.post.collar', cx, POST_Y, 6, 17, 4, 'mid', { moving: true, bevel: 0.4 });
T.cyl('gauge.post.lower', cx, POST_Y, 3.4, 21, 63, 'hi', { moving: true, crease: 'none', seams: [44, 64] });
const CLAMP = { x: cx - 7, y: POST_Y - 7, w: 14, d: 14, r: 2.5 };
T.slab('gauge.clamp', CLAMP, 84, 12, 'mid', { moving: true, bevel: 0.6, steps: 4, inner: L(k.sideSeam(CLAMP, 90, P, 4), { tone: 'faint' }) });
T.thumb('gauge.clamp.screw', G.frameAlong([CLAMP.x + CLAMP.w, POST_Y + 2, 90], [1, 0, 0]), [1.3, 2.4], [2.8, 4.2], { moving: true });
T.cyl('gauge.post.upper', cx, POST_Y, 3.4, 96, 14, 'hi', { moving: true, crease: 'none' });
T.cyl('gauge.post.cap', cx, POST_Y, 4, 110, 2, 'mid', { moving: true, bevel: 0.4 });
const ARM_Y0 = CLAMP.y + CLAMP.d, ARM_Y1 = -DIAL.r - 6;
T.disc('gauge.arm', G.frameAlong([cx, ARM_Y0, 90], [0, 1, 0]), 0, ARM_Y1 - ARM_Y0, 2.4, 'hi', { moving: true });
const LUG = { x: cx - 4, y: ARM_Y1, w: 8, d: 6.15, r: 1 };
T.slab('gauge.lug', LUG, 80, 14, 'mid', { moving: true, steps: 3, bevel: 0.4 });
T.cyl('gauge.lug.screw', cx, ARM_Y1 + 3, 2, 94, 4, 'mid', { moving: true, knurl: 16 });

// 6. The dial indicator: knurled bezel, 100-division face, bezel lock, stem and a plunger on a ball tip.
const ticks = k.radialTicks(cx, 0, DIAL.r - 2.6, 100, 5, DIAL_TOP, [1, 1.9], P);
const decades = k.radialTicks(cx, 0, DIAL.r - 2.6, 10, 1, DIAL_TOP, [0, 3], P);
const face = [
  L(k.knurl(cx, 0, DIAL.r, DIAL_TOP - 3.4, DIAL_TOP, 96, P, 0.3), { tone: 'lo' }),
  L(k.sideArc(cx, 0, DIAL.r, DIAL_TOP - 3.4, P, 40), { tone: 'faint' }),
  L(k.ring(cx, 0, DIAL.r - 2.2, DIAL_TOP, P, 72), { tone: 'lo' }),
  L(ticks.minor, { tone: 'lo' }), L(ticks.major, { tone: 'mid' }), L(decades.major, { tone: 'hi' }),
  L(k.ring(cx, 0, 4.2, DIAL_TOP, P, 24), { tone: 'faint' }),
  k.faceTextSvg(k.topMatrix([cx, 7.4], DIAL_TOP, P, 'x'), '0.4', { size: 2.2, tone: 'lo', anchor: 'middle' })
].join('');
T.cyl('gauge.dial.case', cx, 0, DIAL.r, DIAL.z, DIAL.h, 'hi', { moving: true, steps: 72, bevel: 0.8, crease: 'lo', inner: face, extra: needle });
T.thumb('gauge.dial.lock', G.frameAlong([cx + DIAL.r, 0, DIAL.z + 4.5], [1, 0, 0]), [1.1, 2], [2.2, 3], { moving: true });
T.cyl('gauge.dial.stem', cx, 0, 3.2, GLAND, DIAL.z - GLAND, 'mid', { moving: true, seams: [70], inner: L(k.ring(cx, 0, 1.5, GLAND, P, 16), { tone: 'faint' }) });

const ROD_F = G.frameAlong([cx, 0, GLAND], DOWN);
const ROD_TO = GLAND - (TIP_REST + TIP_R);
const rod = G.rodOut(ROD_F, 0, ROD_TO, 1.1, P, { stroke: STROKE });
const tipC = [cx, 0, TIP_REST + TIP_R];
T.put('gauge.plunger', [cx, 0, (GLAND + TIP_REST) / 2],
  `<g data-stroke><clipPath id="caliper-plunger-clip"><path data-hold d="${rod.clip}"/></clipPath>` +
  `<g clip-path="url(#caliper-plunger-clip)">${S(rod.paths, { tone: 'hi', lit: true, crease: 'none' })}</g>` +
  `${S(G.sphereOf(tipC, TIP_R, P), { tone: 'hi', lit: true })}</g>`,
  [A.disc(ROD_F, 0, ROD_TO, 1.1, { owner: 'gauge.plunger' }), A.ball(tipC, TIP_R, { owner: 'gauge.plunger' })],
  { moving: true });

const svg = paint(R, P, {
  width: W, height: H, states: A.uniformStates(12),
  label: 'A dial indicator on a height stand rides a straightedge on a granite surface plate. Under it stand four wrung stacks of gauge blocks, each 0.4 units tall per percentage point of the own-brand price index, so the plunger drops onto a stack and the needle reads that category.'
});

model.rig = {
  kind: 'caliper', P: camera(P), perTurn: PER_TURN, zero: ANVIL_TOP, rest: TIP_REST, tops: BLOCK_TOPS,
  needle: NEEDLE, mag: MAG
};

const delta = k.iso([STATION_X[3] - X0, 0, 0], P).map((n, i) => n - k.iso([0, 0, 0], P)[i]);
const partial = inspectorPartial({
  cls: 'data-caliper', id: 'caliper', model, svg, delta,
  title: 'Price Index Caliper · Measured Own-Brand Gap',
  source: 'Continente Portugal Online Shelf Census',
  meta: '209 comparable groups &middot; 38,383 products &middot; Dial indicator on a granite height stand',
  ariaLabel: 'Select a retail category to inspect. Use the arrow keys, Home or End.',
  fieldsLabel: 'Retail categories', selectLabel: 'Inspect category', hint: 'Tap a gauge-block stack to measure.',
  fill: (st) => st.rate,
  caption: 'Each gauge-block stack is 0.4 units tall per point of the own-brand price index. The stand switches its magnet off, slides along the fence, switches it on and lowers the plunger onto the stack; one dial turn is 40 units, so the needle reads the category\'s index in percent.'
});
publish(ROOT, { partialPath: 'partials/data-caliper.html', pagePath: 'retail-report.html', marker: 'retail-caliper', partial });

console.log(`Built retail caliper height stand: ${T.count()} solids; rates from Continente census`);
A.auditOrExit(R, P, { states: A.uniformStates(12) });
