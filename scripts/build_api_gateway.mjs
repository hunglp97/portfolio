import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as k from '../vendor/anatomy/iso-kit.mjs';
import * as G from '../vendor/anatomy/lathe.mjs';
import * as A from '../vendor/anatomy/audit.mjs';
import { shop, paint, inspectorPartial, publish, camera, UP, DOWN } from './anatomy-shop.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const model = {
  title: 'API & S3 delivery gateway',
  subtitle: 'Automated data delivery mechanisms',
  stages: [
    { id: 'auth', label: '1. Bearer gate', metric: '0 ms', sub: 'Token validation', note: 'Every HTTP request carries your feed key; invalid keys are rejected at the edge with zero latency.' },
    { id: 'rest', label: '2. REST stream', metric: '1,000/req', sub: 'Paginated JSON', note: 'Filtered, paginated records through /v1/records with field projection and date bounds.' },
    { id: 'parquet', label: '3. Parquet press', metric: 'Snappy', sub: 'Columnar compression', note: 'Large datasets compress into snappy columnar Parquet for instant Polars/DuckDB queries.' },
    { id: 's3', label: '4. S3 handshake', metric: 'Receipt', sub: 'approved.txt verified', note: 'Pushed directly to your AWS S3 bucket with SHA-256 checksums and automated confirmation receipt.' }
  ]
};

const STATION_X = [-90, -30, 30, 90];
const X0 = STATION_X[0];
const DECK = { x: -150, y: -70, w: 300, d: 100, r: 6 };
const CAB = { x: -140, y: -66, w: 280, d: 34, r: 3 };
const FACE_Y = CAB.y + CAB.d;
const CAB_H = 56;
const DESK = { x: -140, y: FACE_Y, w: 280, d: 50, r: 3 };
const DESK_H = 14;
const PROBE_Y = -22;
const SOCKET_TOP = DESK_H + 4;
const GLAND = 52;
const TIP_R = 1.6;
const TIP_REST = 40;

const W = 640, H = 450;
const P = k.fitProjection([
  ...k.boxCorners(DECK, -22, 0),
  ...k.boxCorners({ x: CAB.x - 2, y: CAB.y - 2, w: CAB.w + 4, d: CAB.d + 4, r: 0 }, 0, 63),
  ...[X0, -X0].flatMap((x) => [[x - 16, -60, 71], [x + 16, -44, 71], [x, PROBE_Y, 77]])
], W, H, { pad: 10, azimuth: 56, elevation: 32 });
const R = A.recorder(P, { order: ['selector'] });
const T = shop(P, R, { piece: 'selector', move: [STATION_X[3] - X0, 0, 0] });
const { S, L, at } = T;
const faceF = (x, z, y = FACE_Y) => G.frameAlong([x, y, z], [0, 1, 0]);

// A closed stadium slot in a vertical face y = const: vents and paper slots have no loose ends.
function faceSlot(x0, x1, y, zc, h) {
  const r = h / 2, pts = [];
  for (let i = 0; i <= 8; i++) { const a = -Math.PI / 2 + (i / 8) * Math.PI; pts.push([x1 - r + Math.cos(a) * r, y, zc + Math.sin(a) * r]); }
  for (let i = 0; i <= 8; i++) { const a = Math.PI / 2 + (i / 8) * Math.PI; pts.push([x0 + r + Math.cos(a) * r, y, zc + Math.sin(a) * r]); }
  return k.pathOf(pts.map((p) => at(p)), true);
}

// 1. Plinth on isolation feet.
for (const [i, [x, y]] of k.corners(DECK, 20).entries()) {
  T.cyl(`stand.foot.${i}.pad`, x, y, 8, -22, 3, 'lo', { bevel: 0.5 });
  T.cyl(`stand.foot.${i}.damper`, x, y, 6.2, -19, 7, 'mid', { seams: [-17, -15], crease: 'none' });
}
T.slab('stand.deck', DECK, -12, 12, 'mid', {
  bevel: 1.4, steps: 8,
  inner: L(k.sideSeam(DECK, -8, P, 8), { tone: 'faint' }) + L(k.planOutline(k.insetPlan(DECK, 5), 0, P), { tone: 'faint' }) + T.screwsAt(k.corners(DECK, 10), 0, 2)
});

