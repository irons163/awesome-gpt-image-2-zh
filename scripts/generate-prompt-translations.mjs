import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import OpenCC from 'opencc-js';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const casesFile = join(root, 'data', 'cases.json');
const snapshotFile = join(root, 'scripts', 'upstream-snapshot.json');
const outputFile = join(root, 'data', 'prompt-translations.zh-TW.json');
const source = JSON.parse(readFileSync(casesFile, 'utf8'));
const snapshot = JSON.parse(readFileSync(snapshotFile, 'utf8'));

function cleanPrompt(value = '') {
  return value.replace(/\\_/g, '_').replace(/\r/g, '').replace(/[ \t]+\n/g, '\n').trim();
}

function readPromptsFromDocs() {
  const prompts = new Map();
  for (const file of ['gallery-part-1.md', 'gallery-part-2.md']) {
    const text = readFileSync(join(root, 'docs', file), 'utf8');
    const chunks = text.split(/<a name="case-(\d+)"><\/a>/g);
    for (let index = 1; index < chunks.length; index += 2) {
      const id = Number(chunks[index]);
      const block = chunks[index + 1] || '';
      const prompt = cleanPrompt(block.replace(/\r/g, '').match(/\*\*提示[詞词]：\*\*[\s\S]*?```(?:text)?\n([\s\S]*?)```/)?.[1] || '');
      if (prompt) prompts.set(id, prompt);
    }
  }
  return prompts;
}

const converter = OpenCC.Converter({ from: 'cn', to: 'twp' });
const terms = [
  ['退出登入', '登出'],
  ['退出登录', '登出'],
  ['提示词', '提示詞'],
  ['提示字', '提示詞'],
  ['模板', '範本'],
  ['模版', '範本'],
  ['界面', '介面'],
  ['用户', '使用者'],
  ['用戶', '使用者'],
  ['信息', '資訊'],
  ['数据', '資料'],
  ['數據', '資料'],
  ['项目', '專案'],
  ['項目', '專案'],
  ['仓库', '儲存庫'],
  ['倉庫', '儲存庫'],
  ['软件', '軟體'],
  ['軟件', '軟體'],
  ['代码', '程式碼'],
  ['代碼', '程式碼'],
  ['登录', '登入'],
  ['登錄', '登入'],
  ['账号', '帳號'],
  ['賬號', '帳號'],
  ['账户', '帳戶'],
  ['賬戶', '帳戶'],
  ['文件夹', '資料夾'],
  ['文件夾', '資料夾'],
  ['文件', '檔案'],
  ['链接', '連結'],
  ['鏈接', '連結'],
  ['保存', '儲存'],
  ['視頻', '影片'],
  ['视频', '影片'],
  ['屏幕', '螢幕'],
  ['螢幕畫面', '螢幕畫面'],
  ['分辨率', '解析度'],
  ['分辨率', '解析度'],
  ['打印', '列印'],
  ['质量', '品質'],
  ['品質度', '品質'],
  ['默认', '預設'],
  ['默認', '預設'],
  ['积分', '點數'],
  ['積分', '點數'],
  ['套餐', '方案'],
  ['社媒', '社群媒體'],
  ['二维码', 'QR Code'],
  ['二維碼', 'QR Code'],
  ['生成', '產生'],
  ['图片', '圖片'],
  ['画面', '畫面'],
  ['後臺', '後台']
].sort(([left], [right]) => right.length - left.length);

function applyTaiwanTerms(value) {
  return terms.reduce((text, [from, to]) => text.split(from).join(to), value);
}

