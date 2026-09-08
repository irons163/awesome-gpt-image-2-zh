import fs from 'node:fs/promises';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';
import { submissionUser, submissionAuthConfig } from './_lib/submission-auth.js';
import { readJsonBody } from './_lib/billing.js';

let validCaseIds;

function json(res, status, payload) {
  res.status(status).json(payload);
}

function parseCaseId(value) {
  const caseId = Number(value);
  return Number.isInteger(caseId) && caseId > 0 ? caseId : null;
}

async function getValidCaseIds() {
  if (validCaseIds) return validCaseIds;

  try {
    const file = await fs.readFile(path.join(process.cwd(), 'data/cases.json'), 'utf8');
    const payload = JSON.parse(file);
    validCaseIds = new Set((payload.cases || []).map((item) => Number(item.id)).filter(Number.isInteger));
  } catch {
    validCaseIds = new Set();
  }

  return validCaseIds;
}

async function isValidCase(caseId) {
  const ids = await getValidCaseIds();
  return ids.has(caseId);
}

function formatFavorite(row) {
  return {
    id: row.id,
    caseId: Number(row.case_id),
    createdAt: row.created_at || ''
  };
}

export default async function handler(req, res) {
  if (!['GET', 'POST', 'DELETE'].includes(req.method)) {
    res.setHeader('Allow', 'GET, POST, DELETE');
    return json(res, 405, { ok: false, error: 'METHOD_NOT_ALLOWED' });
  }

  res.setHeader('Cache-Control', 'no-store');
  let user;
  try { user = await submissionUser(req); } catch { return json(res, 503, {error:'AUTH_UNAVAILABLE'}); }
  if (!user) return json(res, 401, {error:'AUTH_REQUIRED'});
  const auth = {user, client: createClient(submissionAuthConfig().url, process.env.SUBMISSION_SUPABASE_SERVICE_ROLE_KEY, {auth:{persistSession:false,autoRefreshToken:false}})};

  if (req.method === 'GET') {
    const { data, error } = await auth.client
      .from('case_favorites')
      .select('id,case_id,created_at')
      .eq('user_id', auth.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Failed to load case favorites', {
        userId: auth.user.id,
        message: String(error?.message || 'unknown').slice(0, 240)
      });
      return json(res, 500, { ok: false, error: 'FAVORITES_LOAD_FAILED' });
    }

    const favorites = (data || []).map(formatFavorite);
    return json(res, 200, {
      ok: true,
      favorites,
      caseIds: favorites.map((favorite) => favorite.caseId)
    });
  }

  if (req.method === 'POST') {
    let body;
    try {
      body = await readJsonBody(req);
    } catch {
      return json(res, 400, { ok: false, error: 'INVALID_CASE' });
    }

    const caseId = parseCaseId(body.caseId || body.case_id);
    if (!caseId || !(await isValidCase(caseId))) {
      return json(res, 400, { ok: false, error: 'INVALID_CASE' });
    }

    const { data, error } = await auth.client
      .from('case_favorites')
      .upsert(
        { user_id: auth.user.id, case_id: caseId },
        { onConflict: 'user_id,case_id', ignoreDuplicates: false }
      )
      .select('id,case_id,created_at')
      .single();

    if (error) {
      console.warn('Failed to save case favorite', {
        userId: auth.user.id,
        caseId,
        message: String(error?.message || 'unknown').slice(0, 240)
      });
      return json(res, 500, { ok: false, error: 'FAVORITE_SAVE_FAILED' });
    }

    return json(res, 200, { ok: true, favorite: formatFavorite(data) });
  }

  const caseId = parseCaseId(req.query?.caseId || req.query?.case_id);
  if (!caseId || !(await isValidCase(caseId))) {
    return json(res, 400, { ok: false, error: 'INVALID_CASE' });
  }

  const { error } = await auth.client
    .from('case_favorites')
    .delete()
    .eq('user_id', auth.user.id)
    .eq('case_id', caseId);

  if (error) {
    console.warn('Failed to delete case favorite', {
      userId: auth.user.id,
      caseId,
      message: String(error?.message || 'unknown').slice(0, 240)
    });
    return json(res, 500, { ok: false, error: 'FAVORITE_DELETE_FAILED' });
  }

  return json(res, 200, { ok: true, caseId });
}
