import { useGalleryAuth } from './GalleryAuth';
import React, { useEffect, useRef, useState } from 'react';

export default function SubmissionForm({ language, categories, styles, scenes, label }) {
  const zh = language === 'zh';
  const {config, authClient, session, setSession, status, setStatus, login, logout} = useGalleryAuth();
  const [token, setToken] = useState('');
  const [issue, setIssue] = useState('');
  const [busy, setBusy] = useState(false);
  const challenge = useRef(null);
  const widget = useRef(null);
  useEffect(() => { if (!session) { setIssue(''); setToken(''); } }, [session]);
  useEffect(() => {
    if (!config?.enabled || !session || issue) return;
    let cancelled = false;
    const render = () => {
      if (cancelled || !challenge.current) return;
      widget.current = window.turnstile.render(challenge.current, {
        sitekey: config.siteKey, action: 'submission', callback: setToken,
        'expired-callback': () => setToken(''), 'error-callback': () => setToken('')
      });
    };
    let script = document.querySelector('script[data-submission-turnstile]');
    if (window.turnstile) render();
    else {
      if (!script) {
        script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.dataset.submissionTurnstile = 'true';
        document.head.appendChild(script);
      }
      script.addEventListener('load', render);
    }
    return () => {
      cancelled = true;
      script?.removeEventListener('load', render);
      if (widget.current != null) window.turnstile?.remove(widget.current);
      widget.current = null;
    };
  }, [config, Boolean(session), issue]);
  async function submit(event) {
    event.preventDefault();
    if (busy || !token || !session) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    const selectedStyles = fields.getAll('styles');
    const selectedScenes = fields.getAll('scenes');
    if (!selectedStyles.length || !selectedScenes.length) {setStatus(zh ? '請至少選擇一種風格與一個場景。' : 'Choose at least one style and scene.');return;}
    const file = fields.get('image');
    if (!file?.size || file.size > 3 * 1024 * 1024 || !['image/png', 'image/jpeg'].includes(file.type)) {
      setStatus(zh ? '請選擇 3 MB 以內的 PNG 或 JPEG 圖片。' : 'Choose a PNG or JPEG image under 3 MB.'); return;
    }
    setBusy(true); setStatus('');
    try {
      const image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const {data: auth} = await authClient.auth.getSession();
      if (!auth.session) throw new Error('AUTH_REQUIRED');
      const response = await fetch('/api/submissions', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + auth.session.access_token },
        body: JSON.stringify({ ...Object.fromEntries(fields), styles:selectedStyles, scenes:selectedScenes, image, consent: fields.has('consent'), token })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setIssue(result.issueUrl);
      form.reset();
    } catch (error) {
      if(error.message === 'DAILY_LIMIT') { setStatus(zh ? '今天已達 5 筆投稿上限，請於台灣時間明天凌晨 0 點後再投稿。' : 'Daily limit of 5 reached. Try again after midnight in Taiwan.'); }
      else if(error.message === 'AUTH_REQUIRED') { setSession(null); setStatus(zh ? '登入已失效，請重新登入。' : 'Please sign in again.'); }
      else if(error.message === 'INVALID') setStatus(zh ? '投稿資料或標籤無效，請重新確認選項後送出。' : 'Invalid submission or tags. Review your selections.');
      else setStatus(zh ? '尚未確認投稿成功，請稍後查看 GitHub 投稿清單，避免重複送出；也可以到 Discord 聯絡我們。' : 'Submission could not be confirmed. Check the GitHub issue list before retrying, or contact us on Discord.');
    } finally {
      setBusy(false); setToken('');
      if (widget.current != null) window.turnstile?.reset(widget.current);
    }
  }
  return <section className="submissionSection" id="submit">
    <h2>{zh ? '投稿案例' : 'Submit a case'}</h2>
    <p>{zh ? '登入後分享圖片與提示詞，不需要 GitHub 帳號。每個帳號每天最多 5 筆，於台灣時間凌晨 0 點重置。投稿內容會公開在 GitHub Issues，審核通過後才會加入圖庫。請勿填寫私人聯絡資訊。' : 'Sign in to share an image and prompt. No GitHub account needed. Limit: 5 per account per day, resetting at midnight in Taiwan. Submissions are public GitHub issues and join the gallery after review. Do not include private contact information.'}</p>
    {session && <p>{zh ? '已登入，可投稿。' : 'Signed in.'} <button type="button" onClick={logout}>{zh ? '登出' : 'Sign out'}</button></p>}
    {!session && <p role="status">{status}</p>}
    {!config?.enabled ? <p>{zh ? '網站投稿準備中，歡迎先到 Discord 社群分享。' : 'Website submissions are being prepared. Share in our Discord community for now.'} <a href="https://discord.gg/XmXqnb9zu" target="_blank" rel="noreferrer">Discord ↗</a></p> :
    !session ? <button type="button" disabled={!authClient} onClick={() => login({type:'submit'})}>{zh ? '登入後投稿' : 'Sign in to submit'}</button> :
    issue ? <p role="status">{zh ? '投稿已送出，等待審核。' : 'Submitted for review.'} <a href={issue} target="_blank" rel="noreferrer">{zh ? '查看投稿進度 ↗' : 'View submission ↗'}</a></p> :
    <form onSubmit={submit}>
      <label>{zh ? '案例名稱' : 'Title'}<input name="title" maxLength={120} required /></label>
      <label>{zh ? '投稿者暱稱' : 'Display name'}<input name="nickname" maxLength={80} required /></label>
      <label>{zh ? '來源／個人連結（選填，HTTPS）' : 'Source / profile link (optional, HTTPS)'}<input name="source" type="url" pattern="https://.*" maxLength={500} /></label>
      <label>{zh ? '分類' : 'Category'}<select name="category" required defaultValue=""><option value="" disabled>{zh ? '請選擇分類' : 'Choose a category'}</option>{categories.map(value=><option key={value} value={value}>{label(value)}</option>)}</select></label>
      {[["styles",styles,zh ? '風格' : 'Styles'],["scenes",scenes,zh ? '場景' : 'Scenes']].map(([name,options,title])=><fieldset className="submissionTags" key={name}><legend>{title}{zh ? '（可複選，至少選一項）' : ' (select one or more)'}</legend><div>{options.map(value=><label key={value}><input type="checkbox" name={name} value={value}/>{label(value)}</label>)}</div></fieldset>)}
      <small>{zh ? '請選擇最符合作品的標籤，維護者審核時可能調整。' : 'Choose tags that fit your work. Reviewers may adjust them.'}</small>
      <label>{zh ? '完整提示詞（請使用繁體中文與台灣用語）' : 'Full prompt'}<textarea name="prompt" maxLength={12000} rows={8} required /></label>
      <label>{zh ? '成果圖片（PNG／JPEG，最多 3 MB）' : 'Result image (PNG / JPEG, max 3 MB)'}<input name="image" type="file" accept="image/png,image/jpeg" required /></label>
      <label className="submissionTrap" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <label className="submissionConsent"><input name="consent" type="checkbox" required />{zh ? '我確認有權分享這些內容，並同意圖片、提示詞與署名公開在 GitHub，供審核與圖庫刊登。' : 'I have permission to share this content and agree to publish the image, prompt and attribution on GitHub for review and gallery publication.'}</label>
      <div ref={challenge} />
      <p role="status">{status}</p>
      <button disabled={busy || !token}>{busy ? (zh ? '投稿中…' : 'Submitting…') : (zh ? '送出投稿' : 'Submit')}</button>
    </form>}
  </section>;
}
