import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const json = (path) => JSON.parse(read(path));
const hash = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const snapshot = json('scripts/upstream-snapshot.json');
const data = json('data/cases.json');
const promptTranslations = json('data/prompt-translations.zh-TW.json');
const community = data.cases.filter(item => item.submissionIssue);
const cases = data.cases.filter(item => !item.submissionIssue).sort((a, b) => a.id - b.id);
assert.equal(data.totalCases, cases.length + community.length);
assert.equal(cases.length, snapshot.totalCases, '案例數量與上游快照不符');
assert.deepEqual(cases.map((item) => item.id), snapshot.caseIds, '案例編號遺失或重複');
const sourceFields = cases.map(({ id, image, sourceLabel, sourceUrl, githubUrl }) => ({ id, image, sourceLabel, sourceUrl, githubUrl }));
assert.equal(hash(sourceFields), snapshot.sourceFieldsSha256, '圖片路徑或來源署名與上游不同');
const english = snapshot.englishPromptIds.map((id) => {
  const item = cases.find((entry) => entry.id === id);
  return { id, prompt: item.prompt };
});
assert.equal(hash(english), snapshot.englishPromptsSha256, '英文原始提示詞發生變動');
const englishIdSet = new Set(snapshot.englishPromptIds);
const translationIds = Object.keys(promptTranslations).map(Number).sort((a, b) => a - b);
assert.deepEqual(translationIds, [...snapshot.englishPromptIds].sort((a, b) => a - b), '英文提示詞翻譯快取不完整或包含多餘案例');
const sourceSha256 = (value) => createHash('sha256').update(value).digest('hex');
const translationText = (entry) => (typeof entry === 'string' ? entry : entry?.text || '');
const protectedTokens = (value) => value.match(/https?:\/\/[^\s<>"'`\])}]+|\[(?!["'])[^\]\n]{1,160}\]|\{(?:argument\b[^}\n]*|[A-Z][A-Z0-9_ /-]{1,100})\}|<\/?[A-Za-z][^>\n]{0,80}>/g) || [];

const forbidden = /提示词|来源|模板|界面|信息|視頻|軟件|代碼|項目|用戶|登錄|賬號|鏈接|數據|分辨率|默認|積分|锁定|层级|画面|明确|状态|评论|可读|约束/;
for (const item of cases) {
  assert.ok(item.title && !/^Case \d+$/.test(item.title), `案例 ${item.id} 未解析標題`);
  assert.ok(item.prompt.trim(), `案例 ${item.id} 遺失提示詞`);
  assert.ok(item.promptZh?.trim(), `案例 ${item.id} 遺失台灣繁中提示詞`);
  assert.equal(
    item.promptPreviewZh,
    item.promptZh.replace(/\n+/g, ' ').slice(0, 220),
    `案例 ${item.id} 的繁中提示詞預覽與全文不同步`
  );
  if (englishIdSet.has(item.id)) {
    const translation = promptTranslations[String(item.id)];
    assert.equal(translationText(translation), item.promptZh, `案例 ${item.id} 的繁中提示詞未連回翻譯快取`);
    assert.match(item.promptZh, /[\p{Script=Han}]/u, `案例 ${item.id} 的繁中提示詞沒有中文字元`);
    assert.notEqual(item.promptZh, item.prompt, `案例 ${item.id} 的英文原始提示詞未翻譯`);
    assert.deepEqual(
      protectedTokens(item.promptZh).sort(),
      protectedTokens(item.prompt).sort(),
      `案例 ${item.id} 的繁中提示詞遺失模板參數或網址`
    );
    if (translation && typeof translation === 'object' && translation.sourceSha256) {
      assert.equal(translation.sourceSha256, sourceSha256(item.prompt), `案例 ${item.id} 的翻譯來源已過期`);
    }
  }
  assert.ok(existsSync(resolve(root, 'data', item.image.replace(/^\//, ''))), `案例 ${item.id} 缺少圖片`);
  assert.ok(!forbidden.test(item.title), `案例 ${item.id} 標題用語未在地化：${item.title}`);
  const file = item.githubUrl.match(/docs\/(gallery-part-\d\.md)/)?.[1];
  assert.ok(file && read(`docs/${file}`).includes(`<a name="case-${item.id}"></a>`), `案例 ${item.id} 缺少文件錨點`);
}

const library = json('data/style-library.json');
function checkChineseFields(value, path = 'style-library', chinese = false) {
  if (typeof value === 'string' && chinese) {
    assert.ok(!forbidden.test(value), `中文欄位未在地化：${path}: ${value}`);
  } else if (Array.isArray(value)) {
    value.forEach((item, index) => checkChineseFields(item, `${path}[${index}]`, chinese));
  } else if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) {
      checkChineseFields(item, `${path}.${key}`, chinese || key === 'zh');
    }
  }
}
checkChineseFields(library);
const templates = read('docs/templates.md');
for (const template of library.templates) {
  assert.ok(templates.includes(`<a name="${template.anchor}"></a>`), `範本錨點不存在：${template.anchor}`);
  assert.ok(existsSync(resolve(root, 'data', template.cover.replace(/^\//, ''))), `範本缺少封面：${template.id}`);
  assert.ok(!forbidden.test(template.title.zh), `範本名稱未在地化：${template.title.zh}`);
  for (const id of template.exampleCases || []) {
    assert.ok(cases.some((item) => item.id === id), `範本 ${template.id} 引用不存在的案例 ${id}`);
  }
}
assert.match(read('index.html'), /lang="zh-TW"/);
console.log(`繁中驗證通過：${cases.length} 筆案例、${library.templates.length} 套範本、${english.length} 筆英文原始提示詞；圖片、來源與錨點完整。`);

for (const item of community) {
  assert.equal(item.id, 1000000 + item.submissionIssue);
  assert.ok(item.title && item.promptZh && item.sourceLabel);
  assert.ok(!forbidden.test(item.title), '投稿標題請改為台灣用語');
  assert.ok(data.categories.includes(item.category));
  assert.match(item.image, /^\/images\/submissions\/issue-\d+\.(png|jpg)$/);
  assert.ok(existsSync(resolve(root, 'data', item.image.slice(1))));
  assert.equal(item.githubUrl, `https://github.com/irons163/awesome-gpt-image-2-zh/issues/${item.submissionIssue}`);
}
