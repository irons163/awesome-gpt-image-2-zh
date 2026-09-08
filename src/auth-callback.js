// Older email redirects included a section anchor before Supabase's fragment.
// Normalize only known section prefixes before the SDK reads the callback.
export function normalizeAuthCallback(href) {
  const url = new URL(href);
  url.hash = url.hash.replace(/^#(?:submit|gallery)#(?=(?:access_token|error)=)/, '#');
  return url.href;
}

// Server-issued email links return an implicit session; browser-initiated
// Google and email sign-in continue to use PKCE.
export function callbackFlow(href) {
  const hash = new URLSearchParams(new URL(normalizeAuthCallback(href)).hash.slice(1));
  return hash.has('access_token') && hash.has('refresh_token') ? 'implicit' : 'pkce';
}
