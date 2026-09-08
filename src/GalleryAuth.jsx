import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
const Auth = createContext(null);
export const useGalleryAuth = () => useContext(Auth);
export function GalleryAuthProvider({children}) {
  const zh = localStorage.getItem('language') !== 'en';
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
    });
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, value) => { if(alive) setSession(value); });
    return () => { alive = false; subscription.unsubscribe(); };
  }, [config]);
  async function login() {
    if (!authClient) return;
    setStatus('');
    const {error} = await authClient.auth.signInWithOAuth({provider: 'google', options: {redirectTo: window.location.origin + '/?submission=login#submit'}});
    if(error) setStatus(zh ? '無法啟動 Google 登入，請稍後再試。' : 'Unable to sign in with Google.');
  }
  async function logout() {
    const {error} = await authClient.auth.signOut({scope:'local'});
    if(error) setStatus(zh ? '登出失敗，請再試一次。' : 'Sign-out failed.');
    else { setSession(null); }
  }
  return <Auth.Provider value={{config, authClient, session, setSession, status, setStatus, login, logout}}>{children}</Auth.Provider>;
}
