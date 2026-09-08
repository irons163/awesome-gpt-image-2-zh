import {performEmailAuth} from './email-auth';
import React, {useEffect, useRef, useState} from 'react';

export default function EmailSignIn({client, zh, ready, rememberIntent, recovery, onRecovered}) {
  const [mode, setMode] = useState('magic');
  const [email, setEmail] = useState('');
  const [sentEmail, setSentEmail] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const lock = useRef(false);
  const t = (a,b) => zh ? a : b;
  useEffect(() => {
    if (!cooldown) return;
    const timer = setTimeout(() => setCooldown(n => Math.max(0,n-1)),1000);
    return () => clearTimeout(timer);
  }, [cooldown]);
  function changeMode(value) {setMode(value);setMessage('');}
  async function submit(event, action) {
    event.preventDefault();
    if (!client || !ready || lock.current) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    const password = String(fields.get('password') || '');
    if (['signup','update'].includes(action) && password !== fields.get('confirm')) {
      setMessage(t('兩次輸入的密碼不一致。','Passwords do not match.')); return;
    }
    lock.current = true;setBusy(true);setMessage('');
    const address = email.trim().toLowerCase();
    const redirect = window.location.origin + '/?submission=login#submit';
    try {
      rememberIntent();
      const result = await performEmailAuth(client.auth, {action, email:action === 'otp' ? sentEmail : address, password, token:String(fields.get('token') || '').trim(), redirect});
      if (result.error) throw result.error;
      if (action === 'magic') {setSentEmail(address);setCooldown(60);setMessage(t('請查看信箱，點擊登入連結或輸入信中的驗證碼。','Check your email for a sign-in link or verification code.'));}
      if (action === 'signup' && !result.data.session) {form.reset();setMessage(t('請查看信箱並完成帳號驗證，再回來登入。','Check your email to confirm your account before signing in.'));}
      if (action === 'reset') {setCooldown(60);setMessage(t('若此信箱可用於重設密碼，你將收到重設連結。','If this email can be used for recovery, you will receive a reset link.'));}
      if (action === 'update') {form.reset();onRecovered();}
    } catch (error) {
      setMessage(error.status === 429 ? t('操作太頻繁，請稍後再試。','Too many attempts. Please try again later.') : action === 'otp' ? t('驗證碼錯誤或已過期，請確認最新信件或重新寄送。','Invalid or expired code. Check the latest email or resend.') : action === 'password' ? t('信箱或密碼不正確，請重試或使用登入連結。','Incorrect email or password. Try again or use an email link.') : t('目前無法完成，請稍後再試。若收不到信，請檢查垃圾郵件。','Unable to complete this request. Please retry and check your spam folder.'));
    } finally {lock.current=false;setBusy(false);}
  }
  const disabled = !ready || !client || busy;
  const passwordFields = <>
    <label>{t('密碼','Password')}<input name="password" type="password" required minLength={mode === 'password' && !recovery ? undefined : 8} maxLength={72} autoComplete={mode === 'password' && !recovery ? 'current-password' : 'new-password'}/></label>
    {(mode==='signup' || recovery) && <label>{t('再次輸入密碼','Confirm password')}<input name="confirm" type="password" required minLength={8} maxLength={72} autoComplete="new-password"/></label>}
  </>;
  return <div className="emailSignIn">
    {!recovery && <div className="emailModes" aria-label={t('Email 登入方式','Email sign-in methods')}>
      <button type="button" disabled={busy} aria-pressed={mode==='magic'} onClick={()=>changeMode('magic')}>{t('登入連結／驗證碼','Email link / code')}</button>
      <button type="button" disabled={busy} aria-pressed={mode==='password'} onClick={()=>changeMode('password')}>{t('密碼登入','Password')}</button>
    </div>}
    <form key={recovery ? 'update' : mode} onSubmit={e=>submit(e,recovery?'update':mode)}>
      {!recovery && <label>Email<input type="email" autoComplete="email" maxLength={254} required value={email} onChange={e=>{setEmail(e.target.value);setSentEmail('');}}/></label>}
      {(recovery || mode==='password' || mode==='signup') && passwordFields}
      {(recovery || mode==='signup') && <small>{t('請使用 8–72 個字元。','Use 8–72 characters.')}</small>}
      <button type="submit" disabled={disabled || (['magic','reset'].includes(mode) && !recovery && cooldown>0)}>{busy ? t('處理中…','Working…') : recovery ? t('儲存新密碼','Save new password') : mode==='magic' ? (cooldown ? t(`${cooldown} 秒後可重新寄送`,`Resend in ${cooldown}s`) : t('寄送登入連結與驗證碼','Send sign-in link and code')) : mode==='signup' ? t('註冊帳號','Create account') : mode==='reset' ? t('寄送密碼重設連結','Send password reset link') : t('登入','Sign in')}</button>
    </form>
    {!recovery && mode==='magic' && sentEmail && <form onSubmit={e=>submit(e,'otp')}>
      <label>{t('Email 驗證碼','Email verification code')}<input name="token" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{4,12}" minLength={4} maxLength={12} required/></label>
      <button disabled={disabled}>{t('驗證碼登入','Sign in with code')}</button>
    </form>}
    {!recovery && <div className="emailModes">
      <button type="button" disabled={busy} onClick={()=>changeMode('signup')}>{t('建立帳號','Create account')}</button>
      <button type="button" disabled={busy} onClick={()=>changeMode('reset')}>{t('忘記密碼','Forgot password')}</button>
    </div>}
    <p role="status">{message}</p>
  </div>;
}