function protect(value) {
  const protectedValues = [];
  const pattern = /https?:\/\/[^\s<>"'`\])}]+|\[(?!["'])[^\]\n]{1,160}\]|\{(?:argument\b[^}\n]*|[A-Z][A-Z0-9_ /-]{1,100})\}|<\/?[A-Za-z][^>\n]{0,80}>/g;
  const text = value.replace(pattern, (match) => {
    const index = protectedValues.push(match) - 1;
    // A short alphanumeric marker survives Google Translate's web model more
    // reliably than punctuation or underscore-heavy tokens.
    return `XQZPH${index}`;
  });
  return {
    text,
    restore(translated) {
      return translated.replace(/XQZPH(\d+)/g, (match, index) => protectedValues[Number(index)] ?? match);
    },
    tokens: protectedValues
  };
}

async function sleep(milliseconds) {
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function translateLegacyRequest(value) {
  const body = new URLSearchParams({
    client: 'gtx',
    sl: 'en',
    tl: 'zh-TW',
    dt: 't',
    q: value
  });
  const response = await fetch('https://translate.googleapis.com/translate_a/single', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body
  });
  if (!response.ok) {
    const error = new Error(`translation endpoint returned ${response.status}`);
    error.status = response.status;
    const retryAfter = Number(response.headers.get('retry-after'));
    if (Number.isFinite(retryAfter) && retryAfter > 0) error.retryAfter = retryAfter * 1000;
    throw error;
  }
  const payload = await response.json();
  const segments = Array.isArray(payload?.[0]) ? payload[0] : [];
  const translated = segments.map((segment) => segment?.[0] || '').join('');
  if (!translated.trim()) throw new Error('translation endpoint returned an empty result');
  return translated;
}

async function translateRpcRequest(value) {
  const rpcRequest = JSON.stringify([[
    [
      'MkEWBc',
      JSON.stringify([[value, 'en', 'zh-TW', true], [null]]),
      null,
      'generic'
    ]
  ]]);
  const body = new URLSearchParams({ 'f.req': rpcRequest });
  const host = googleRpcHosts[googleRpcHostIndex++ % googleRpcHosts.length];
  const response = await fetch(
    `https://${host}/_/TranslateWebserverUi/data/batchexecute?rpcids=MkEWBc&bl=boq_translate-webserver_20201207.13_p0&soc-app=1&soc-platform=1&soc-device=1&rt=c`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'User-Agent': 'Mozilla/5.0 (compatible; awesome-gpt-image-2-zh translation script)'
      },
      body
    }
  );
  if (!response.ok) {
    const error = new Error(`Google Translate RPC returned ${response.status}`);
    error.status = response.status;
    const retryAfter = Number(response.headers.get('retry-after'));
    if (Number.isFinite(retryAfter) && retryAfter > 0) error.retryAfter = retryAfter * 1000;
    throw error;
  }
  const raw = await response.text();
  const line = raw.split('\n').find((candidate) => candidate.includes('"MkEWBc"'));
  if (!line) throw new Error('Google Translate RPC returned no translation payload');
  let payload;
  try {
    payload = JSON.parse(JSON.parse(line)[0][2]);
  } catch (error) {
    throw new Error(`Google Translate RPC returned malformed payload: ${error.message}`);
  }
  const segments = payload?.[1]?.[0]?.[0]?.[5] || [];
  const translated = segments.map((segment) => segment?.[0] || '').join('');
  if (!translated.trim()) throw new Error('Google Translate RPC returned an empty result');
  return translated;
}

const googleRpcHosts = [
  'translate.google.com',
  'translate.google.com.tw',
  'translate.google.co.uk',
  'translate.google.co.jp',
  'translate.google.com.au',
  'translate.google.ca',
  'translate.google.de',
  'translate.google.fr',
  'translate.google.es',
  'translate.google.co.in',
  'translate.google.com.hk',
  'translate.google.com.sg',
  'translate.google.co.kr',
  'translate.google.it',
  'translate.google.nl',
  'translate.google.se',
  'translate.google.at',
  'translate.google.be',
  'translate.google.ch',
  'translate.google.pl'
];
let googleRpcHostIndex = 0;

async function translateRequest(value) {
  let rpcError;
  for (let attempt = 0; attempt < googleRpcHosts.length; attempt += 1) {
    try {
      return await translateRpcRequest(value);
    } catch (error) {
      rpcError = error;
    }
  }
  // Keep the legacy endpoint as a compatibility fallback for environments
  // where every Translate web RPC host is unavailable.
  try {
    return await translateLegacyRequest(value);
  } catch (legacyError) {
    legacyError.cause = rpcError;
    throw legacyError;
  }
}

let googleBlocked = false;

async function translateMyMemoryRequest(value) {
  const url = `https://api.mymemory.translated.net/get?${new URLSearchParams({
    q: value,
    langpair: 'en|zh-TW',
    de: 'awesome-gpt-image-2-zh@users.noreply.github.com'
  })}`;
  const response = await fetch(url, { headers: { 'User-Agent': 'awesome-gpt-image-2-zh translation script' } });
  if (!response.ok) throw new Error(`MyMemory endpoint returned ${response.status}`);
  const payload = await response.json();
  const translated = payload?.responseData?.translatedText || '';
  if (payload?.responseStatus !== 200 || !translated.trim() || /QUERY LENGTH LIMIT EXCEEDED/i.test(translated)) {
    throw new Error(payload?.responseDetails || 'MyMemory returned an empty result');
  }
  return translated;
}

function splitTranslationChunks(value, maxLength = 460) {
  const chunks = [];
  let remaining = value;
  while (remaining.length > maxLength) {
    let cut = remaining.lastIndexOf('\n', maxLength);
    if (cut < Math.floor(maxLength * 0.45)) cut = remaining.lastIndexOf(' ', maxLength);
    if (cut < Math.floor(maxLength * 0.45)) cut = maxLength;
    const text = remaining.slice(0, cut);
    const whitespace = remaining.slice(cut).match(/^\s+/)?.[0] || '';
    chunks.push({ text, separator: whitespace });
    remaining = remaining.slice(cut + whitespace.length);
  }
  if (remaining) chunks.push({ text: remaining, separator: '' });
  return chunks;
}

