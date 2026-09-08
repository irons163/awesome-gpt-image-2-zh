import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
const Auth = createContext(null);
export const useGalleryAuth = () => useContext(Auth);
export function GalleryAuthProvider({children}) {
  const zh = localStorage.getItem('language') !== 'en';
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
    if (!config?.auth) return;
    const client = createClient(config.auth.url, config.auth.publishableKey, {
      auth: { flowType: 'pkce', persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storageKey: 'gallery-submission-auth' }
    });
    setAuthClient(client);
    let alive = true;
    client.auth.getSession().then(({data, error}) => {
      if (!alive) return;
      if (error) setStatus(zh ? '登入失敗，請再試一次。' : 'Sign-in failed. Please try again.');
      setSession(data.session);
      setReady(true);
    });
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, value) => { if(alive) setSession(value); });
    return () => { alive = false; subscription.unsubscribe(); };
  }, [config]);
  useEffect(() => {
    if (!session) return;
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
    setIntent(next);
  }
  async function startGoogleLogin() {
    if (!authClient) return;
    setStatus('');
    setBusy(true);
    sessionStorage.setItem('gallery-login-intent', JSON.stringify(intent));
    const {error} = await authClient.auth.signInWithOAuth({provider: 'google', options: {redirectTo: window.location.origin + '/?submission=login#submit'}});
    if(error) { setBusy(false); setStatus(zh ? '無法啟動 Google 登入，請稍後再試。' : 'Unable to sign in with Google.'); }
  }
  async function logout() {
    const {error} = await authClient.auth.signOut({scope:'local'});
    if(error) setStatus(zh ? '登出失敗，請再試一次。' : 'Sign-out failed.');
    else { setSession(null); }
  }
  return <Auth.Provider value={{config, authClient, session, setSession, status, setStatus, login, logout, ready, returnIntent, setReturnIntent}}>{children}
    <dialog ref={dialog} className="galleryLogin authDialog" aria-labelledby="gallery-login-title" onCancel={() => setIntent(null)} onClick={e => {if(e.target === e.currentTarget) setIntent(null);}}>
      <button type="button" className="previewClose" onClick={() => setIntent(null)} aria-label={zh ? '關閉登入' : 'Close sign in'}>×</button>
      <h2 id="gallery-login-title">{zh ? '登入你的圖庫帳號' : 'Sign in to your gallery'}</h2>
      <p>{zh ? (intent?.type === 'submit' ? '登入後即可分享圖片與提示詞，每個帳號每天最多投稿 5 筆。' : '登入後即可儲存我的最愛，並在不同裝置查看收藏。') : 'Sign in to save favorites across devices and submit your creations.'}</p>
      <button type="button" className="googleButton" disabled={!ready || !authClient || busy} onClick={startGoogleLogin}>{busy ? (zh ? '正在前往 Google…' : 'Redirecting…') : (zh ? '使用 Google 登入' : 'Continue with Google')}</button>
      <p role="status">{status || (!ready ? (zh ? '正在確認登入狀態…' : 'Checking sign-in status…') : '')}</p>
      <small>{zh ? '本網站不會取得或儲存你的 Google 密碼。' : 'This website does not access or store your Google password.'}</small>
    </dialog>
  </Auth.Provider>;
}
