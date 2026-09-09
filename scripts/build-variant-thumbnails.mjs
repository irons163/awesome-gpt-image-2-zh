import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
const file = 'data/image-variants.json';
const data = JSON.parse(readFileSync(file, 'utf8'));
mkdirSync('data/images/gpt-image-2.5', { recursive: true });
let made = 0;
for (const [id, variants] of Object.entries(data.cases)) for (const variant of variants) {
  if (variant.status !== 'published') continue;
  const thumb = `/images/gpt-image-2.5/case-${id}-thumb.jpg`;
  if (!existsSync('data' + thumb)) {
    const result = spawnSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '80', '-Z', '720', 'data' + variant.image, '--out', 'data' + thumb], { encoding: 'utf8' });
    if (result.status !== 0) throw new Error(result.stderr || 'Thumbnail creation failed');
    made++;
  }
  variant.thumbnailImage = thumb;
  variant.thumbnailSha256 = createHash('sha256').update(readFileSync('data' + thumb)).digest('hex');
}
writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
console.log(`Created ${made} gallery thumbnails`);
