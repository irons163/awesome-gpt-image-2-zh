import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../favorites.js';
test('favorites reject guests and scope every operation to the verified account', async () => {
 const saved={...process.env}; const oldFetch=global.fetch;
 const calls=[];
 const userId='11111111-1111-4111-8111-111111111111';
 const res=()=>({statusCode:200,setHeader(){},status(n){this.statusCode=n;return this;},json(v){this.body=v;}});
 try {
  let r=res(); await handler({method:'GET',headers:{}},r); assert.equal(r.statusCode,401);
  process.env.SUBMISSION_SUPABASE_URL='https://gallery-test.supabase.co';
  process.env.SUBMISSION_SUPABASE_PUBLISHABLE_KEY='test-public';
  process.env.SUBMISSION_SUPABASE_SERVICE_ROLE_KEY='test-server';
  global.fetch=async (url,options={})=>{
   if(String(url).includes('/auth/v1/user')) return new Response(JSON.stringify({id:userId,email_confirmed_at:'2026-01-01',app_metadata:{providers:['google']}}),{status:200});
   calls.push({url:String(url),options});
   const body=options.method==='POST'?{id:'favorite',case_id:1,created_at:'2026-01-01'}:[];
   return new Response(JSON.stringify(body),{status:200,headers:{'Content-Type':'application/json'}});
  };
  for(const method of ['GET','POST','DELETE']) {
   r=res(); await handler({method,headers:{authorization:'Bearer valid'},body:{caseId:1,user_id:'attacker'},query:{caseId:1,user_id:'attacker'}},r); assert.equal(r.statusCode,200);
  }
  assert.match(calls[0].url,new RegExp('user_id=eq.'+userId));
  assert.equal(JSON.parse(calls[1].options.body).user_id,userId);
  assert.match(calls[2].url,new RegExp('user_id=eq.'+userId));
 } finally {global.fetch=oldFetch; for(const key of ['SUBMISSION_SUPABASE_URL','SUBMISSION_SUPABASE_PUBLISHABLE_KEY','SUBMISSION_SUPABASE_SERVICE_ROLE_KEY']) {if(saved[key]===undefined) delete process.env[key]; else process.env[key]=saved[key];}}
});
