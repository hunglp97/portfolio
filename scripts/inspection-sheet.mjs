import { readFileSync } from 'node:fs';
import { iso } from '../vendor/anatomy/iso-kit.mjs';

const model = JSON.parse(readFileSync(new URL('../assets/inspection-model.json', import.meta.url)));
const css = readFileSync(new URL('../assets/inspector.css', import.meta.url), 'utf8') + `
.data-inspector { --anatomy-hi:#303035; --anatomy-mid:#77777d; --anatomy-lo:#96969c; --anatomy-faint:#b8b8bd; --anatomy-dot:#303035; --anatomy-lit:#151517; }
`;
const field = (i) => [['eval', `(() => { const s=document.querySelector('[data-inspect-field]'); s.value='${i}'; s.dispatchEvent(new Event('change',{bubbles:true})); return true; })()`]];
const named = (prefix) => `[data-name^="${prefix}"]`;

export default {
  page: '../tmp/pdfs/inspection-light.html',
  out: '../tmp/pdfs/data-inspection',
  layers: '.inspector-art > svg',
  reduced: true,
  maxPages: 2,
  views: {
    price: { actions: [['eval', `(() => { const s=document.createElement('style'); s.textContent=${JSON.stringify(css)}; document.head.append(s); return true; })()`], ...field(0)] },
    unit: { actions: field(1) },
    parking: { actions: field(2) },
    floor: { actions: field(3) },
  },
  name: 'Data inspection',
  title: 'Read a dataset before buying',
  number: 'HLP-001',
  tagline: 'HLP Data / hlpdata.com',
  question: 'What does a missing value mean?',
  lead: `Four trays show published field completeness across ${model.rows.toLocaleString('en-US')} rows in the ${model.dataset} snapshot. Stack height encodes filled rows. This is an illustration, not a live scan. Source: hlpdata.com/datasets/idealista-portugal.html#schema`,
  quote: `Snapshot ${model.date} / hlpdata.com`,
  numbers: model.fields.map(f => [String(f.rate), '%', f.label]),
  spec: [
    ['Dataset', model.dataset],
    ['Collected', model.date],
    ['Rows', model.rows.toLocaleString('en-US')],
    ...model.fields.map(f => [f.label, `${f.rate}% filled`]),
    ['Rates', 'Published product schema'],
    ['Encoding', 'Stack height = filled rows'],
    ['Source', 'hlpdata.com/datasets/idealista-portugal.html#schema'],
    ['Free sample', 'On the source product page'],
  ],
  why: {
    title: 'Completeness is not coverage',
    text: 'A field filled in every row can still describe a partial market snapshot. Check geography, collection dates and known limits separately. An empty parking value means not advertised; it does not confirm that a property has no parking.',
  },
  parts: [
    { id: 'scanner', name: 'Field selector', say: 'Moves above the selected tray; not a live scanning instrument.', select: named('scanner.'), at: iso([30, 19, 64], model.projection) },
    ...model.fields.map((f, i) => ({ id: f.key, name: f.label, say: `${f.rate}% of rows have a value.`, select: named(`tray.${i}.`) })),
    { id: 'rail', name: 'Guide rails', say: 'Keep the selector aligned with the four field trays.', select: named('rail.'), at: iso([-115, -47, 16], model.projection) },
    { id: 'stand', select: named('stand.') },
    { id: 'ruler', select: named('ruler') },
  ],
  main: { view: 'parking' },
  inset: { label: 'Asking price selected', view: 'price' },
  steps: [
    { view: 'price', title: 'Start with asking price', text: `Asking price is present in ${model.fields[0].rate}% of rows in this snapshot. A complete price field says nothing by itself about transaction prices or market coverage.`, focus: ['price', 'scanner'] },
    { view: 'unit', title: 'Check the unit price', text: `Price per square metre is present in ${model.fields[1].rate}% of rows. Read the schema and the sample to check the unit and decide whether the field suits your comparison.`, focus: ['price_per_sqm', 'scanner'] },
    { view: 'parking', title: 'Keep missing values distinct', text: `Parking is advertised in ${model.fields[2].rate}% of rows. Treat the remaining rows as not advertised, rather than converting them to a confirmed absence.`, focus: ['has_parking', 'scanner'] },
    { view: 'floor', title: 'Inspect the shortest stack', text: `Floor is present in ${model.fields[3].rate}% of rows, only where the source states it. Check how this missingness affects the analysis you intend to run.`, focus: ['floor', 'scanner'] },
  ],
  details: [
    { view: 'parking', title: 'Full stack', text: `${model.fields[0].rate}% filled: asking price.`, around: ['price'], focus: ['price'], hide: ['scanner'] },
    { view: 'parking', title: 'Partial stack', text: `${model.fields[2].rate}% filled: parking advertised.`, around: ['has_parking'], focus: ['has_parking'], hide: ['scanner'] },
    { view: 'parking', title: 'Shorter stack', text: `${model.fields[3].rate}% filled: floor stated.`, around: ['floor'], focus: ['floor'], hide: ['scanner'] },
  ],
};
