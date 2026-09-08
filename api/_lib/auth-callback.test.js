import test from 'node:test';
import assert from 'node:assert/strict';
import {callbackFlow} from '../../src/auth-callback.js';
test('server email callbacks accept implicit sessions while normal sign-in retains PKCE', () => {
  assert.equal(callbackFlow('https://gallery.example/#access_token=access&refresh_token=refresh&type=signup'), 'implicit');
  assert.equal(callbackFlow('https://gallery.example/?code=code#submit'), 'pkce');
  assert.equal(callbackFlow('https://gallery.example/#submit'), 'pkce');
  assert.equal(callbackFlow('https://gallery.example/#error=access_denied&error_code=otp_expired'), 'pkce');
  assert.equal(callbackFlow('https://gallery.example/#access_token=incomplete'), 'pkce');
});
