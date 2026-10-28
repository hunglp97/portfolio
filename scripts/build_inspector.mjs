import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as k from '../vendor/anatomy/iso-kit.mjs';
import * as A from '../vendor/anatomy/audit.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = readFileSync(resolve(ROOT, 'datasets/idealista-portugal.html'), 'utf8');
const selected = [
  ['price', 'Asking price', 'Every row has an asking price.'],
  ['price_per_sqm', 'Price per m²', 'Every row has a price per square metre.'],
  ['has_parking', 'Parking advertised', 'Empty means not advertised, not confirmed absent.'],
  ['floor', 'Floor', 'A floor value is present only where the source states it.']
];
const rowsMatch = source.match(/<span class="value">([\d,]+)<\/span>/);
if (!rowsMatch) throw new Error('Dataset row count missing');
const collection = source.match(/<span>Collected (\d{4}-\d{2}-\d{2})(?: to (\d{4}-\d{2}-\d{2}))?<\/span>/);
if (!collection) throw new Error('Dataset collection date missing');
const model = {
  dataset: 'Idealista Portugal', date: collection[2] || collection[1], rows: Number(rowsMatch[1].replaceAll(',', '')),
  source: 'datasets/idealista-portugal.html#schema',
  fields: selected.map(([key, label, note], i) => {
    const row = source.match(new RegExp('<tr><td class="field">' + key + '<\\/td>.*?<\\/tr>'))?.[0];
    const rate = Number(row?.match(/--pct: ([\d.]+)%/)?.[1]);
    if (!row || !Number.isFinite(rate) || rate < 0 || rate > 100) throw new Error('Fill rate missing: ' + key);
    const description = rate !== 100 && (key === 'price' || key === 'price_per_sqm') ?
      `A value is present in ${rate}% of rows; the rest are empty.` : note;
    return { key, label, note: description, rate, x: -90 + i * 60 };
  })
};
const W = 640, H = 320;
const base = { x: -144, y: -65, w: 288, d: 119, r: 6 };
const scannerBounds = { x: -101, y: -53, w: 202, d: 79, r: 0 };
const P = k.fitProjection([...k.boxCorners(base, -6, 8), ...k.boxCorners(scannerBounds, 16, 72)], W, H, { pad: 16, azimuth: 35, elevation: 36 });
const R = A.recorder(P, { order: ['scanner'] });
let count = 0;
function slab(name, plan, z, h, tone = 'mid', options = {}) {
  const { moving = false, inner = '', lit = false, ...meta } = options;
  const paths = k.slabOf(plan, z, h, P, 5, Math.min(.7, h / 3));
  const svg = k.solidSvg(paths, { tone, lit, inner });
  R.put({ name, piece: moving ? 'scanner' : 'fixed', move: moving ? [180, 0, 0] : undefined,
    at: [plan.x + plan.w / 2, plan.y + plan.d / 2, z + h / 2], svg,
    shapes: [R.solid(A.slab(plan, z, h, { name, ...meta }, 5))], moving });
  count++;
}
function screws(plan, z) {
  return k.dotsSvg(k.corners(plan, Math.min(3, plan.w / 4, plan.d / 4)).map(([x,y]) => k.iso([x,y,z],P)), { size: .6, tone: 'hi' });
}
for (const [i, [x, y]] of k.corners(base, 18).entries()) {
  slab(`stand.foot.${i}`, { x:x-7, y:y-7, w:14, d:14, r:3 }, -6, 3, 'lo');
  slab(`stand.pad.${i}`, { x:x-6, y:y-6, w:12, d:12, r:2 }, -3, 3, 'lo');
}
slab('stand.deck', base, 0, 8, 'mid', { inner: screws(base,8) + k.lineSvg(k.planOutline(k.insetPlan(base,5),8,P),{tone:'faint'}) });
for (const x of [-128, 116]) for (const y of [-53,-35]) {
  const p={x,y,w:12,d:10,r:2};
  slab(`rail.mount.${x}.${y}`,p,8,5,'mid',{inner:screws(p,13)});
}
for (const y of [-49,-31]) slab(`rail.${y}`,{x:-128,y,w:256,d:4,r:1},13,3,'hi');
for (const x of [-134,128]) for (const y of [-51,-33]) slab(`rail.stop.${x}.${y}`,{x,y,w:6,d:8,r:1},8,11,'mid');

