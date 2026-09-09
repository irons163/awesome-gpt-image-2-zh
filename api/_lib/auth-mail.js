import {createHash,randomUUID} from 'node:crypto';
import {mkdir,readFile,writeFile,rename,readdir,unlink,link,open} from 'node:fs/promises';
import path from 'node:path';
const root = () => process.env.AUTH_MAIL_QUEUE_DIR || '/var/lib/gpt-image2/auth-mail';
const escape = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function mailReady() {return Boolean(process.env.FORWARD_API_KEY && process.env.SUPABASE_SEND_EMAIL_HOOK_SECRET && process.env.SUBMISSION_SUPABASE_URL && process.env.AUTH_EMAIL_FROM);}
export function buildAuthMail(payload) {
  const {user,email_data:e}=payload;
  const titles={signup:'驗證你的圖庫帳號',magiclink:'登入你的圖庫帳號',recovery:'重設圖庫密碼',invite:'接受圖庫邀請',email_change:'確認信箱變更',reauthentication:'確認帳號操作'};
  if(!e || !Object.hasOwn(titles,e.email_action_type) || !user?.email) throw Error('Invalid mail payload');
  const redirect='https://gpt-image.zero2codex.dev/?submission=login';
  const recipients=e.email_action_type==='email_change' ? (e.token_hash_new ? [[user.email,e.token,e.token_hash_new],[user.new_email,e.token_new,e.token_hash]] : [[user.new_email,e.token_new || e.token,e.token_hash]]) : [[user.email,e.token,e.token_hash]];
  return recipients.map(([to,token,hash])=>{
    if(typeof to !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to) || !token || !hash) throw Error('Invalid mail payload');
    const link=new URL('/auth/v1/verify',process.env.SUBMISSION_SUPABASE_URL);
    link.searchParams.set('token',hash);link.searchParams.set('type',e.email_action_type);link.searchParams.set('redirect_to',redirect);
    const subject='GPT Image 圖庫｜'+titles[e.email_action_type];
    const text=`${subject}\n\n${link}\n\n一次性驗證碼：${token}\n若不是你提出的要求，請忽略此信。`;
    return {from:process.env.AUTH_EMAIL_FROM,to,subject,text,html:`<h2>${escape(subject)}</h2><p><a href="${escape(link)}">${escape(titles[e.email_action_type])}</a></p><p>一次性驗證碼：</p><p style="font-size:28px;letter-spacing:4px">${escape(token)}</p><p>若不是你提出的要求，請忽略此信。</p>`};
  });
}
export async function enqueueMail(id,messages) {
  const key=createHash('sha256').update(id).digest('hex');
  await mkdir(root(),{recursive:true,mode:0o700});
  const dest=path.join(root(),key+'.json');
  // Duplicate signed webhook deliveries keep the original job and idempotency key.
  const temp=path.join(root(),randomUUID()+'.tmp');
  const handle=await open(temp,'wx',0o600);
  try {
    await handle.writeFile(JSON.stringify({messages,created:Date.now()}));await handle.sync();
    try {await link(temp,dest);} catch(error) {if(error.code!=='EEXIST') throw error;}
  } finally {await handle.close();await unlink(temp);}

}
let processing=false;
export async function drainMail() {
  if(processing || !mailReady()) return;
  processing=true;
  try {
    await mkdir(root(),{recursive:true,mode:0o700});
    for(const filename of (await readdir(root())).filter(x=>/^[a-f0-9]{64}\.json$/.test(x))) {
      const file=path.join(root(),filename);
      try {
        const job=JSON.parse(await readFile(file,'utf8'));
        if(Date.now()-job.created>3600000){await unlink(file);continue;}
        if(job.done) continue;
        for(const [index,message] of job.messages.entries()) {
          const response=await fetch('https://app.forwardhello.com/api/v1/emails',{method:'POST',headers:{Authorization:`Bearer ${process.env.FORWARD_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':`gallery-auth-${filename}-${index}`},body:JSON.stringify(message),signal:AbortSignal.timeout(12000)});
          if(![200,202].includes(response.status)) throw Error('Email delivery rejected');
        }
        // Keep a receipt without tokens for replay deduplication during the job lifetime.
        await writeFile(file+'.tmp',JSON.stringify({created:job.created,done:true}),{mode:0o600});await rename(file+'.tmp',file);
      } catch { console.error('Auth email delivery pending; retrying.'); }
    }
  } finally {processing=false;}
}
export function startMailWorker() {
  void drainMail().catch(()=>console.error('Auth email queue unavailable.'));
  const timer=setInterval(()=>void drainMail().catch(()=>console.error('Auth email queue unavailable.')),15000);timer.unref();
  return timer;
}