// 2. Rack cabinet: lamp panel, two rows of bus jacks, vents, a cap and the selector rail.
const jackXs = Array.from({ length: 27 }, (_, i) => -130 + i * 10);
const JACK_Z = [28, 19];
const jacks = JACK_Z.map((z) => jackXs.map((x) => k.sideRing([x, FACE_Y, z], 1.7, 'y', P, 16)).join('')).join('');
const jackDots = k.dotsSvg(JACK_Z.flatMap((z) => jackXs.map((x) => at([x, FACE_Y, z]))), { size: 0.55, tone: 'lo' });
const LAMP_DX = 16;
const vents = STATION_X.flatMap((sx) => [faceSlot(sx - 24, sx - 4, FACE_Y, 48, 2.4), faceSlot(sx - 24, sx - 4, FACE_Y, 52, 2.4)]).join('');
T.slab('stand.cabinet', CAB, 0, CAB_H, 'mid', {
  bevel: 0.8, steps: 4,
  inner: L(k.sideSeam(CAB, 38, P, 4), { tone: 'faint' }) + L(k.sideSeam(CAB, 12, P, 4), { tone: 'faint' }) +
    L(jacks, { tone: 'lo' }) + jackDots + L(vents, { tone: 'lo' }) +
    k.dotsSvg([[-136, 52], [136, 52], [-136, 15], [136, 15]].map(([x, z]) => at([x, FACE_Y, z])), { size: 0.5, tone: 'hi' })
});
const CAP = { x: CAB.x - 2, y: CAB.y - 2, w: CAB.w + 4, d: CAB.d + 4, r: 3 };
const RAIL = { x: -130, y: -56, w: 260, d: 6, r: 1 };
const railTicks = k.topTicks(-126, 126, 4, 5, RAIL.y + RAIL.d, CAB_H + 3, [1.2, 2.2], P);
T.slab('stand.cap', CAP, CAB_H, 3, 'lo', { bevel: 0.5, steps: 4, inner: L(railTicks.minor, { tone: 'lo' }) + L(railTicks.major, { tone: 'mid' }) });
T.slab('stand.rail', RAIL, CAB_H + 3, 4, 'hi', { bevel: 0.4, steps: 3, inner: T.screwsAt([-110, -40, 40, 110].map((x) => [x, RAIL.y + 3]), CAB_H + 7, 1) });
for (const x of [-136, 136]) T.cyl(`stand.rail.stop.${x}`, x, RAIL.y + 3, 3.4, CAB_H + 3, 7, 'mid', { bevel: 0.4, seams: [CAB_H + 6] });

// Status jewels on the lamp panel, one per stage: a bezel and a domed lens that lights when the probe lands.
STATION_X.forEach((sx, i) => {
  const lamp = ['amber', 'green', 'blue', 'green'][i];
  T.disc(`station.${i}.lamp.bezel`, faceF(sx + LAMP_DX, 44), 0, 1.6, 3.8, 'mid', { stage: i });
  T.dome(`station.${i}.lamp.lens`, faceF(sx + LAMP_DX, 44, FACE_Y + 1.6), 3, 0.9, 'hi', { stage: i, attrs: `data-lamp="${lamp}"` });
});

