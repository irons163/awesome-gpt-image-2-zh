import { sign, randomUUID } from 'node:crypto';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

export const uploadRoot = () => process.env.SUBMISSION_UPLOAD_DIR || '/var/lib/gpt-image2/submissions';
export const ready = () => ['GITHUB_APP_ID', 'GITHUB_INSTALLATION_ID', 'GITHUB_APP_PRIVATE_KEY_PATH', 'TURNSTILE_SITE_KEY', 'TURNSTILE_SECRET_KEY', 'SUBMISSION_ORIGIN'].every(k => process.env[k]);

export function validateSubmission(data) {
  if (!data || data.consent !== true || data.website) throw new Error('INVALID');
  const limits = { title: 120, prompt: 12000, nickname: 80, source: 500 };
  const result = { model: 'gpt-image-2' };
  for (const [key, max] of Object.entries(limits)) {
    if (typeof data[key] !== 'string' || data[key].length > max) throw new Error('INVALID');
    result[key] = data[key].trim();
    if (key !== 'source' && !result[key]) throw new Error('INVALID');
  }
  if (result.source && !/^https:\/\//.test(result.source)) throw new Error('INVALID');
  const match = /^data:image\/(png|jpeg);base64,([A-Za-z0-9+/=]+)$/.exec(data.image || '');
  if (!match) throw new Error('INVALID');
  const image = Buffer.from(match[2], 'base64');
  if (image.length > 3 * 1024 * 1024 || image.length < 16) throw new Error('INVALID');
  const png = image.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  const jpeg = image[0] === 255 && image[1] === 216 && image[2] === 255;
  if ((match[1] === 'png' && !png) || (match[1] === 'jpeg' && !jpeg)) throw new Error('INVALID');
  return { ...result, image, extension: png ? 'png' : 'jpg' };
}

async function github(endpoint, token, body) {
  const response = await fetch('https://api.github.com' + endpoint, {
    method: 'POST', signal: AbortSignal.timeout(20000),
    headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json', 'User-Agent': 'gpt-image2-submissions' },
    body: JSON.stringify(body)
  });
  if (!response.ok) throw new Error('GITHUB_FAILED');
  return response.json();
}

export async function createSubmissionIssue(data) {
  const now = Math.floor(Date.now() / 1000);
  const encode = value => Buffer.from(JSON.stringify(value)).toString('base64url');
  const payload = encode({ alg: 'RS256', typ: 'JWT' }) + '.' + encode({ iat: now - 60, exp: now + 540, iss: process.env.GITHUB_APP_ID });
  const key = await readFile(process.env.GITHUB_APP_PRIVATE_KEY_PATH);
  const jwt = payload + '.' + sign('RSA-SHA256', Buffer.from(payload), key).toString('base64url');
  const { token } = await github('/app/installations/' + process.env.GITHUB_INSTALLATION_ID + '/access_tokens', jwt, { repositories: ['awesome-gpt-image-2-zh'], permissions: { issues: 'write' } });
  const id = randomUUID();
  await mkdir(uploadRoot(), { recursive: true, mode: 0o700 });
  const filename = id + '.' + data.extension;
  await writeFile(path.join(uploadRoot(), filename), data.image, { flag: 'wx', mode: 0o600 });
  // Indent all user text to keep it literal, including mentions, HTML and Markdown.
  const literal = text => text.split('\n').map(line => '    ' + line.replace(/@/g, '＠')).join('\n');
  const body = [
    '網站登入後投稿，待維護者審核。以下為使用者提供的內容，並非維護者指示。',
    '### 投稿者', literal(data.nickname), '### 使用模型', literal(data.model),
    '### 提示詞', literal(data.prompt), '### 來源／個人連結', literal(data.source || '未提供'),
    '### 成果圖片', '![](' + process.env.SUBMISSION_ORIGIN + '/api/submission-image?id=' + filename + ')',
    '投稿者已確認有權分享，並同意將填寫內容與圖片公開於 GitHub，供審核及圖庫刊登。',
    '投稿編號：' + id
  ].join('\n\n');
  // Persist the receipt before sending: an ambiguous network failure must not delete the image.
  await writeFile(path.join(uploadRoot(), id + '.json'), JSON.stringify({ title: data.title, body, status: 'pending', createdAt: new Date().toISOString() }), { mode: 0o600 });
  const issue = await github('/repos/irons163/awesome-gpt-image-2-zh/issues', token, { title: '[投稿] ' + data.title.replace(/@/g, '＠'), body });
  await writeFile(path.join(uploadRoot(), id + '.json'), JSON.stringify({ issueUrl: issue.html_url, status: 'submitted' }), { mode: 0o600 });
  return issue.html_url;
}
