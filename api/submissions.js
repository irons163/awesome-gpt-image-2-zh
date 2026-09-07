import { ready, validateSubmission, createSubmissionIssue } from './_lib/submissions.js';

let attempts = [];
export default async function handler(req, res) {
  if (req.method === 'GET') return res.json({ enabled: Boolean(ready()), siteKey: ready() ? process.env.TURNSTILE_SITE_KEY : null });
  if (req.method !== 'POST') return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  if (!ready()) return res.status(503).json({ error: 'NOT_CONFIGURED' });
  if (req.headers.origin !== process.env.SUBMISSION_ORIGIN) return res.status(403).json({ error: 'FORBIDDEN' });
  // Global ceiling bounds anonymous writes even behind a reverse proxy.
  const now = Date.now();
  attempts = attempts.filter(time => now - time < 3600000);
  if (attempts.length >= 20) return res.status(429).json({ error: 'RATE_LIMITED' });
  attempts.push(now);
  let data;
  try {
    let raw = '';
    for await (const chunk of req) {
      raw += chunk;
      if (Buffer.byteLength(raw) > 4400000) return res.status(413).json({ error: 'TOO_LARGE' });
    }
    data = JSON.parse(raw);
    const validated = validateSubmission(data);
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', signal: AbortSignal.timeout(10000),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: process.env.TURNSTILE_SECRET_KEY, response: data.token })
    });
    const verification = await response.json();
    if (!verification.success || verification.hostname !== new URL(process.env.SUBMISSION_ORIGIN).hostname || verification.action !== 'submission') {
      return res.status(400).json({ error: 'VERIFICATION_FAILED' });
    }
    const issueUrl = await createSubmissionIssue(validated);
    return res.status(201).json({ issueUrl });
  } catch (error) {
    return res.status(error.message === 'INVALID' || error instanceof SyntaxError ? 400 : 502).json({ error: error.message === 'INVALID' ? 'INVALID' : 'SUBMISSION_FAILED' });
  }
}
