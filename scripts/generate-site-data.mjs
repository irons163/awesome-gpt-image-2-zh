import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const docsDir = join(root, 'docs');
const outFile = join(root, 'data', 'cases.json');
const styleLibraryFile = join(root, 'data', 'style-library.json');
const promptTranslationsFile = join(root, 'data', 'prompt-translations.zh-TW.json');
const imageVariants = JSON.parse(readFileSync(join(root, 'data', 'image-variants.json'), 'utf8')).cases;
function variantsFor(id) {
  return (imageVariants[id] || []).filter(item => item.status === 'published').map(item => {
    if (!/^gpt-image-2\.5-(sunburst|flare)(?:-\d{4}-\d{2}-\d{2})?$/.test(item.model) || !item.generatedDate || !item.promptSha256 || !item.outputSha256) throw new Error(`Missing generation provenance for case ${id}`);
    if (!/^\/images\/[a-zA-Z0-9_./-]+$/.test(item.image) || item.image.includes('..')) throw new Error(`Invalid variant image for case ${id}`);
    const imagePath = join(root, 'data', item.image.slice(1));
    if (!existsSync(imagePath) || createHash('sha256').update(readFileSync(imagePath)).digest('hex') !== item.outputSha256) throw new Error(`Missing or changed variant image for case ${id}`);
    return item;
  });
}
const upstreamRepositoryUrl = 'https://github.com/freestylefly/awesome-gpt-image-2';
const repositoryUrl = 'https://github.com/irons163/awesome-gpt-image-2-zh';
const styleLibrary = JSON.parse(readFileSync(styleLibraryFile, 'utf8'));
const promptTranslations = existsSync(promptTranslationsFile)
  ? JSON.parse(readFileSync(promptTranslationsFile, 'utf8'))
  : {};

function promptTranslationFor(id, prompt) {
  const entry = promptTranslations[String(id)];
  if (typeof entry === 'string') return entry;
  if (!entry || typeof entry !== 'object') return '';
  if (entry.sourceSha256) {
    const sourceSha256 = createHash('sha256').update(prompt).digest('hex');
    if (entry.sourceSha256 !== sourceSha256) {
      throw new Error(`Stale zh-TW prompt translation for case ${id}; run npm run generate:prompt-translations`);
    }
  }
  return typeof entry.text === 'string' ? entry.text : '';
}

const galleryFiles = [
  { file: 'gallery-part-1.md', part: 1 },
  { file: 'gallery-part-2.md', part: 2 }
];

const categoryLabels = Object.fromEntries(
  styleLibrary.categories.map((category) => [category.anchor, category.value])
);

const featuredIds = new Set([
  1, 2, 6, 17, 166, 310, 330, 334, 338, 341, 344, 346, 350, 353, 354, 359, 360,
  361, 362, 365, 370, 373, 375, 376, 377, 378
]);

function cleanText(value = '') {
  return value
    .replace(/\\_/g, '_')
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .trim();
}

