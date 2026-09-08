import {readFileSync} from 'node:fs';
const taxonomy = JSON.parse(readFileSync(new URL('../../data/cases.json', import.meta.url)));
export function validateTags(data) {
  if (!taxonomy.categories.includes(data.category)) throw new Error('INVALID');
  const result = {category:data.category};
  for (const key of ['styles','scenes']) {
    if (!Array.isArray(data[key]) || !data[key].length || data[key].length > taxonomy[key].length || data[key].some(value => !taxonomy[key].includes(value))) throw new Error('INVALID');
    result[key] = [...new Set(data[key])];
  }
  return result;
}
export function formatTags(data) {
  return '### 分類與標籤\n\n    ' + JSON.stringify(validateTags(data)) + '\n\n### 投稿聲明';
}
export function parseTags(body) {
  // Older submissions predate the classification fields and remain reviewable.
  if (!/^### 分類與標籤\n\n/m.test(body)) return {category:'Other Use Cases',styles:['Community'],scenes:['Creative']};
  const match = body.match(/^### 分類與標籤\n\n    ([^\n]+)\n\n### 投稿聲明$/m);
  if (!match) throw new Error('Invalid submission tags');
  return validateTags(JSON.parse(match[1]));
}