// 3. Desk in front of the cabinet, with a probe socket under the selector at every station.
T.slab('stand.desk', DESK, 0, DESK_H, 'mid', {
  bevel: 1, steps: 4,
  inner: L(k.sideSeam(DESK, 5, P, 4), { tone: 'faint' }) + T.screwsAt([[-134, 13], [134, 13], [-134, -26], [134, -26]], DESK_H, 1.4)
});
STATION_X.forEach((sx, i) => {
  T.cyl(`station.${i}.socket`, sx, PROBE_Y, 3.6, DESK_H, 2.5, 'mid', { bevel: 0.4, inner: L(k.ring(sx, PROBE_Y, 2.8, DESK_H + 2.5, P, 20), { tone: 'faint' }) });
  T.cyl(`station.${i}.socket.sleeve`, sx, PROBE_Y, 2.2, DESK_H + 2.5, SOCKET_TOP - DESK_H - 2.5, 'hi', { inner: L(k.ring(sx, PROBE_Y, 1, SOCKET_TOP, P, 12), { tone: 'lo' }) });
});

// 4. Station 1 (Bearer gate): key switch, ruby jewel and the token jack the patch cord leaves from.
{
  const sx = STATION_X[0];
  T.slab('station.0.plate', { x: sx - 18, y: 0, w: 36, d: 16, r: 1.5 }, DESK_H, 1, 'lo', { steps: 3, bevel: 0 });
  T.cyl('station.0.lock.bezel', sx - 6, 8, 5.4, DESK_H + 1, 2, 'mid', { bevel: 0.4 });
  T.cyl('station.0.lock.barrel', sx - 6, 8, 4, DESK_H + 3, 3, 'hi', {
    inner: L(k.lineOnTop([sx - 6 - 2.8, 8], [sx - 6 + 2.8, 8], DESK_H + 6, P), { tone: 'lo' }) + L(k.ring(sx - 6, 8, 3, DESK_H + 6, P, 20), { tone: 'faint' })
  });
  T.cyl('station.0.jewel.bezel', sx + 9, 8, 4.4, DESK_H + 1, 1.8, 'mid');
  T.dome('station.0.jewel.lens', G.frameAlong([sx + 9, 8, DESK_H + 2.8], UP), 3.6, 1.1, 'hi', { attrs: 'data-lamp="red"' });
}

// Patch cords: braided cables from desk jacks up into the bus jacks on the cabinet face, each end in a plug shell.
function cord(name, from, to, via, stage) {
  T.cyl(`${name}.jack`, from[0], from[1], 2.8, DESK_H, 1.4, 'lo', { stage });
  T.cyl(`${name}.plug`, from[0], from[1], 1.9, DESK_H + 1.4, 5.6, 'mid', { knurl: 18, stage });
  T.disc(`${name}.bus.plug`, faceF(to[0], to[2]), 0, 6, 1.9, 'mid', { stage, inner: k.fadedSvg(G.ribsOf(faceF(to[0], to[2]), 1, 5, 1.9, 18, P, { fade: [0.05, 0.4], seams: true }), { tone: 'lo' }) });
  const start = [from[0], from[1], DESK_H + 7];
  const end = [to[0], FACE_Y + 6, to[2]];
  T.pipe(name, [start, [start[0], start[1], start[2] + 6], ...via, [end[0], end[1] + 7, end[2]], end], 0.9, {
    limp: true, bend: 4, tone: 'mid', stage, maxLength: 10,
    rings: { pitch: 1.6, twist: 1.2, cross: true, fade: [0.1, 0.55], tone: 'lo' }
  });
}
cord('station.0.cord', [X0 - 22, 8], [-120, 0, JACK_Z[0]], [[-118, -6, 31]], 0);
cord('station.1.cord', [STATION_X[1] - 18, -6], [-60, 0, JACK_Z[0]], [], 1);

