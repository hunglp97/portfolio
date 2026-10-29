// Shared workshop for the three subpage instruments (caliper, gateway, pipeline).
// Every helper draws a part with the Anatomy kit and records its true shape in the
// audit recorder, so `--audit` sees exactly what the page paints.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import * as k from '../vendor/anatomy/iso-kit.mjs';
import * as G from '../vendor/anatomy/lathe.mjs';
import * as A from '../vendor/anatomy/audit.mjs';
import { tubePieces, tubeSvg } from '../vendor/anatomy/tube.mjs';

export const UP = [0, 0, 1];
export const DOWN = [0, 0, -1];

export function shop(P, R, { piece = 'moving', move = [0, 0, 0] } = {}) {
  let solids = 0;
  const S = (paths, style) => k.solidSvg(paths, style);
  const L = (d, style) => k.lineSvg(d, style);
  const at = (p) => k.iso(p, P);

  function put(name, centre, svg, shapes, { moving = false, attrs = '', bias = 0, stage } = {}) {
    for (const shape of shapes) shape.name ??= name;
    R.put({
      name, at: centre, bias, svg, attrs, stage, moving,
      piece: moving ? piece : 'fixed', move: moving ? move : undefined,
      shapes: shapes.map((shape) => R.solid(shape))
    });
    solids += shapes.filter((shape) => shape.kind !== 'tube').length;
  }

  function slab(name, plan, z, h, tone = 'mid', o = {}) {
    const { inner = '', lit = false, bevel = Math.min(0.7, h / 3), steps = 5, crease, meta = {}, ...rest } = o;
    const svg = S(k.slabOf(plan, z, h, P, steps, bevel), { tone, lit, inner, ...(crease ? { crease } : {}) });
    put(name, [plan.x + plan.w / 2, plan.y + plan.d / 2, z + h / 2], svg, [A.slab(plan, z, h, { ...meta }, steps)], rest);
  }

  // A vertical turned part standing on the floor: puck, post, foot, knob.
  function cyl(name, cx, cy, r, z, h, tone = 'mid', o = {}) {
    const { inner = '', lit = false, bevel = 0, steps = Math.max(20, Math.round(r * 5)), crease, knurl = 0, seams = [], extra = '', meta = {}, ...rest } = o;
    const lines = [
      knurl ? L(k.knurl(cx, cy, r, z, z + h, knurl, P, 0.35), { tone: 'lo' }) : '',
      seams.length ? L(seams.map((s) => k.sideArc(cx, cy, r, s, P, 24)).join(''), { tone: 'faint' }) : '',
      inner
    ].join('');
    const svg = S(k.cylinder(cx, cy, r, z, h, P, steps, bevel), { tone, lit, inner: lines, ...(crease ? { crease } : {}) }) + extra;
    put(name, [cx, cy, z + h / 2], svg, [A.cylinder(cx, cy, r, z, h, { ...meta })], rest);
  }

  // A turned part on any axis, closed to the axis at both ends.
  function turned(name, F, profile, tone = 'hi', o = {}) {
    const { inner = '', lit = false, extra = '', meta = {}, smooth, ...rest } = o;
    const soft = profile.some((p) => p[2]);
    const paths = G.solidOf(profile, F, P, { smooth: smooth ?? (soft ? { rows: 3 } : false) });
    const mid = (profile[0][0] + profile[profile.length - 1][0]) / 2;
    const shape = smooth?.radius ? A.solid(F, profile, { ...meta, radius: smooth.radius }) : A.solid(F, profile, { ...meta, curve: soft ? profile : undefined });
    put(name, G.add3(F.o, G.mul3(F.a, mid)), S(paths, { tone, lit, inner }) + extra, [shape], rest);
  }

  // A domed lens: a spherical cap of radius rs whose centre sits `sink` behind its base, shaded from the true sphere.
  function dome(name, F, rs, sink, tone = 'hi', o = {}) {
    const radius = (s) => Math.sqrt(Math.max(0, rs * rs - (s + sink) ** 2));
    const slope = (s) => -(s + sink) / Math.max(radius(s), 0.05);
    const top = rs - sink - 0.06;
    turned(name, F, [[0, radius(0)], [top, radius(top)]], tone, { ...o, smooth: { slope, radius, rows: 4 } });
  }

  function disc(name, F, s0, s1, r, tone = 'mid', o = {}) {
    const { inner = '', lit = false, extra = '', meta = {}, ...rest } = o;
    put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), S(G.disc(s0, s1, r, F, P), { tone, lit, inner }) + extra,
      [A.disc(F, s0, s1, r, { ...meta })], rest);
  }

  // A knurled thumb screw on any axis: a neck, then a knurled head, both from the frame's origin.
  function thumb(name, F, neck, head, o = {}) {
    const [nr, nl] = neck, [hr, hl] = head;
    disc(`${name}.neck`, F, 0, nl, nr, 'mid', o);
    const ribs = G.ribsOf(F, nl, nl + hl, hr, 22, P, { fade: [0.05, 0.4], seams: true });
    disc(`${name}.head`, F, nl, nl + hl, hr, 'mid', { ...o, inner: k.fadedSvg(ribs, { tone: 'lo' }) });
  }

  function ball(name, centre, r, tone = 'hi', o = {}) {
    const { lit = false, meta = {}, ...rest } = o;
    put(name, centre, S(G.sphereOf(centre, r, P), { tone, lit }), [A.ball(centre, r, { ...meta })], rest);
  }

  // A pipe or cable: legs filleted, cut into depth-sortable chunks, recorded as a route.
  function pipe(name, control, r, o = {}) {
    const { bend = 3, tone = 'hi', gaps = [], rings, limp = false, maxLength = 14, moving = false, owner, touch, bundle, attrs = '', stage, caps = true } = o;
    const line = G.fillet(control, Math.max(r * bend, 2.5), 10, { P, tube: r });
    R.route(name, line, r, { owner: owner ?? name, touch, bundle, limp, gaps, piece: moving ? piece : 'fixed', move: moving ? move : undefined });
    tubePieces(line, r, P, { maxLength, gaps, caps, ...(rings ? { rings } : {}) }).forEach((part, index) => {
      R.put({
        name: `${name}:${index}`, at: part.mid, svg: tubeSvg(part, { tone }), attrs, stage, moving,
        piece: moving ? piece : 'fixed', move: moving ? move : undefined, route: name, chunk: index,
        shapes: [A.tube(part.points, part.radii)]
      });
    });
    return line;
  }

  // Socket-head cap screws: a counterbore ring and the head dot.
  const screwsAt = (points, z, ring = 1.6) =>
    L(points.map(([x, y]) => k.ring(x, y, ring, z, P, 14)).join(''), { tone: 'lo' }) + k.dotsSvg(points.map(([x, y]) => at([x, y, z])), { size: 0.5, tone: 'hi' });
  const screws = (plan, z, inset = Math.min(3.2, plan.w / 4, plan.d / 4)) => screwsAt(k.corners(plan, inset), z, Math.min(1.4, inset * 0.5));

  return { put, slab, cyl, turned, dome, disc, thumb, ball, pipe, screws, screwsAt, S, L, at, count: () => solids };
}

