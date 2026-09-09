import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
const { cases } = JSON.parse(readFileSync('data/cases.json', 'utf8'));
const out = resolve('tmp/imagegen/gpt-image-2.5');
mkdirSync(out, { recursive: true });
const model = 'gpt-image-2.5-sunburst';
const jobs = cases.map(item => ({ model, prompt: item.promptZh || item.prompt, out: `case-${item.id}.png`, size: 'auto', quality: 'high', output_format: 'png' }));
const inventory = cases.map((item, index) => ({
  caseId: item.id, title: item.title, model, status: 'pending-input-review',
  possibleReferenceRequired: /參考|上傳|照片中|輸入圖|附圖|uploaded|reference|attached|input image/i.test(jobs[index].prompt),
  referenceImages: [], promptSha256: createHash('sha256').update(jobs[index].prompt).digest('hex'),
  out: jobs[index].out,
}));
writeFileSync(`${out}/all-prompts.jsonl`, jobs.map(job => JSON.stringify(job)).join('\n') + '\n');
writeFileSync(`${out}/inventory.json`, JSON.stringify(inventory, null, 2) + '\n');
console.log(`Prepared ${jobs.length} prompts at ${out}. Input review required before generation; no API calls made.`);