// 5. Station 2 (REST stream): a row of four metal toggle switches; the bats throw when the probe lands.
{
  const sx = STATION_X[1];
  const plate = { x: sx - 12, y: 2, w: 36, d: 16, r: 1.5 };
  T.slab('station.1.plate', plate, DESK_H, 1, 'lo', { steps: 3, bevel: 0, inner: T.screwsAt(k.corners(plate, 2.4), DESK_H + 1, 1) });
  [-4, 4, 12, 20].forEach((dx, j) => {
    const x = sx + dx, y = 10, z = DESK_H + 1;
    T.cyl(`station.1.toggle.${j}.nut`, x, y, 2.6, z, 1.2, 'mid', { steps: 6 });
    T.cyl(`station.1.toggle.${j}.bushing`, x, y, 1.6, z + 1.2, 2.4, 'hi', { seams: [z + 2.4] });
    const bat = (tilt) => {
      const a = [0, Math.sin(tilt), Math.cos(tilt)];
      const F = G.frameAlong([x, y, z + 3.6], a);
      return { F, tip: G.add3(F.o, G.mul3(a, 8)) };
    };
    const off = bat(-0.42), on = bat(0.42);
    const draw = ({ F, tip }) => S(G.solidOf([[0, 1], [7.6, 0.6]], F, P), { tone: 'hi' }) + S(G.sphereOf(tip, 1.1, P), { tone: 'hi' });
    T.put(`station.1.toggle.${j}.bat`, [x, y, z + 6], `<g data-when="off">${draw(off)}</g><g data-when="on">${draw(on)}</g>`,
      [A.solid(off.F, [[0, 1], [7.6, 0.6]]), A.ball(off.tip, 1.1), A.solid(on.F, [[0, 1], [7.6, 0.6]]), A.ball(on.tip, 1.1)].map((s) => ({ ...s, owner: `station.1.toggle.${j}` })));
  });
}

// 6. Station 3 (Parquet press): three column dies under a platen, a screw, a crosshead on posts and a handwheel.
const WHEEL = { c: [STATION_X[2], 9, 0], r: 5.4 };
{
  const sx = STATION_X[2];
  T.slab('station.2.bed', { x: sx - 15, y: -2, w: 30, d: 22, r: 1.5 }, DESK_H, 3, 'lo', { steps: 3, bevel: 0.4 });
  [-7.5, 0, 7.5].forEach((dx, j) => {
    const die = { x: sx + dx - 3.2, y: 2, w: 6.4, d: 14, r: 0.5 };
    T.slab(`station.2.die.${j}`, die, DESK_H + 3, 10, 'hi', { steps: 2, bevel: 0.4, inner: L([4, 7].map((z) => k.sideSeam(die, DESK_H + 3 + z, P, 2)).join(''), { tone: 'faint' }) });
  });
  T.slab('station.2.platen', { x: sx - 11, y: 1, w: 22, d: 16, r: 1 }, DESK_H + 13, 2, 'mid', { steps: 3 });
  T.cyl('station.2.screw', sx, 9, 1.3, DESK_H + 15, 11, 'hi', { seams: [DESK_H + 17, DESK_H + 19, DESK_H + 21, DESK_H + 23], crease: 'none' });
  for (const dx of [-12.5, 12.5]) T.cyl(`station.2.post.${dx}`, sx + dx, 9, 1.6, DESK_H + 3, 23, 'mid', { crease: 'none' });
  T.slab('station.2.crosshead', { x: sx - 15, y: 5, w: 30, d: 8, r: 1.5 }, DESK_H + 26, 4, 'mid', { steps: 3, bevel: 0.4 });
  T.cyl('station.2.hub', sx, 9, 1.9, DESK_H + 30, 2.4, 'hi');
  WHEEL.c[2] = DESK_H + 33.6;
  const spokes = [0, 1, 2].map((j) => `<path data-spoke class="iso-line" data-tone="mid" d="${k.lineOnTop([sx + Math.sin(j * 2.094) * 2, 9 - Math.cos(j * 2.094) * 2], [sx + Math.sin(j * 2.094) * 6.3, 9 - Math.cos(j * 2.094) * 6.3], WHEEL.c[2], P)}"/>`).join('');
  T.cyl('station.2.wheel', sx, 9, 7, DESK_H + 32.4, 1.2, 'hi', { knurl: 48, bevel: 0.3, inner: L(k.ring(sx, 9, 2, WHEEL.c[2], P, 18), { tone: 'faint' }), extra: spokes });
  T.cyl('station.2.wheel.knob', sx, 9 - WHEEL.r, 0.9, WHEEL.c[2], 3.2, 'hi', { attrs: 'data-crank', bevel: 0.3 });
}

