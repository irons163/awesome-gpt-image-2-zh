import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,readdir,rm} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {buildAuthMail,enqueueMail,drainMail} from './auth-mail.js';
import handler from '../auth/send-email.js';
import {Webhook} from 'standardwebhooks';
import {Readable} from 'node:stream';
test('signed auth mail is durable, idempotent and strips secrets after delivery',async()=>{
 const env={...process.env}, fetch=globalThis.fetch;
 const dir=await mkdtemp(path.join(os.tmpdir(),'gallery-mail-'));
 Object.assign(process.env,{AUTH_MAIL_QUEUE_DIR:dir,FORWARD_API_KEY:'test',SUPABASE_SEND_EMAIL_HOOK_SECRET:Buffer.alloc(32,1).toString('base64'),SUBMISSION_SUPABASE_URL:'https://example.supabase.co',AUTH_EMAIL_FROM:'Gallery <noreply@auth.zero2codex.dev>'});
 const payload={user:{email:'test@example.com'},email_data:{email_action_type:'magiclink',token:'123456',token_hash:'test-hash',redirect_to:'https://evil.example'}};
 try {
  const messages=buildAuthMail(payload);
  assert.match(messages[0].html,/123456/);assert.ok(!messages[0].html.includes('evil.example'));
  const verifyUrl=new URL(messages[0].text.split('\n')[2]);
  assert.equal(verifyUrl.searchParams.get('redirect_to'),'https://gpt-image2.zero2codex.dev/?submission=login');
  await Promise.all([enqueueMail('same',messages),enqueueMail('same',messages)]);
  assert.equal((await readdir(dir)).length,1);
  let sent=0;globalThis.fetch=async(url,options)=>{sent++;assert.equal(url,'https://app.forwardhello.com/api/v1/emails');assert.match(options.headers['Idempotency-Key'],/^gallery-auth-/);return new Response('{}',{status:202});};
  await drainMail();await enqueueMail('same',messages);await drainMail();assert.equal(sent,1);
  const receipt=await readFile(path.join(dir,(await readdir(dir))[0]),'utf8');assert.ok(!receipt.includes('123456'));assert.ok(!receipt.includes('test@example.com'));
  const invoke=async(signature)=>{const req=Readable.from([JSON.stringify(payload)]);req.method='POST';req.headers={'webhook-id':'new','webhook-timestamp':String(Math.floor(Date.now()/1000)),'webhook-signature':signature};let status=200;await handler(req,{setHeader(){},status(v){status=v;return this;},json(){}});return status;};
  assert.equal(await invoke('invalid'),401);
  const signature=new Webhook(process.env.SUPABASE_SEND_EMAIL_HOOK_SECRET).sign('new',new Date(),JSON.stringify(payload));
  assert.equal(await invoke(signature),200);
  // Wait for the handler's immediate background dispatch before cleaning the test directory.
  while((await readdir(dir)).some(x=>x.endsWith('.tmp'))) await new Promise(r=>setTimeout(r,5));
 }finally{globalThis.fetch=fetch;Object.keys(process.env).filter(k=>!(k in env)).forEach(k=>delete process.env[k]);Object.assign(process.env,env);await rm(dir,{recursive:true,force:true});}
});
