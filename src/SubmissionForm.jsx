import React, { useEffect, useRef, useState } from 'react';

export default function SubmissionForm({ language }) {
  const zh = language === 'zh';
  const [config, setConfig] = useState(null);
  const [token, setToken] = useState('');
  const [status, setStatus] = useState('');
  const [issue, setIssue] = useState('');
  const [busy, setBusy] = useState(false);
  const challenge = useRef(null);
  const widget = useRef(null);
  useEffect(() => {
    fetch('/api/submissions').then(r => r.json()).then(setConfig).catch(() => setConfig({ enabled: false }));
  }, []);
  useEffect(() => {
    if (!config?.enabled) return;
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
    };
  }, [config]);
  async function submit(event) {
    event.preventDefault();
    if (busy || !token) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
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
      const response = await fetch('/api/submissions', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...Object.fromEntries(fields), image, consent: fields.has('consent'), token })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setIssue(result.issueUrl);
      form.reset();
    } catch {
      setStatus(zh ? '尚未確認投稿成功，請稍後查看 GitHub 投稿清單，避免重複送出；也可以到 Discord 聯絡我們。' : 'Submission could not be confirmed. Check the GitHub issue list before retrying, or contact us on Discord.');
    } finally {
      setBusy(false); setToken('');
      if (widget.current != null) window.turnstile?.reset(widget.current);
    }
  }
  return <section className="submissionSection" id="submit">
    <h2>{zh ? '投稿案例' : 'Submit a case'}</h2>
    <p>{zh ? '分享你的圖片與提示詞，不需要 GitHub 帳號。投稿內容會公開在 GitHub Issues，審核通過後才會加入圖庫。請勿填寫私人聯絡資訊。' : 'Share an image and prompt without a GitHub account. Submissions are public GitHub issues and join the gallery after review. Do not include private contact information.'}</p>
    {!config?.enabled ? <p>{zh ? '網站投稿準備中，歡迎先到 Discord 社群分享。' : 'Website submissions are being prepared. Share in our Discord community for now.'} <a href="https://discord.gg/XmXqnb9zu" target="_blank" rel="noreferrer">Discord ↗</a></p> :
    issue ? <p role="status">{zh ? '投稿已送出，等待審核。' : 'Submitted for review.'} <a href={issue} target="_blank" rel="noreferrer">{zh ? '查看投稿進度 ↗' : 'View submission ↗'}</a></p> :
    <form onSubmit={submit}>
      <label>{zh ? '案例名稱' : 'Title'}<input name="title" maxLength={120} required /></label>
      <label>{zh ? '投稿者暱稱' : 'Display name'}<input name="nickname" maxLength={80} required /></label>
      <label>{zh ? '使用模型' : 'Image model'}<input name="model" maxLength={100} placeholder="gpt-image-2" required /></label>
      <label>{zh ? '來源／個人連結（選填，HTTPS）' : 'Source / profile link (optional, HTTPS)'}<input name="source" type="url" pattern="https://.*" maxLength={500} /></label>
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