// 7. Station 4 (S3 dock): a cartridge in a tray against a spring latch, and a receipt printer with a toothed tear bar.
const PAPER = { slot: 10, len: 9, feed: 6 };
{
  const sx = STATION_X[3];
  const tray = { x: sx - 24, y: -6, w: 24, d: 24, r: 1.5 };
  T.slab('station.3.tray', tray, DESK_H, 2, 'lo', { steps: 3, bevel: 0.4 });
  T.slab('station.3.tray.wall', { x: tray.x, y: -6, w: 24, d: 3, r: 0.6 }, DESK_H + 2, 6, 'mid', { steps: 2 });
  const cart = { x: sx - 22, y: -3, w: 20, d: 14, r: 1 };
  T.slab('station.3.cartridge', cart, DESK_H + 2, 8, 'hi', {
    steps: 3, bevel: 0.6,
    inner: L(k.planOutline({ x: cart.x + 3, y: cart.y + 2.5, w: 14, d: 7, r: 0.8 }, DESK_H + 10, P, 3), { tone: 'faint' }) +
      L([0, 1, 2, 3, 4].map((j) => k.segment([cart.x + 4 + j * 3, cart.y + cart.d, DESK_H + 4], [cart.x + 4 + j * 3, cart.y + cart.d, DESK_H + 8], P)).join(''), { tone: 'lo' })
  });
  T.slab('station.3.latch', { x: sx - 15, y: 15, w: 6, d: 3, r: 0.6 }, DESK_H + 2, 6, 'mid', { steps: 2 });
  const spring = k.coil(cart.y + cart.d, 15, [sx - 12, DESK_H + 6], 1.4, 4, 'y', P);
  T.put('station.3.spring', [sx - 12, 13, DESK_H + 6],
    L(spring.back, { tone: 'lo' }) + S(G.disc(0, 15 - cart.y - cart.d, 0.5, G.frameAlong([sx - 12, cart.y + cart.d, DESK_H + 6], [0, 1, 0]), P), { tone: 'mid' }) + L(spring.front, { tone: 'hi' }),
    [A.disc(G.frameAlong([sx - 12, cart.y + cart.d, DESK_H + 6], [0, 1, 0]), 0, 15 - cart.y - cart.d, 1.4)]);

  const BODY = { x: sx + 2, y: -6, w: 22, d: PAPER.slot + 6, r: 1.5 };
  T.slab('station.3.printer', BODY, DESK_H, 14, 'mid', {
    steps: 3, bevel: 0.6,
    inner: L(faceSlot(sx + 5, sx + 21, PAPER.slot, DESK_H + 9, 1.4), { tone: 'lo' }) + L(k.sideSeam(BODY, DESK_H + 4, P, 3), { tone: 'faint' }) +
      T.screwsAt([[BODY.x + 3, BODY.y + 3], [BODY.x + BODY.w - 3, BODY.y + 3]], DESK_H + 14, 1)
  });
  const BAR = { x: sx + 4, y: PAPER.slot, w: 18, d: 1.4, r: 0.3 };
  const teeth = k.pathOf(Array.from({ length: 19 }, (_, j) => at([BAR.x + j, BAR.y + BAR.d, DESK_H + 7.6 + (j % 2 ? -0.6 : 0)])));
  T.slab('station.3.tearbar', BAR, DESK_H + 6, 1.6, 'hi', { steps: 2, bevel: 0, inner: L(teeth, { tone: 'lo' }) });

  // The receipt: a sheet with a serrated torn end, embossed ribs and printed rule lines, fed out of the slot.
  const PZ = DESK_H + 8.7, x0 = sx + 6, x1 = sx + 20, y0 = PAPER.slot - PAPER.feed - 4, y1 = PAPER.slot + PAPER.len;
  const ring = [[x0, y0], [x1, y0], [x1, y1]];
  for (let j = 1; j < 14; j++) ring.push([x1 - j, y1 + (j % 2 ? 0.9 : 0)]);
  ring.push([x0, y1]);
  const ribs = [2.5, 5, 7.5].map((d) => k.lineOnTop([x0, PAPER.slot + d], [x1, PAPER.slot + d], PZ + 0.5, P)).join('');
  const print = [[3.6, 8], [4.4, 5], [6.2, 9]].map(([d, len]) => k.lineOnTop([x0 + 1.5, PAPER.slot + d], [x0 + 1.5 + len, PAPER.slot + d], PZ + 0.5, P)).join('');
  const box = [x0 - 1, x1 + 1].flatMap((x) => [PAPER.slot, PAPER.slot + 40].flatMap((y) => [PZ - 1, PZ + 2].map((z) => at([x, y, z]))));
  const clip = k.pathOf(G.hullOf(box), true);
  T.put('station.3.receipt', [(x0 + x1) / 2, PAPER.slot + PAPER.len / 2, PZ],
    `<g data-feed><clipPath id="gateway-receipt-clip"><path data-hold d="${clip}"/></clipPath><g clip-path="url(#gateway-receipt-clip)">` +
    S(k.extrude(ring, PZ, 0.5, P, { convex: false }), { tone: 'hi', inner: L(ribs, { tone: 'faint' }) + L(print, { tone: 'lo', free: true }) }) + '</g></g>',
    [A.extruded([[x0, PAPER.slot], [x1, PAPER.slot], [x1, y1], [x0, y1]], PZ, 0.5)]);
}

