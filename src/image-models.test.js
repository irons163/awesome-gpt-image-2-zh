import test from 'node:test';
import assert from 'node:assert/strict';
import { galleryImageForModel } from './image-models.js';
const original = { id: 1, model: 'gpt-image-2', image: '/images/original.jpg', sourceUrl: 'https://example.com/source', prompt: 'A tree' };
const variant = { model: 'gpt-image-2.5-sunburst', image: '/images/new.png', status: 'published' };
test('2.5 does not fall back to the original image', () => {
  assert.equal(galleryImageForModel(original, 'gpt-image-2.5'), null);
  assert.equal(galleryImageForModel(original, 'gpt-image-2'), original);
});
test('all prefers the published new image while preserving case identity and prompt source', () => {
  const item = { ...original, imageVariants: [variant] };
  const selected = galleryImageForModel(item, 'All');
  assert.equal(selected.image, variant.image);
  assert.equal(selected.id, original.id);
  assert.equal(selected.prompt, original.prompt);
  assert.equal(selected.promptSourceUrl, original.sourceUrl);
  assert.equal(galleryImageForModel(item, 'gpt-image-2').image, original.image);
});
test('2.5 includes Sunburst and Flare but excludes unpublished images', () => {
  for (const model of ['gpt-image-2.5-sunburst', 'gpt-image-2.5-flare']) {
    assert.equal(galleryImageForModel({ ...original, imageVariants: [{ ...variant, model }] }, 'gpt-image-2.5').model, model);
  }
  assert.equal(galleryImageForModel({ ...original, imageVariants: [{ ...variant, status: 'pending' }] }, 'gpt-image-2.5'), null);
});