async function translateGoogleChunks(value) {
  const chunks = splitTranslationChunks(value, 4_300);
  const translated = [];
  for (const chunk of chunks) {
    translated.push((await translateRequest(chunk.text)).trim());
    if (chunk.separator) await sleep(250);
  }
  return translated.map((text, index) => `${text}${chunks[index].separator}`).join('').trim();
}

async function translateMyMemory(value) {
  const chunks = splitTranslationChunks(value);
  const translated = new Array(chunks.length);
  let nextIndex = 0;
  async function worker() {
    while (nextIndex < chunks.length) {
      const index = nextIndex;
      nextIndex += 1;
      translated[index] = (await translateMyMemoryRequest(chunks[index].text)).trim();
      if (chunks[index].separator) await sleep(350);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(3, chunks.length) }, () => worker())
  );
  return translated.map((text, index) => `${text}${chunks[index].separator}`).join('').trim();
}

async function translatePrompt(prompt) {
  try {
    const parsed = JSON.parse(prompt);
    if (parsed && typeof parsed === 'object') {
      return translateJsonPrompt(parsed);
    }
  } catch {
    // Most prompts are free-form text. Only valid top-level JSON uses the
    // structure-preserving path below.
  }

  const protectedPrompt = protect(prompt);
  let lastError;
  for (let attempt = 0; attempt < 6; attempt += 1) {
    try {
      const translated = googleBlocked
        ? await translateMyMemory(protectedPrompt.text)
        : (protectedPrompt.text.length > 4_500
          ? await translateGoogleChunks(protectedPrompt.text)
          : await translateRequest(protectedPrompt.text));
      const restored = protectedPrompt.restore(translated);
      const missing = protectedPrompt.tokens.filter((token) => !restored.includes(token));
      if (missing.length) {
        throw new Error(`protected token count changed (${missing.length} missing)`);
      }
      return applyTaiwanTerms(converter(restored));
    } catch (error) {
      lastError = error;
      if (error.status === 429) {
        googleBlocked = true;
        break;
      }
      const retryDelay = error.status === 429
        ? Math.max(error.retryAfter || 60_000, 60_000)
        : Math.min(12_000, 800 * (2 ** attempt));
      await sleep(retryDelay);
    }
  }
  if (googleBlocked) {
    const translated = await translateMyMemory(protectedPrompt.text);
    const restored = protectedPrompt.restore(translated);
    const missing = protectedPrompt.tokens.filter((token) => !restored.includes(token));
    if (missing.length) throw new Error(`protected token count changed (${missing.length} missing)`);
    return applyTaiwanTerms(converter(restored));
  }
  throw lastError;
}

function collectJsonStrings(value, entries = []) {
  if (typeof value === 'string') {
    entries.push({ value, set: (nextValue) => nextValue });
    return entries;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      if (typeof item === 'string') {
        entries.push({ value: item, set: (nextValue) => { value[index] = nextValue; } });
      } else {
        collectJsonStrings(item, entries);
      }
    });
    return entries;
  }
  if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, item]) => {
      if (typeof item === 'string') {
        entries.push({ value: item, set: (nextValue) => { value[key] = nextValue; } });
      } else {
        collectJsonStrings(item, entries);
      }
    });
  }
  return entries;
}