// 8. Front name plate.
const LABEL = { x: 100, y: 21, w: 34, d: 7, r: 1 };
const LABEL_Z = 0;
T.slab('label.plate', LABEL, LABEL_Z, 0.8, 'lo', {
  bevel: 0, steps: 3,
  inner: L(k.planOutline(k.insetPlan(LABEL, 1.2), LABEL_Z + 0.8, P, 3), { tone: 'faint' }) +
    L([[2.6, 22], [4.4, 15]].map(([d, len]) => k.lineOnTop([LABEL.x + 4, LABEL.y + d], [LABEL.x + 4 + len, LABEL.y + d], LABEL_Z + 0.8, P)).join(''), { tone: 'lo', free: true })
});

// 9. The selector: a carriage on the rail, an arm out over the desk, and a head whose probe drops into a socket.
const cx = X0;
const CARRIAGE = { x: cx - 16, y: -60, w: 32, d: 16, r: 2 };
T.slab('selector.carriage', CARRIAGE, CAB_H + 7, 8, 'hi', { moving: true, bevel: 0.6, steps: 4, inner: T.screws(CARRIAGE, CAB_H + 15) + L(k.sideSeam(CARRIAGE, CAB_H + 10, P, 4), { tone: 'faint' }) });
T.thumb('selector.lock', G.frameAlong([cx + 16, -52, CAB_H + 11], [1, 0, 0]), [1.2, 2], [2.4, 3.4], { moving: true });
const HEAD = { x: cx - 7, y: PROBE_Y - 7, w: 14, d: 14, r: 2 };
T.disc('selector.arm', G.frameAlong([cx, CARRIAGE.y + CARRIAGE.d, CAB_H + 11], [0, 1, 0]), 0, HEAD.y - CARRIAGE.y - CARRIAGE.d, 2.6, 'hi', { moving: true });
T.slab('selector.head', HEAD, GLAND, 20, 'mid', {
  moving: true, bevel: 0.6, steps: 4,
  inner: L(k.sideSeam(HEAD, GLAND + 6, P, 4), { tone: 'faint' }) + L(k.sideRing([cx, HEAD.y + HEAD.d, GLAND + 13], 2, 'y', P, 16), { tone: 'lo' }) +
    L(k.ring(cx, PROBE_Y, 1.6, GLAND, P, 14), { tone: 'faint' })
});
T.cyl('selector.lens.bezel', cx, PROBE_Y, 3.6, GLAND + 20, 1.2, 'mid', { moving: true });
T.dome('selector.lens', G.frameAlong([cx, PROBE_Y, GLAND + 21.2], UP), 3, 0.9, 'hi', { moving: true, attrs: 'data-lamp="head"' });
const ROD_F = G.frameAlong([cx, PROBE_Y, GLAND], DOWN);
const ROD_TO = GLAND - (TIP_REST + TIP_R);
const rod = G.rodOut(ROD_F, 0, ROD_TO, 1.1, P, { stroke: 24 });
const tipC = [cx, PROBE_Y, TIP_REST + TIP_R];
T.put('selector.probe', [cx, PROBE_Y, (GLAND + TIP_REST) / 2],
  `<g data-stroke><clipPath id="gateway-probe-clip"><path data-hold d="${rod.clip}"/></clipPath>` +
  `<g clip-path="url(#gateway-probe-clip)">${S(rod.paths, { tone: 'hi', lit: true, crease: 'none' })}</g>${S(G.sphereOf(tipC, TIP_R, P), { tone: 'hi', lit: true })}</g>`,
  [A.disc(ROD_F, 0, ROD_TO, 1.1, { owner: 'selector.probe' }), A.ball(tipC, TIP_R, { owner: 'selector.probe' })], { moving: true });

