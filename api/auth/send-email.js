import {Webhook} from 'standardwebhooks';
import {mailReady,buildAuthMail,enqueueMail,drainMail} from '../_lib/auth-mail.js';
export default async function handler(req,res) {
  res.setHeader?.('Cache-Control','no-store');
  if(req.method!=='POST') return res.status(405).json({error:{http_code:405,message:'Method not allowed'}});
  if(!mailReady()) return res.status(503).json({error:{http_code:503,message:'Email not configured'}});
  const chunks=[];let size=0;
  for await (const chunk of req){size+=chunk.length;if(size>65536)return res.status(413).json({error:{http_code:413,message:'Payload too large'}});chunks.push(Buffer.from(chunk));}
  let payload;
  try {payload=new Webhook(process.env.SUPABASE_SEND_EMAIL_HOOK_SECRET.replace(/^v1,whsec_/, '')).verify(Buffer.concat(chunks).toString('utf8'),req.headers);} catch {return res.status(401).json({error:{http_code:401,message:'Invalid signature'}});}
  try {await enqueueMail(req.headers['webhook-id'],buildAuthMail(payload));} catch {return res.status(503).json({error:{http_code:503,message:'Unable to queue email'}});}
  res.json({});
  void drainMail().catch(()=>console.error('Auth email queue unavailable.'));
}
