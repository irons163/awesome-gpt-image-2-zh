import test from 'node:test';
import assert from 'node:assert/strict';
import { validateSubmission } from './submissions.js';
import handler from '../submissions.js';
const valid = {
  title: '台灣鐵道', nickname: '旅人', model: 'gpt-image-2', source: '',
  prompt: '以繁體中文繪製台灣鐵道地圖', consent: true,
  image: 'data:image/png;base64,' + Buffer.from([137,80,78,71,13,10,26,10,...Array(24).fill(0)]).toString('base64')
};
test('submission validates required fields, consent and upload type before external writes', () => {
  assert.equal(validateSubmission(valid).extension, 'png');
  for (const change of [{ consent: false }, { prompt: '' }, { title: 'a'.repeat(121) }, { website: 'spam' }, { source: 'javascript:alert(1)' }, { image: 'data:image/png;base64,' + Buffer.from('<svg onload="alert(1)"/>').toString('base64') }]) {
    assert.throws(() => validateSubmission({ ...valid, ...change }));
  }
});
test('submission rejects oversized image', () => {
  assert.throws(() => validateSubmission({ ...valid, image: 'data:image/jpeg;base64,' + Buffer.alloc(3 * 1024 * 1024 + 1).toString('base64') }));
});
test('unconfigured submission endpoint fails closed and exposes no secrets', async () => {
  const saved = process.env.GITHUB_APP_ID;
  delete process.env.GITHUB_APP_ID;
  let code = 200, body;
  const res = { status(value) { code = value; return this; }, json(value) { body = value; return this; } };
  try {
    await handler({ method: 'GET' }, res);
    assert.deepEqual(body, { enabled: false, siteKey: null, auth: null });
    await handler({ method: 'POST' }, res);
    assert.equal(code, 503);
  } finally {
    if (saved !== undefined) process.env.GITHUB_APP_ID = saved;
  }
});
