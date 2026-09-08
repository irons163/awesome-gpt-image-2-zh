import { createClient } from '@supabase/supabase-js';
import { getBearerToken } from './supabase.js';

export function submissionAuthConfig() {
  return { url: process.env.SUBMISSION_SUPABASE_URL, publishableKey: process.env.SUBMISSION_SUPABASE_PUBLISHABLE_KEY, emailEnabled: process.env.SUBMISSION_EMAIL_AUTH_ENABLED === 'true' };
}
export function authReady() {
  const config = submissionAuthConfig();
  return Boolean(config.url && config.publishableKey && process.env.SUBMISSION_SUPABASE_SERVICE_ROLE_KEY);
}
function client(key) {
  return createClient(submissionAuthConfig().url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
export async function submissionUser(req) {
  const token = getBearerToken(req);
  if (!token || !authReady()) return null;
  const { data, error } = await client(submissionAuthConfig().publishableKey).auth.getUser(token);
  if (error || !data?.user?.email_confirmed_at || data.user.is_anonymous || !data.user.app_metadata?.providers?.some(provider => ['google', 'email'].includes(provider))) return null;
  return data.user;
}
export async function reserveSubmission(userId) {
  const { data, error } = await client(process.env.SUBMISSION_SUPABASE_SERVICE_ROLE_KEY).rpc('reserve_gallery_submission', { account_id: userId });
  if (error) throw new Error('QUOTA_UNAVAILABLE');
  return data;
}
