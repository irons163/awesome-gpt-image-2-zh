import test from 'node:test';
import assert from 'node:assert/strict';
import { submissionUser, reserveSubmission } from './submission-auth.js';
import handler from '../submissions.js';

test('submission auth rejects anonymous and unverified or anonymous accounts', async () => {
  const env = {...process.env}; const originalFetch=globalThis.fetch;
  Object.assign(process.env,{SUBMISSION_SUPABASE_URL:'https://example.supabase.co',SUBMISSION_SUPABASE_PUBLISHABLE_KEY:'public-test',SUBMISSION_SUPABASE_SERVICE_ROLE_KEY:'server-test'});
  try {
    globalThis.fetch=async()=>{throw new Error('anonymous must not call auth');};
    assert.equal(await submissionUser({headers:{}}),null);
    for(const user of [{id:'a',app_metadata:{providers:['google']}},{id:'a',email_confirmed_at:'2026-09-08',is_anonymous:true,app_metadata:{providers:['email']}}]) {
      globalThis.fetch=async()=>new Response(JSON.stringify(user),{status:200,headers:{'Content-Type':'application/json'}});
      assert.equal(await submissionUser({headers:{authorization:'Bearer test'}}),null);
    }
    for (const provider of ['google','email']) {
    const user={id:'verified-account',email_confirmed_at:'2026-09-08',app_metadata:{providers:[provider]}};
    globalThis.fetch=async()=>new Response(JSON.stringify(user),{status:200,headers:{'Content-Type':'application/json'}});
    assert.equal((await submissionUser({headers:{authorization:'Bearer test'}})).id,'verified-account');
    }
  } finally {globalThis.fetch=originalFetch; for(const k of Object.keys(process.env)) if(!(k in env)) delete process.env[k]; Object.assign(process.env,env);}
});

test('anonymous POST is rejected before reading body or creating issues', async()=>{
  const env={...process.env};
  for(const key of ['GITHUB_APP_ID','GITHUB_INSTALLATION_ID','GITHUB_APP_PRIVATE_KEY_PATH','TURNSTILE_SITE_KEY','TURNSTILE_SECRET_KEY','SUBMISSION_SUPABASE_URL','SUBMISSION_SUPABASE_PUBLISHABLE_KEY','SUBMISSION_SUPABASE_SERVICE_ROLE_KEY']) process.env[key]='configured';
  process.env.SUBMISSION_ORIGIN='https://gallery.example';
  let status=200,body;
  try {
    await handler({method:'POST',headers:{origin:'https://gallery.example'},[Symbol.asyncIterator](){throw new Error('must not read body');}}, {status(n){status=n;return this;},json(v){body=v;}});
    assert.equal(status,401);assert.equal(body.error,'AUTH_REQUIRED');
  } finally {for(const k of Object.keys(process.env)) if(!(k in env)) delete process.env[k];Object.assign(process.env,env);}
});

test('quota uses server credentials and fails closed on database errors',async()=>{
 const env={...process.env};const originalFetch=globalThis.fetch;
 Object.assign(process.env,{SUBMISSION_SUPABASE_URL:'https://example.supabase.co',SUBMISSION_SUPABASE_SERVICE_ROLE_KEY:'private-server-key'});
 try {
  globalThis.fetch=async(url,options)=>{
   assert.match(String(url),/rpc\/reserve_gallery_submission$/);
   assert.equal(new Headers(options.headers).get('apikey'),'private-server-key');
   assert.equal(JSON.parse(options.body).account_id,'account-a');
   return new Response(JSON.stringify({allowed:false,remaining:0}),{status:200});
  };
  assert.equal((await reserveSubmission('account-a')).allowed,false);
  globalThis.fetch=async()=>new Response(JSON.stringify({message:'missing function'}),{status:400});
  await assert.rejects(()=>reserveSubmission('account-a'),/QUOTA_UNAVAILABLE/);
 }finally{globalThis.fetch=originalFetch;for(const k of Object.keys(process.env))if(!(k in env))delete process.env[k];Object.assign(process.env,env);}
});
