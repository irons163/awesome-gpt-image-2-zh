import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { uploadRoot } from './_lib/submissions.js';

export default async function handler(req, res) {
  if (!['GET', 'HEAD'].includes(req.method)) return res.status(405).end();
  const id = req.query?.id || '';
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(png|jpg)$/.test(id)) return res.status(404).end();
  try {
    const image = await readFile(path.join(uploadRoot(), id));
    res.setHeader('Content-Type', id.endsWith('.png') ? 'image/png' : 'image/jpeg');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.end(req.method === 'HEAD' ? undefined : image);
  } catch { res.status(404).end(); }
}
