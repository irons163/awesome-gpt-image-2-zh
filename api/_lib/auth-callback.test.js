import test from 'node:test';
import assert from 'node:assert/strict';
import {callbackFlow, normalizeAuthCallback} from '../../src/auth-callback.js';
test('server email callbacks accept implicit sessions while normal sign-in retains PKCE', () => {
  assert.equal(callbackFlow('https://gallery.example/#access_token=access&refresh_token=refresh&type=signup'), 'implicit');
  assert.equal(callbackFlow('https://gallery.example/?code=code#submit'), 'pkce');
  assert.equal(callbackFlow('https://gallery.example/#submit'), 'pkce');
  assert.equal(callbackFlow('https://gallery.example/#error=access_denied&error_code=otp_expired'), 'pkce');
  assert.equal(callbackFlow('https://gallery.example/#access_token=incomplete'), 'pkce');
});

test('legacy double-fragment email callbacks are readable by the auth SDK', () => {
  const legacy='https://gallery.example/?submission=login#submit#access_token=access&refresh_token=refresh&type=signup';
  const result=normalizeAuthCallback(legacy);
  assert.equal(result,'https://gallery.example/?submission=login#access_token=access&refresh_token=refresh&type=signup');
  const params=new URLSearchParams(new URL(result).hash.slice(1));
  assert.equal(params.get('access_token'),'access');
  assert.equal(params.get('refresh_token'),'refresh');
  assert.equal(callbackFlow(legacy),'implicit');
  assert.equal(normalizeAuthCallback(result),result);
  assert.equal(normalizeAuthCallback('https://gallery.example/#submit'),'https://gallery.example/#submit');
  assert.equal(normalizeAuthCallback('https://gallery.example/#submit#error=access_denied&error_code=otp_expired'),'https://gallery.example/#error=access_denied&error_code=otp_expired');
});