async function translateJsonPrompt(parsed) {
  const entries = collectJsonStrings(parsed);
  const batchSize = 8;
  for (let batchStart = 0; batchStart < entries.length; batchStart += batchSize) {
    const batch = entries.slice(batchStart, batchStart + batchSize);
    const protectedValues = batch.map((entry) => protect(entry.value));
    const separator = `__XQSEP${batchStart}__`;
    const sourceText = protectedValues.map((entry) => entry.text).join(`\n${separator}\n`);
    let translatedText;
    let completed = false;
    let lastError;
    for (let attempt = 0; attempt < 6; attempt += 1) {
      try {
        if (googleBlocked) throw Object.assign(new Error('Google translation endpoint is rate limited'), { status: 429 });
        translatedText = await translateRequest(sourceText);
        const parts = translatedText.split(separator);
        if (parts.length !== batch.length) {
          throw new Error(`JSON value separator count changed (${parts.length}/${batch.length})`);
        }
        parts.forEach((part, index) => {
          const restored = protectedValues[index].restore(part.trim());
          const missing = protectedValues[index].tokens.filter((token) => !restored.includes(token));
          if (missing.length) throw new Error(`protected token count changed (${missing.length} missing)`);
          batch[index].set(applyTaiwanTerms(converter(restored)));
        });
        completed = true;
        break;
      } catch (error) {
        lastError = error;
        if (error.status === 429) {
          googleBlocked = true;
          break;
        }
        const retryDelay = error.status === 429
          ? Math.max(error.retryAfter || 60_000, 60_000)
          : Math.min(12_000, 800 * (2 ** attempt));
        await sleep(retryDelay);
      }
    }
    if (!completed && googleBlocked) {
      await Promise.all(batch.map(async (entry) => {
        const protectedValue = protect(entry.value);
        const translated = await translateMyMemory(protectedValue.text);
        const restored = protectedValue.restore(translated);
        const missing = protectedValue.tokens.filter((token) => !restored.includes(token));
        if (missing.length) throw new Error(`protected token count changed (${missing.length} missing)`);
        entry.set(applyTaiwanTerms(converter(restored)));
      }));
      completed = true;
    }
    if (!completed) throw lastError;
    if (batchStart + batchSize < entries.length) await sleep(250);
  }
  return JSON.stringify(parsed, null, 2);
}

function readCache() {
  try {
    const parsed = JSON.parse(readFileSync(outputFile, 'utf8'));
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function writeCache(cache) {
  const ordered = Object.fromEntries(
    Object.entries(cache).sort(([left], [right]) => Number(left) - Number(right))
  );
  writeFileSync(outputFile, `${JSON.stringify(ordered, null, 2)}\n`);
}

const casesById = new Map(source.cases.map((item) => [item.id, item]));
for (const [id, prompt] of readPromptsFromDocs()) {
  casesById.set(id, { ...(casesById.get(id) || { id }), prompt });
}
const targetIds = snapshot.englishPromptIds;
const cache = readCache();
const refresh = process.argv.includes('--refresh');
const sourceHash = (prompt) => createHash('sha256').update(prompt).digest('hex');
const cacheEntry = (id) => {
  const value = cache[String(id)];
  if (typeof value === 'string') return { sourceSha256: '', text: value };
  return value && typeof value === 'object' ? value : null;
};
const hasCachedTranslation = (id, prompt) => {
  const entry = cacheEntry(id);
  return Boolean(entry?.text?.trim()) && (!entry.sourceSha256 || entry.sourceSha256 === sourceHash(prompt));
};
if (process.argv.includes('--normalize-cache')) {
  for (const entry of Object.values(cache)) {
    if (!entry || typeof entry !== 'object' || typeof entry.text !== 'string') continue;
    entry.text = applyTaiwanTerms(entry.text);
  }
  writeCache(cache);
  console.log(`已重新套用台灣術語至 ${Object.keys(cache).length} 筆翻譯快取。`);
  process.exit(0);
}
const pending = targetIds.filter((id) => {
  const item = casesById.get(id);
  return refresh || !item || !hasCachedTranslation(id, item.prompt);
});
const requestedId = process.argv.find((value) => value.startsWith('--id='))?.slice('--id='.length);
const ids = requestedId ? pending.filter((id) => String(id) === requestedId) : pending;
const translationBySource = new Map(
  Object.values(cache)
    .map((entry) => (entry && typeof entry === 'object' ? entry : null))
    .filter((entry) => entry?.sourceSha256 && entry.text?.trim())
    .map((entry) => [entry.sourceSha256, entry.text])
);

if (requestedId && !casesById.has(Number(requestedId))) {
  throw new Error(`Unknown case id: ${requestedId}`);
}

console.log(`需要翻譯 ${ids.length} 筆；已有快取 ${targetIds.length - pending.length} 筆。`);
for (let index = 0; index < ids.length; index += 1) {
  const id = ids[index];
  const item = casesById.get(id);
  if (!item?.prompt) throw new Error(`Missing prompt for case ${id}`);
  const hash = sourceHash(item.prompt);
  const reused = !refresh && translationBySource.get(hash);
  const text = reused || await translatePrompt(item.prompt);
  cache[String(id)] = { sourceSha256: hash, text };
  translationBySource.set(hash, text);
  writeCache(cache);
  console.log(`[${index + 1}/${ids.length}] case-${id} (${item.prompt.length} chars${reused ? ', reused' : ''})`);
  if (index < ids.length - 1) await sleep(1_500);
}

const missing = targetIds.filter((id) => !cacheEntry(id)?.text?.trim());
if (!requestedId && missing.length) throw new Error(`翻譯未完成：${missing.join(', ')}`);
writeCache(cache);
console.log(`已寫入 ${targetIds.length} 筆台灣繁中提示詞：${outputFile}`);
