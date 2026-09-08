// Server-issued email links return an implicit session; browser-initiated
// Google and email sign-in continue to use PKCE.
export function callbackFlow(href) {
  const hash = new URLSearchParams(new URL(href).hash.slice(1));
  return hash.has('access_token') && hash.has('refresh_token') ? 'implicit' : 'pkce';
}