model.fields.forEach((f,i) => {
  const x=f.x-20;
  slab(`tray.${i}.floor`,{x,y:-8,w:40,d:44,r:2},8,3,'mid');
  slab(`tray.${i}.left`,{x,y:-8,w:3,d:44,r:1},11,7,'mid');
  slab(`tray.${i}.right`,{x:x+37,y:-8,w:3,d:44,r:1},11,7,'mid');
  const rear={x:x+3,y:-8,w:34,d:3,r:.3};
  slab(`tray.${i}.back`,rear,11,30,'mid');
  slab(`tray.${i}.lip`,{x:x+3,y:31,w:34,d:5,r:.3},11,5,'hi');
  const height=26*f.rate/100;
  for(let card=0;card<4;card++) {
    const plan={x:x+3,y:-5,w:34,d:36,r:.5};
    slab(`tray.${i}.packet.${card}`,plan,11+card*height/4,height/4,'hi',{
      inner:card===3?k.lineSvg(k.planOutline(k.insetPlan(plan,3),11+height,P),{tone:'faint'}):''
    });
  }
});

slab('scanner.carriage',{x:-101,y:-53,w:22,d:26,r:2},16,8,'hi',{moving:true});
slab('scanner.cover',{x:-100,y:-51,w:20,d:22,r:1},24,2,'hi',{moving:true,inner:screws({x:-100,y:-51,w:20,d:22,r:1},26)});
slab('scanner.upright',{x:-94,y:-39,w:8,d:6,r:1},26,38,'mid',{moving:true});
slab('scanner.arm',{x:-94,y:-39,w:8,d:63,r:1},64,6,'hi',{moving:true});
slab('scanner.head',{x:-100,y:10,w:20,d:18,r:2},50,14,'hi',{moving:true});
slab('scanner.sensor',{x:-96,y:14,w:12,d:10,r:.5},49,1,'hi',{moving:true,lit:true});
slab('scanner.top',{x:-97,y:13,w:14,d:12,r:1},70,2,'hi',{moving:true});
const ruler={x:-124,y:44,w:248,d:5,r:1};
const ticks=k.topTicks(-120,120,5,5,44,8.6,[2,3.8],P);
slab('ruler',ruler,8,.6,'lo',{inner:k.lineSvg(ticks.minor,{tone:'lo'})+k.lineSvg(ticks.major,{tone:'mid'})});

const states=A.uniformStates(12);
A.settle(R,P,{states});
R.items.sort((a,b)=>a.key-b.key);
const svg=k.figureSvg({width:W,height:H,label:'A desktop card inspection machine. Four trays encode the published fill rates of four dataset fields by stack height. A scanner moves to the selected field.',body:R.items.map(item=>item.moving?`<g data-scanner>${item.svg}</g>`:item.svg)});
const delta=k.iso([180,0,0],P).map((n,i)=>n-k.iso([0,0,0],P)[i]);
const first=model.fields[0];
const partial=`<figure class="data-inspector iso iso-plate" data-ui aria-labelledby="inspector-title">
  <figcaption class="inspector-head"><h2 id="inspector-title">Look inside a dataset.</h2><a href="${model.source}" class="inspector-source">View schema</a></figcaption>
  <p class="inspector-meta">${model.dataset} · ${model.rows.toLocaleString('en-US')} rows · ${model.date}</p>
  <div class="inspector-art" data-delta-x="${delta[0]}" data-delta-y="${delta[1]}">${svg}</div>
  <div class="inspector-control"><label for="inspect-field">Inspect a field</label><select id="inspect-field" data-inspect-field disabled>${model.fields.map((f,i)=>`<option value="${i}">${f.label} · ${f.rate}% filled</option>`).join('')}</select><button type="button" class="inspector-tour" data-inspect-tour aria-pressed="false" hidden>Play tour</button></div>
  <div class="inspector-result" aria-live="polite" aria-atomic="true"><p><strong data-inspect-rate>${first.rate}%</strong><span>of rows have a value</span></p><p data-inspect-note>${first.note}</p></div>
  <p class="inspector-caption">Stack height shows field completeness, not dataset coverage. Published snapshot figures; this is not a live scan.</p>
  <noscript><p class="inspector-caption">Price 100%; price per m² 100%; parking advertised 53.7%; floor 42.9%. <a href="${model.source}">Read the full schema and limits</a>.</p></noscript>
  <script type="application/json" id="inspection-model">${JSON.stringify(model)}</script>
</figure>`;
writeFileSync(resolve(ROOT,'partials/data-inspector.html'),partial+'\n');
const homePath=resolve(ROOT,'index.html');
let home=readFileSync(homePath,'utf8');
const start='<!-- anatomy:inspector -->',end='<!-- /anatomy:inspector -->';
if(home.includes(start)) home=home.replace(new RegExp(start+'[\\s\\S]*?'+end),start+'\n'+partial+'\n'+end);
writeFileSync(homePath,home);
writeFileSync(resolve(ROOT,'assets/inspection-model.json'),JSON.stringify({...model,projection:P,delta,parts:count},null,2)+'\n');
console.log(`Built inspection bench: ${count} solids; rates from ${model.source}`);
A.auditOrExit(R,P,{states});
