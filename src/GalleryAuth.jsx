import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import EmailSignIn from './EmailSignIn';
const Auth = createContext(null);
export const useGalleryAuth = () => useContext(Auth);
export function GalleryAuthProvider({children}) {
  const zh = localStorage.getItem('language') !== 'en';
  const [recovery, setRecovery] = useState(false);
  const recovering = useRef(false);
  const dialog = useRef(null);
  const [intent, setIntent] = useState(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [returnIntent, setReturnIntent] = useState(null);
  const [config, setConfig] = useState(null);
  const [authClient, setAuthClient] = useState(null);
  const [session, setSession] = useState(null);
  const [status, setStatus] = useState('');
  useEffect(() => {
    fetch('/api/submissions').then(r => r.json()).then(setConfig).catch(() => setConfig({ enabled: false }));
  }, []);
  useEffect(() => {
    if (!config?.auth) {if(config) {setReady(true);setStatus(zh ? '登入服務暫時無法使用。' : 'Sign-in is temporarily unavailable.');} return;}
    const client = createClient(config.auth.url, config.auth.publishableKey, {
      auth: { flowType: 'pkce', persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storageKey: 'gallery-submission-auth' }
    });
    setAuthClient(client);
    let alive = true;
    client.auth.getSession().then(({data, error}) => {
      if (!alive) return;
      if (error) {setStatus(zh ? '登入連結無效或已過期，請重新取得連結或輸入驗證碼。' : 'Invalid or expired sign-in link. Request a new link or enter your code.');setIntent({type:'submit'});}
      setSession(data.session);
      setReady(true);
    });
    const { data: { subscription } } = client.auth.onAuthStateChange((event, value) => { if (!alive) return; if(event === 'PASSWORD_RECOVERY') {recovering.current=true;setRecovery(true);setIntent({type:'recovery'});} setSession(value); });
    return () => { alive = false; subscription.unsubscribe(); };
  }, [config]);
  useEffect(() => {
    if (!session || recovering.current) return;
    let saved;
    try { saved = JSON.parse(sessionStorage.getItem('gallery-login-intent')); } catch {}
    sessionStorage.removeItem('gallery-login-intent');
    if (saved && ['favorites', 'favorite', 'submit'].includes(saved.type)) {
      setReturnIntent(saved);
      window.location.hash = saved.type === 'submit' ? 'submit' : 'gallery';
    }
    setIntent(null);
  }, [session?.user?.id]);
  useEffect(() => {
    if (intent) dialog.current?.showModal();
    else dialog.current?.close();
  }, [intent]);
  function login(next = {type:'submit'}) {
    setStatus('');
    setBusy(false);
    if(!recovering.current) setRecovery(false);
    setIntent(next);
  }
  function rememberIntent() { if(intent && intent.type !== 'recovery') sessionStorage.setItem('gallery-login-intent', JSON.stringify(intent)); }
  function closeLogin() {setIntent(null);}
  async function startGoogleLogin() {
    if (!authClient) return;
    setStatus('');
    setBusy(true);
    rememberIntent();
    const {error} = await authClient.auth.signInWithOAuth({provider: 'google', options: {redirectTo: window.location.origin + '/?submission=login#submit'}});
    if(error) { setBusy(false); setStatus(zh ? '無法啟動 Google 登入，請稍後再試。' : 'Unable to sign in with Google.'); }
  }
  async function logout() {
    const {error} = await authClient.auth.signOut({scope:'local'});
    if(error) setStatus(zh ? '登出失敗，請再試一次。' : 'Sign-out failed.');
    else { setSession(null); recovering.current=false;setRecovery(false); }
  }
  return <Auth.Provider value={{config, authClient, session, setSession, status, setStatus, login, logout, ready, returnIntent, setReturnIntent}}>{children}
    <dialog ref={dialog} className="galleryLogin authDialog" aria-labelledby="gallery-login-title" onCancel={closeLogin} onClick={e => {if(e.target === e.currentTarget) setIntent(null);}}>
      <button type="button" className="previewClose" onClick={() => setIntent(null)} aria-label={zh ? '關閉登入' : 'Close sign in'}>×</button>
      <h2 id="gallery-login-title">{recovery ? (zh ? '設定新密碼' : 'Set a new password') : (zh ? '登入你的圖庫帳號' : 'Sign in to your gallery')}</h2>
      <p>{zh ? (intent?.type === 'submit' ? '登入後即可分享圖片與提示詞，每個帳號每天最多投稿 5 筆。' : '登入後即可儲存我的最愛，並在不同裝置查看收藏。') : 'Sign in to save favorites across devices and submit your creations.'}</p>
      {!recovery && <button type="button" className="googleButton" disabled={!ready || !authClient || busy} onClick={startGoogleLogin}>{busy ? (zh ? '正在前往 Google…' : 'Redirecting…') : (zh ? '使用 Google 登入' : 'Continue with Google')}</button>}
      {intent && (config?.auth?.emailEnabled || recovery) && <EmailSignIn client={authClient} zh={zh} ready={ready} rememberIntent={rememberIntent} recovery={recovery} onRecovered={()=>{recovering.current=false;setRecovery(false);setIntent(null);setStatus('');window.location.hash='submit';}}/>}
      <p role="status">{status || (!ready ? (zh ? '正在確認登入狀態…' : 'Checking sign-in status…') : '')}</p>
      <small>{zh ? '本網站不會取得或儲存你的 Google 密碼。' : 'This website does not access or store your Google password.'}</small>
    </dialog>
  </Auth.Provider>;
}