function stripMarkdown(value = '') {
  return cleanText(value)
    .replace(/\*\*/g, '')
    .replace(/`/g, '')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .trim();
}

function parseCategoryMap() {
  const text = readFileSync(join(docsDir, 'gallery.md'), 'utf8');
  const map = new Map();
  const sections = text.split(/<a name="(cat-[^"]+)"><\/a>/g);

  for (let i = 1; i < sections.length; i += 2) {
    const categoryId = sections[i];
    const body = sections[i + 1] || '';
    const category = categoryLabels[categoryId] || 'Other Use Cases';
    for (const match of body.matchAll(/#case-(\d+)\)/g)) {
      map.set(Number(match[1]), category);
    }
  }

  return map;
}

function extractPrompt(block) {
  const normalized = block.replace(/\r/g, '');
  const match = normalized.match(/\*\*提示[詞词]：\*\*[\s\S]*?```(?:text)?\n([\s\S]*?)```/);
  return cleanText(match?.[1] || '');
}

function extractSource(block) {
  const line = block.match(/\*\*[來来]源：\*\*\s*([^\n]+)/)?.[1] || '';
  const link = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
  if (link) {
    return {
      label: stripMarkdown(link[1]),
      url: link[2]
    };
  }
  return {
    label: stripMarkdown(line) || '社群來源',
    url: ''
  };
}

function inferCategory(caseItem) {
  if (caseItem.category) return caseItem.category;
  const text = `${caseItem.title} ${caseItem.prompt}`.toLowerCase();
  const rules = [
    ['UI & Interfaces', ['ui', 'app', 'interface', 'dashboard', 'screenshot', '網頁', '介面', '截圖']],
    ['Charts & Infographics', ['infographic', 'diagram', 'chart', 'atlas', '圖譜', '資訊圖', '圖解']],
    ['Posters & Typography', ['poster', 'cover', 'typography', '海報', '封面', '字型']],
    ['Products & E-commerce', ['product', 'packaging', 'e-commerce', '商品', '電商', '包裝']],
    ['Brand & Logos', ['logo', 'brand', 'identity', '品牌', '標誌']],
    ['Architecture & Spaces', ['architecture', 'interior', 'map', '建築', '室內', '地圖']],
    ['Photography & Realism', ['photo', 'portrait', 'camera', 'realistic', '寫真', '攝影', '寫實']],
    ['Illustration & Art', ['illustration', 'painting', 'watercolor', '插畫', '藝術', '水墨']],
    ['Characters & People', ['character', 'pose', 'avatar', '角色', '人物', '頭像']],
    ['Scenes & Storytelling', ['storyboard', 'scene', 'narrative', '場景', '敘事', '分鏡']],
    ['History & Classical Themes', ['history', 'dynasty', 'classical', '歷史', '古風', '唐朝', '宋']],
    ['Documents & Publishing', ['document', 'manual', 'prescription', '檔案', '手冊', '處方']]
  ];
  return rules.find(([, keys]) => keys.some((key) => text.includes(key)))?.[0] || 'Other Use Cases';
}

function inferTags(caseItem) {
  const text = `${caseItem.title} ${caseItem.prompt}`.toLowerCase();
  const styleOrder = ['UI', 'Infographic', 'Poster', 'Realistic', 'Illustration', 'Product', 'Brand', 'Character', 'Classical', '3D'];
  const sceneOrder = ['Tech', 'Commerce', 'Education', 'Social', 'Fashion', 'Food', 'Travel', 'Story', 'History', 'Creative'];
  const styleByValue = new Map(styleLibrary.styles.map((style) => [style.value, style]));
  const sceneByValue = new Map(styleLibrary.scenes.map((scene) => [scene.value, scene]));
  const styleRules = styleOrder.map((value) => [
    value,
    (styleByValue.get(value)?.keywords || []).map((key) => key.toLowerCase())
  ]);
  const sceneRules = sceneOrder.map((value) => [
    value,
    (sceneByValue.get(value)?.keywords || []).map((key) => key.toLowerCase())
  ]);

  const pick = (rules, fallback) => {
    const tags = rules
      .filter(([, keys]) => keys.some((key) => text.includes(key)))
      .map(([label]) => label);
    return tags.length ? tags.slice(0, 3) : [fallback];
  };

  return {
    styles: pick(styleRules, caseItem.category.split(' & ')[0].replace('Posters', 'Poster')),
    scenes: pick(sceneRules, 'Creative')
  };
}

function parseCases() {
  const categoryMap = parseCategoryMap();
  const cases = [];

  for (const { file, part } of galleryFiles) {
    const text = readFileSync(join(docsDir, file), 'utf8');
    const chunks = text.split(/<a name="case-(\d+)"><\/a>/g);

    for (let i = 1; i < chunks.length; i += 2) {
      const id = Number(chunks[i]);
      const block = chunks[i + 1] || '';
      const title = stripMarkdown(block.match(/###\s*例\s*\d+：([^\n]+)/)?.[1] || `Case ${id}`);
      const imageMatch = block.match(/!\[([^\]]*)\]\(([^)]+)\)/);
      const prompt = extractPrompt(block);
      if (!prompt) throw new Error(`Missing prompt in ${file}, case ${id}`);
      if (cases.some((item) => item.id === id)) throw new Error(`Duplicate case ${id}`);
      const source = extractSource(block);
      const category = inferCategory({
        title,
        prompt,
        category: categoryMap.get(id)
      });
      const image = imageMatch?.[2]
        ? imageMatch[2].replace('../data/', '/')
        : `/images/case${id}.jpg`;
      const tags = inferTags({ title, prompt, category });
      const promptZh = promptTranslationFor(id, prompt) || (/[㐀-鿿]/u.test(prompt) ? prompt : '');
      if (!promptZh) {
        throw new Error(`Missing zh-TW prompt translation in ${promptTranslationsFile}, case ${id}`);
      }

      cases.push({
        model: 'gpt-image-2',
        ...(variantsFor(id).length ? { imageVariants: variantsFor(id) } : {}),
        id,
        title,
        image,
        imageAlt: stripMarkdown(imageMatch?.[1] || title),
        sourceLabel: source.label,
        sourceUrl: source.url,
        prompt,
        promptPreview: prompt.replace(/\n+/g, ' ').slice(0, 220),
        promptZh,
        promptPreviewZh: promptZh.replace(/\n+/g, ' ').slice(0, 220),
        category,
        styles: tags.styles,
        scenes: tags.scenes,
        featured: featuredIds.has(id),
        githubUrl: `${upstreamRepositoryUrl}/blob/main/docs/gallery-part-${part}.md#case-${id}`,
        localGithubUrl: `${repositoryUrl}/blob/main/docs/gallery-part-${part}.md#case-${id}`
      });
    }
  }

  return cases.sort((a, b) => b.id - a.id);
}

const submissionDir = join(root, 'data', 'submissions');
const community = existsSync(submissionDir) ? readdirSync(submissionDir).filter(name => /^issue-\d+\.json$/.test(name)).map(name => JSON.parse(readFileSync(join(submissionDir, name), 'utf8'))) : [];
const cases = [...parseCases(), ...community].sort((a, b) => b.id - a.id);
if (new Set(cases.map(item => item.id)).size !== cases.length) throw new Error('Duplicate case IDs');
if (!cases.length) throw new Error('No cases found in gallery documents');
const categories = [...new Set(cases.map((item) => item.category))].sort();
const styles = [...new Set(cases.flatMap((item) => item.styles))].sort();
const scenes = [...new Set(cases.flatMap((item) => item.scenes))].sort();

const payload = {
  repository: repositoryUrl,
  totalCases: cases.length,
  categories,
  styles,
  scenes,
  cases
};

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, `${JSON.stringify(payload, null, 2)}\n`);
console.log(`Generated ${cases.length} cases at ${outFile}`);
