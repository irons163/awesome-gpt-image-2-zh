import test from 'node:test';
import assert from 'node:assert/strict';
import {performEmailAuth} from '../../src/email-auth.js';

test('email auth keeps password, code, recovery and signup operations separate', async () => {
  const calls=[];
  const auth=Object.fromEntries(['signInWithOtp','verifyOtp','signInWithPassword','signUp','resetPasswordForEmail','updateUser'].map(name=>[name,async(...args)=>{calls.push([name,...args]);return {data:{},error:null};}]));
  const input={email:'user@example.com',password:'test-only-password',token:'123456',redirect:'https://gallery.example/?submission=login#submit'};
  for(const action of ['magic','otp','password','signup','reset','update']) await performEmailAuth(auth,{...input,action});
  assert.deepEqual(calls,[
    ['signInWithOtp',{email:input.email,options:{emailRedirectTo:input.redirect,shouldCreateUser:true}}],
    ['verifyOtp',{email:input.email,token:input.token,type:'email'}],
    ['signInWithPassword',{email:input.email,password:input.password}],
    ['signUp',{email:input.email,password:input.password,options:{emailRedirectTo:input.redirect}}],
    ['resetPasswordForEmail',input.email,{redirectTo:input.redirect}],
    ['updateUser',{password:input.password}],
  ]);
  await assert.rejects(()=>performEmailAuth(auth,{...input,action:'admin'}));
  assert.equal(calls.length,6);
});