// Settle the painter's keys, then paint every item in its wrapper group.
export function paint(R, P, { width, height, label, states }) {
  A.settle(R, P, { states });
  R.items.sort((a, b) => a.key - b.key);
  const body = R.items.map((item) => {
    const stage = item.stage ?? item.name.match(/^station\.(\d)\./)?.[1];
    const tags = [
      `data-name="${item.name}"`,
      item.moving ? 'data-scanner' : '',
      stage !== undefined ? `data-stage="${stage}"` : '',
      stage !== undefined && String(stage) === '0' ? 'data-active="true"' : '',
      item.attrs || ''
    ].filter(Boolean).join(' ');
    return `<g ${tags}>${item.svg}</g>`;
  });
  return k.figureSvg({ width, height, label, body });
}

// The card that every subpage instrument shares; only words and the figure differ.
export function inspectorPartial({ cls, id, title, source, meta, ariaLabel, fieldsLabel, selectLabel, hint, caption, model, svg, delta, fill }) {
  const first = model.stages[0];
  return `<figure class="data-inspector ${cls} iso iso-plate" data-ui aria-labelledby="${id}-title">
  <figcaption class="inspector-head">
    <h2 id="${id}-title">${title}</h2>
    <span class="inspector-source">${source}</span>
  </figcaption>
  <p class="inspector-meta">${meta}</p>
  <div class="inspector-layout">
    <div class="inspector-art" tabindex="-1" role="slider" aria-disabled="true" aria-label="${ariaLabel}" aria-valuemin="0" aria-valuemax="${model.stages.length - 1}" aria-valuenow="0" aria-valuetext="${first.label}: ${first.metric}" data-delta-x="${delta[0]}" data-delta-y="${delta[1]}">
      ${svg}
    </div>
    <div class="inspector-desk">
      <div class="inspector-fields" aria-label="${fieldsLabel}" hidden>
        ${model.stages.map((st, i) => `
          <button type="button" data-inspect-choice="${i}" aria-pressed="${i === 0}">
            <span>${st.label}</span>
            <strong>${st.metric}</strong>
            <span class="inspector-field-fill" aria-hidden="true" style="--field-fill:${fill(st, i)}%"></span>
          </button>
        `).join('')}
      </div>
      <div class="inspector-control">
        <label for="inspect-${id}-stage">${selectLabel}</label>
        <select id="inspect-${id}-stage" data-inspect-field disabled>
          ${model.stages.map((st, i) => `<option value="${i}">${st.label} · ${st.sub}</option>`).join('')}
        </select>
        <span class="inspector-hint">${hint}</span>
        <button type="button" class="inspector-tour" data-inspect-tour aria-pressed="false" hidden>Play tour</button>
      </div>
      <div class="inspector-result" aria-live="polite" aria-atomic="true">
        <p><strong data-inspect-rate>${first.metric}</strong><span data-inspect-sub>${first.sub}</span></p>
        <p data-inspect-note>${first.note}</p>
      </div>
    </div>
  </div>
  <div class="inspector-foot">
    <p class="inspector-caption">${caption}</p>
  </div>
  <script type="application/json" id="${id}-model">${JSON.stringify(model)}</script>
</figure>`;
}

// Write the partial and splice it into its page between the anatomy markers.
export function publish(root, { partialPath, pagePath, marker, partial }) {
  writeFileSync(resolve(root, partialPath), partial + '\n');
  const path = resolve(root, pagePath);
  let page = readFileSync(path, 'utf8');
  const start = `<!-- anatomy:${marker} -->`, end = `<!-- /anatomy:${marker} -->`;
  if (page.includes(start)) page = page.replace(new RegExp(start + '[\\s\\S]*?' + end), () => start + '\n' + partial + '\n' + end);
  else page = page.replace('<aside class="buy-panel"', `${start}\n${partial}\n${end}\n\n      <aside class="buy-panel"`);
  writeFileSync(path, page);
}

// The projection the live page needs to rebuild needles, pointers and orbiting parts.
export const camera = (P) => ({ origin: P.origin, scale: P.scale, azimuth: P.azimuth, elevation: P.elevation });
