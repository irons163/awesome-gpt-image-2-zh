import { ready, validateSubmission, createSubmissionIssue } from './_lib/submissions.js';

import { authReady, submissionAuthConfig, submissionUser, reserveSubmission } from './_lib/submission-auth.js';
export default async function handler(req, res) {
  res.setHeader?.('Cache-Control', 'no-store');
  const enabled = Boolean(ready() && authReady());
  if (req.method === 'GET') return res.json({ enabled, siteKey: enabled ? process.env.TURNSTILE_SITE_KEY : null, auth: enabled ? submissionAuthConfig() : null });
  if (req.method !== 'POST') return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  if (!enabled) return res.status(503).json({ error: 'NOT_CONFIGURED' });
  if (req.headers.origin !== process.env.SUBMISSION_ORIGIN) return res.status(403).json({ error: 'FORBIDDEN' });
  let user;
  try { user = await submissionUser(req); } catch { return res.status(503).json({ error: 'AUTH_UNAVAILABLE' }); }
  if (!user) return res.status(401).json({ error: 'AUTH_REQUIRED' });
  let data;
  try {
    const chunks = []; let size = 0;
    for await (const chunk of req) {
      size += chunk.length; chunks.push(Buffer.from(chunk));
      if (size > 4400000) return res.status(413).json({ error: 'TOO_LARGE' });
    }
    data = JSON.parse(Buffer.concat(chunks).toString('utf8'));
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
    const quota = await reserveSubmission(user.id);
    if (!quota.allowed) return res.status(429).json({ error: 'DAILY_LIMIT', resetAt: quota.resetAt });
    // Keep the reservation on an ambiguous GitHub failure to prevent duplicate writes.
    const issueUrl = await createSubmissionIssue(validated);
    return res.status(201).json({ issueUrl });
  } catch (error) {
    return res.status(error.message === 'INVALID' || error instanceof SyntaxError ? 400 : 502).json({ error: error.message === 'INVALID' ? 'INVALID' : 'SUBMISSION_FAILED' });
  }
}