const states = A.uniformStates(12);
const svg = paint(R, P, {
  width: W, height: H, states,
  label: 'A patch-bay console: a selector on a rail drops its probe into one of four desk stations, a key switch with a ruby jewel, a row of toggle switches fed by braided patch cords, a screw press of three column dies, and an S3 cartridge dock whose printer feeds out an approved.txt receipt.'
});

model.rig = { kind: 'gateway', P: camera(P), drop: TIP_REST - SOCKET_TOP, wheel: WHEEL, feed: PAPER.feed };

const delta = k.iso([STATION_X[3] - X0, 0, 0], P).map((n, i) => n - k.iso([0, 0, 0], P)[i]);
const partial = inspectorPartial({
  cls: 'data-gateway', id: 'gateway', model, svg, delta,
  title: 'API &amp; S3 Gateway · Automated Delivery Bus',
  source: 'High-Frequency Data Delivery Infrastructure',
  meta: 'Bearer authentication &middot; Paginated REST &middot; Snappy Parquet &middot; Direct S3 bucket push',
  ariaLabel: 'Select an API delivery stage to inspect. Use the arrow keys, Home or End.',
  fieldsLabel: 'Delivery stages', selectLabel: 'Inspect stage', hint: 'Tap a console station to route.',
  fill: () => 100,
  caption: 'The selector rides the rail, drops its probe into a station socket and that stage\'s jewel lights: the key switch checks the bearer token, the toggles open the paginated REST stream, the screw press packs columns into Snappy Parquet, and the S3 dock prints the approved.txt receipt.'
});
publish(ROOT, { partialPath: 'partials/data-gateway.html', pagePath: 'api.html', marker: 'api-gateway', partial });

console.log(`Built API gateway console: ${T.count()} solids; 4 delivery stages`);
// The desk is long enough to count as a rod; the cord rises from a jack screwed into that same desk top.
A.auditOrExit(R, P, { states, crowd: [['station.0.cord', 'stand.desk'], ['station.1.cord', 'stand.desk']] });
