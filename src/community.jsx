import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  CircleAlert,
  Clock3,
  CreditCard,
  ImageUp,
  LoaderCircle,
  LockKeyhole,
  LogIn,
  LogOut,
  MessageCircle,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Users,
  Wrench
} from 'lucide-react';
import officialAccountQr from './assets/canghe-official-account.png';
import './community.css';

const TERMS_VERSION = '2026-07-22';

const communityCopy = {
  zh: {
    brand: 'GPT Image 付費交流社群',
    back: '返回案例圖庫',
    admin: '管理後台',
    signIn: '登入',
    signOut: '登出',
    eyebrow: '一次付款 · 長期資格',
    title: '和真正創作影像的人，一起拆解提示詞、案例與工作流程。',
    subtitle: '透過支付寶一次性付款 ¥9.90。資格綁定目前登入的帳號，換裝置登入後仍可再次查看入群 QR Code。',
    priceSuffix: '一次',
    benefitsTitle: '社群主要交流什麼',
    benefits: ['GPT Image 提示詞與案例拆解', '影像生成工具、模型表現與實用工作流程', '創作者之間的實作問題與經驗交流'],
    audienceTitle: '適合這些人',
    audience: ['正在使用 AI 創作影像或內容', '希望將零散提示詞整理成穩定流程', '願意分享真實嘗試，也尊重其他成員'],
    boundaryTitle: '服務範圍',
    boundaries: ['不承諾一對一服務或固定答覆次數', '不承諾獨家資料、收益結果或社群永久活躍', '違法、廣告騷擾或破壞交流秩序的帳號可能被撤銷資格'],
    checking: '正在確認帳號與付款資格…',
    loginTitle: '登入後才能購買或恢復資格',
    loginText: '資格綁定現有 Supabase 帳號，以避免 QR Code 公開流傳，也方便跨裝置恢復。',
    availableTitle: '準備好即可付款',
    availableText: '金額由伺服器固定為 ¥9.90，瀏覽器無法修改。付款完成後，伺服器會向支付寶查詢訂單並確認。',
    terms: '我已閱讀並同意：本社群以實作交流為主，不包含一對一服務、固定答覆、獨家資料或收益承諾；退款須聯絡管理員，由人工審核。',
    pay: '以支付寶付款 ¥9.90',
    redirecting: '正在開啟支付寶付款頁面…',
    pendingTitle: '尚待付款或確認',
    pendingText: '請勿重複付款。若已付款，請重新查詢同一筆訂單；支付寶通知或主動查詢任一確認後均會恢復資格。',
    query: '重新查詢付款結果',
    closeOrder: '關閉待付款訂單',
    paidTitle: '付款資格已確認',
    paidText: '請以 WeChat 掃描下方 QR Code 加入社群。此 QR Code 僅會顯示給目前已付款帳號。',
    qrUpdatingTitle: '付款已確認，QR Code 正在更新',
    qrUpdatingText: '管理員尚未上傳目前的社群 QR Code，或剛完成更換。請稍後重新整理；付款資格不會遺失。',
    pausedTitle: '目前暫停新訂單',
    pausedText: '已付款使用者仍可查看 QR Code，退款與管理員操作也不受影響。',
    refundedTitle: '這筆訂單已退款',
    refundedText: '支付寶已確認退款成功，因此這筆訂單的 QR Code 存取資格已失效。',
    revokedTitle: '此資格已被撤銷',
    revokedText: '如有疑問，請透過頁面底部的人工支援管道聯絡管理員。',
    failedTitle: '暫時無法完成操作',
    retry: '重試',
    support: '本站付款與使用支援',
    supportText: '如需付款、入群、退款或使用協助，請聯絡本站管理員。',
    upstreamSupport: '上游作者資訊',
    upstreamSupportText: '此 QR Code 與 WeChat 官方帳號「苍何」屬於上游作者資訊，並非本站的付款、入群或退款客服。',
    upstreamSupportQrAlt: '上游作者「苍何」的 WeChat 官方帳號 QR Code（非本站客服）',
    resultEyebrow: '支付寶付款結果',
    resultTitle: '伺服器正在確認這筆訂單。',
    resultText: '本頁不會以網址參數判定付款成功，只會顯示伺服器查詢或驗簽通知確認後的狀態。',
    qrAlt: 'GPT Image 付費交流社群 QR Code',
    noOrder: '目前帳號沒有可查詢的付費社群訂單。',
    statusLabels: {
      PENDING: '待付款', PAID: '已付款', CLOSED: '已關閉', REFUNDED: '已退款', REVOKED: '已撤銷'
    }
  },
  en: {
    brand: 'GPT Image Paid Community',
    back: 'Back to gallery',
    admin: 'Admin',
    signIn: 'Sign in',
    signOut: 'Sign out',
    eyebrow: 'One payment · Long-term access',
    title: 'Discuss prompts, real cases, tools, and practical image workflows.',
    subtitle: 'A one-time Alipay payment of ¥9.90. Access is tied to your account and can be restored on another device.',
    priceSuffix: 'one time',
    benefitsTitle: 'What the group covers',
    benefits: ['GPT Image prompt and case breakdowns', 'Image tools, model behavior, and practical workflows', 'Peer discussion grounded in real attempts'],
    audienceTitle: 'A good fit for',
    audience: ['People using AI for images or content production', 'People turning scattered prompts into stable workflows', 'People willing to share and respect the community'],
    boundaryTitle: 'Service boundaries',
    boundaries: ['No promise of one-to-one service or fixed answer frequency', 'No promise of exclusive materials, income, or permanent activity', 'Spam, unlawful behavior, or disruption may lead to access revocation'],
    checking: 'Checking your account and payment access…',
    loginTitle: 'Sign in to buy or restore access',
    loginText: 'Access is tied to your existing account so the group QR stays protected and works across devices.',
    availableTitle: 'Ready when you are',
    availableText: 'The server fixes the price at ¥9.90. Payment is confirmed only by a server-side Alipay query or verified notification.',
    terms: 'I agree that this is a peer discussion group, not one-to-one support, fixed Q&A, exclusive materials, or an income guarantee. Refunds require manual review.',
    pay: 'Pay ¥9.90 with Alipay',
    redirecting: 'Opening Alipay checkout…',
    pendingTitle: 'Payment pending or being confirmed',
    pendingText: 'Do not pay twice. Query the same order after payment; access is restored after a verified notification or server-side query.',
    query: 'Query payment again',
    closeOrder: 'Close pending order',
    paidTitle: 'Payment access confirmed',
    paidText: 'Scan the protected QR below with WeChat. It is available only to the signed-in paid account.',
    qrUpdatingTitle: 'Paid — group QR is being updated',
    qrUpdatingText: 'The administrator has not uploaded the current QR yet, or is replacing it. Your paid access remains valid.',
    pausedTitle: 'New payments are paused',
    pausedText: 'Paid users still retain QR access, while refunds and administrator operations continue.',
    refundedTitle: 'This order was refunded',
    refundedText: 'Alipay confirmed the refund, so QR access from this order is no longer active.',
    revokedTitle: 'This access was revoked',
    revokedText: 'Contact the administrator through the support channel below if you need help.',
    failedTitle: 'The operation could not be completed',
    retry: 'Retry',
    support: 'This site’s payment and product support',
    supportText: 'For payment, community access, refunds, or product help, contact this site’s administrator.',
    upstreamSupport: 'Upstream author information',
    upstreamSupportText: 'This QR code and the WeChat official account 苍何 belong to the upstream author. They are not this site’s payment, access, or refund support.',
    upstreamSupportQrAlt: 'WeChat official account QR code for the upstream author 苍何 (not this site’s support)',
    resultEyebrow: 'Alipay result',
    resultTitle: 'The server is confirming this order.',
    resultText: 'URL parameters are never treated as proof of payment. This page only shows server-verified status.',
    qrAlt: 'GPT Image paid community QR code',
    noOrder: 'This account has no paid-community order to query.',
    statusLabels: {
      PENDING: 'Pending', PAID: 'Paid', CLOSED: 'Closed', REFUNDED: 'Refunded', REVOKED: 'Revoked'
    }
  }
};

function authHeaders(session) {
  return session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {};
}

function submitPaymentForm(paymentHtml) {
  const container = document.createElement('div');
  container.className = 'communityPaymentHandoff';
  container.innerHTML = paymentHtml;
  document.body.appendChild(container);
  const form = container.querySelector('form');
  if (!form) {
    container.remove();
    throw new Error('PAYMENT_FORM_INVALID');
  }
  form.submit();
}

function CommunityStateCard({ icon, title, children, tone = '', actions = null }) {
  return (
    <section className={`communityStateCard ${tone}`.trim()}>
      <span className="communityStateIcon">{icon}</span>
      <div>
        <h2>{title}</h2>
        {children}
        {actions ? <div className="communityStateActions">{actions}</div> : null}
      </div>
    </section>
  );
}

export function CommunityPage({
  language,
  setLanguage,
  authReady,
  session,
  profile,
  onSignIn,
  onSignOut,
  onOpenAdmin
}) {
  const t = communityCopy[language] || communityCopy.zh;
  const [config, setConfig] = useState(null);
  const [communityStatus, setCommunityStatus] = useState(null);
  const [phase, setPhase] = useState('checking');
  const [message, setMessage] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [qrUrl, setQrUrl] = useState('');
  const [qrState, setQrState] = useState('idle');
  const resultQueryRef = useRef('');
  const isResultPage = window.location.pathname.replace(/\/+$/, '') === '/community/result';
  const resultOrderId = useMemo(
    () => new URLSearchParams(window.location.search).get('order_id') || '',
    []
  );

  useEffect(() => {
    const previousTitle = document.title;
    document.title = language === 'zh'
      ? 'GPT Image 付費交流社群'
      : 'GPT Image Paid Community';
    return () => { document.title = previousTitle; };
  }, [language]);

  const loadQr = useCallback(async () => {
    if (!session?.access_token) return;
    setQrState('loading');
    try {
      const response = await fetch('/api/community/qr', {
        headers: authHeaders(session),
        cache: 'no-store'
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        if (payload.error === 'COMMUNITY_QR_NOT_READY') {
          setQrState('missing');
          return;
        }
        throw new Error(payload.error || 'COMMUNITY_QR_FAILED');
      }
      const blob = await response.blob();
      const nextUrl = URL.createObjectURL(blob);
      setQrUrl((current) => {
        if (current) URL.revokeObjectURL(current);
        return nextUrl;
      });
      setQrState('ready');
    } catch (error) {
      setQrState('error');
      setMessage(String(error?.message || 'COMMUNITY_QR_FAILED'));
      throw error;
    }
  }, [session?.access_token]);

  const loadStatus = useCallback(async () => {
    const response = await fetch('/api/community/status', {
      headers: authHeaders(session),
      cache: 'no-store'
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload.ok) throw new Error(payload.error || 'COMMUNITY_STATUS_FAILED');
    setCommunityStatus(payload);
    if (payload.eligible && payload.qrReady) await loadQr();
    else {
      setQrState(payload.eligible ? 'missing' : 'idle');
      setQrUrl((current) => {
        if (current) URL.revokeObjectURL(current);
        return '';
      });
    }
    return payload;
  }, [loadQr, session?.access_token]);

  useEffect(() => {
    if (!authReady) return undefined;
    let cancelled = false;
    setPhase('checking');
    setMessage('');
    Promise.all([
      fetch('/api/community/config', { cache: 'no-store' }).then((response) => response.json()),
      loadStatus()
    ])
      .then(([configPayload]) => {
        if (cancelled) return;
        if (!configPayload?.ok) throw new Error(configPayload?.error || 'COMMUNITY_CONFIG_FAILED');
        setConfig(configPayload);
        setPhase('ready');
      })
      .catch((error) => {
        if (!cancelled) {
          setMessage(String(error?.message || 'COMMUNITY_STATUS_FAILED'));
          setPhase('failed');
        }
      });
    return () => { cancelled = true; };
  }, [authReady, loadStatus, session?.access_token]);

  useEffect(() => () => {
    if (qrUrl) URL.revokeObjectURL(qrUrl);
  }, [qrUrl]);

  useEffect(() => {
    if (!authReady || !session?.access_token || !isResultPage || !resultOrderId) return undefined;
    const key = `${session.user?.id || ''}:${resultOrderId}`;
    if (resultQueryRef.current === key) return undefined;
    resultQueryRef.current = key;
    let cancelled = false;
    let timeoutId;

    async function confirmAndPoll() {
      setPhase('checking');
      try {
        const response = await fetch(`/api/community/alipay/query?orderId=${encodeURIComponent(resultOrderId)}`, {
          headers: authHeaders(session),
          cache: 'no-store'
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok && payload.error !== 'COMMUNITY_QUERY_FAILED') {
          throw new Error(payload.error || 'COMMUNITY_QUERY_FAILED');
        }

        let latest = await loadStatus();
        setPhase('ready');
        for (let attempt = 0; attempt < 6 && !cancelled && latest.order?.status === 'PENDING'; attempt += 1) {
          await new Promise((resolve) => {
            timeoutId = window.setTimeout(resolve, 2500);
          });
          if (cancelled) return;
          latest = await loadStatus();
        }
      } catch (error) {
        if (!cancelled) {
          setMessage(String(error?.message || 'COMMUNITY_QUERY_FAILED'));
          setPhase('failed');
        }
      }
    }
    confirmAndPoll();
    return () => {
      cancelled = true;
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [authReady, isResultPage, loadStatus, resultOrderId, session?.access_token, session?.user?.id]);

  async function handleCheckout() {
    if (!acceptedTerms || !session?.access_token) return;
    setPhase('redirecting');
    setMessage('');
    try {
      const response = await fetch('/api/community/alipay/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders(session)
        },
        body: JSON.stringify({ acceptedTerms: true, termsVersion: TERMS_VERSION })
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload.ok) throw new Error(payload.error || 'COMMUNITY_CHECKOUT_FAILED');
      if (payload.paid) {
        await loadStatus();
        setPhase('ready');
        return;
      }
      submitPaymentForm(payload.paymentHtml);
    } catch (error) {
      setMessage(String(error?.message || 'COMMUNITY_CHECKOUT_FAILED'));
      setPhase('failed');
    }
  }

  async function handleRefreshStatus() {
    setPhase('checking');
    setMessage('');
    try {
      await loadStatus();
      setPhase('ready');
    } catch (error) {
      setMessage(String(error?.message || 'COMMUNITY_STATUS_FAILED'));
      setPhase('failed');
    }
  }

  async function handleQuery() {
    const orderId = communityStatus?.order?.id;
    if (!orderId) return;
    setPhase('checking');
    setMessage('');
    try {
      const response = await fetch(`/api/community/alipay/query?orderId=${encodeURIComponent(orderId)}`, {
        headers: authHeaders(session),
        cache: 'no-store'
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload.ok) throw new Error(payload.error || 'COMMUNITY_QUERY_FAILED');
      await loadStatus();
      setPhase('ready');
    } catch (error) {
      setMessage(String(error?.message || 'COMMUNITY_QUERY_FAILED'));
      setPhase('failed');
    }
  }

  async function handleClose() {
    const orderId = communityStatus?.order?.id;
    if (!orderId) return;
    setPhase('checking');
    setMessage('');
    try {
      const response = await fetch('/api/community/alipay/close', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders(session)
        },
        body: JSON.stringify({ orderId })
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload.ok) throw new Error(payload.error || 'COMMUNITY_CLOSE_FAILED');
      await loadStatus();
      setPhase('ready');
    } catch (error) {
      setMessage(String(error?.message || 'COMMUNITY_CLOSE_FAILED'));
      setPhase('failed');
    }
  }

  const orderStatus = communityStatus?.order?.status || '';
  const paymentEnabled = Boolean(communityStatus?.paymentEnabled ?? config?.paymentEnabled);
  let view = 'available';
  if (!authReady || phase === 'checking') view = 'checking';
  else if (phase === 'redirecting') view = 'redirecting';
  else if (phase === 'failed') view = 'failed';
  else if (!session?.access_token) view = 'login';
  else if (orderStatus === 'REFUNDED') view = 'refunded';
  else if (orderStatus === 'REVOKED') view = 'revoked';
  else if (communityStatus?.eligible && (qrState === 'missing' || !communityStatus.qrReady)) view = 'qrUpdating';
  else if (communityStatus?.eligible) view = 'paid';
  else if (orderStatus === 'PENDING') view = 'pending';
  else if (!paymentEnabled) view = 'paused';

  return (
    <div className="communityPage">
      <header className="communityTopbar">
        <a className="communityBrand" href="/community"><Users size={20} />{t.brand}</a>
        <nav>
          <a href="/"><ArrowLeft size={16} />{t.back}</a>
          <div className="communityLanguage" aria-label={language === 'zh' ? '選擇語言' : 'Language'}>
            <button className={language === 'en' ? 'active' : ''} type="button" onClick={() => setLanguage('en')}>EN</button>
            <button
              className={language === 'zh' ? 'active' : ''}
              type="button"
              aria-label="繁體中文（台灣）"
              title="繁體中文（台灣）"
              onClick={() => setLanguage('zh')}
            >繁中</button>
          </div>
          {profile?.isSuperAdmin ? <button type="button" onClick={onOpenAdmin}><Wrench size={16} />{t.admin}</button> : null}
          {session?.access_token
            ? <button type="button" onClick={onSignOut}><LogOut size={16} />{t.signOut}</button>
            : <button type="button" onClick={onSignIn}><LogIn size={16} />{t.signIn}</button>}
        </nav>
      </header>

      <main className="communityMain">
        <section className="communityHero">
          <div>
            <span className="communityEyebrow"><Sparkles size={15} />{isResultPage ? t.resultEyebrow : t.eyebrow}</span>
            <h1>{isResultPage ? t.resultTitle : t.title}</h1>
            <p>{isResultPage ? t.resultText : t.subtitle}</p>
          </div>
          <div className="communityPrice">
            <span>¥</span><strong>9.90</strong><em>{t.priceSuffix}</em>
          </div>
        </section>

        <section className="communityContentGrid">
          <div className="communityPrimary">
            {view === 'checking' ? (
              <CommunityStateCard icon={<LoaderCircle className="spinIcon" size={24} />} title={t.checking} />
            ) : null}
            {view === 'redirecting' ? (
              <CommunityStateCard icon={<LoaderCircle className="spinIcon" size={24} />} title={t.redirecting} />
            ) : null}
            {view === 'login' ? (
              <CommunityStateCard
                icon={<LockKeyhole size={24} />}
                title={t.loginTitle}
                actions={<button type="button" onClick={onSignIn}><LogIn size={17} />{t.signIn}</button>}
              ><p>{t.loginText}</p></CommunityStateCard>
            ) : null}
            {view === 'available' ? (
              <CommunityStateCard icon={<CreditCard size={24} />} title={t.availableTitle}>
                <p>{t.availableText}</p>
                <label className="communityTerms">
                  <input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} />
                  <span>{t.terms}</span>
                </label>
                <button className="communityPayButton" type="button" disabled={!acceptedTerms} onClick={handleCheckout}>
                  <CreditCard size={18} />{t.pay}
                </button>
              </CommunityStateCard>
            ) : null}
            {view === 'pending' ? (
              <CommunityStateCard
                icon={<Clock3 size={24} />}
                title={t.pendingTitle}
                tone="pending"
                actions={<><button type="button" onClick={handleQuery}><RefreshCw size={17} />{t.query}</button><button className="secondary" type="button" onClick={handleClose}>{t.closeOrder}</button></>}
              ><p>{t.pendingText}</p></CommunityStateCard>
            ) : null}
            {view === 'paid' ? (
              <CommunityStateCard icon={<CheckCircle2 size={24} />} title={t.paidTitle} tone="success">
                <p>{t.paidText}</p>
                {qrUrl ? <img className="communityProtectedQr" src={qrUrl} alt={t.qrAlt} /> : null}
              </CommunityStateCard>
            ) : null}
            {view === 'qrUpdating' ? (
              <CommunityStateCard
                icon={<ImageUp size={24} />}
                title={t.qrUpdatingTitle}
                tone="pending"
                actions={<button type="button" onClick={handleRefreshStatus}><RefreshCw size={17} />{t.retry}</button>}
              ><p>{t.qrUpdatingText}</p></CommunityStateCard>
            ) : null}
            {view === 'paused' ? (
              <CommunityStateCard icon={<CircleAlert size={24} />} title={t.pausedTitle} tone="paused"><p>{t.pausedText}</p></CommunityStateCard>
            ) : null}
            {view === 'refunded' ? (
              <CommunityStateCard icon={<RotateCcw size={24} />} title={t.refundedTitle} tone="muted"><p>{t.refundedText}</p></CommunityStateCard>
            ) : null}
            {view === 'revoked' ? (
              <CommunityStateCard icon={<LockKeyhole size={24} />} title={t.revokedTitle} tone="muted"><p>{t.revokedText}</p></CommunityStateCard>
            ) : null}
            {view === 'failed' ? (
              <CommunityStateCard
                icon={<CircleAlert size={24} />}
                title={t.failedTitle}
                tone="error"
                actions={<button type="button" onClick={() => { setPhase('checking'); loadStatus().then(() => setPhase('ready')).catch((error) => { setMessage(String(error?.message || 'COMMUNITY_STATUS_FAILED')); setPhase('failed'); }); }}><RefreshCw size={17} />{t.retry}</button>}
              ><p>{message}</p></CommunityStateCard>
            ) : null}
            {isResultPage && authReady && session?.access_token && !resultOrderId ? (
              <p className="communityInlineNotice">{t.noOrder}</p>
            ) : null}
            {communityStatus?.order ? (
              <div className="communityOrderBadge">
                <ShieldCheck size={15} />
                <span>{t.statusLabels[communityStatus.order.status] || communityStatus.order.status}</span>
                <code>{communityStatus.order.id}</code>
              </div>
            ) : null}
          </div>

          <aside className="communitySidebar">
            <section><h2>{t.benefitsTitle}</h2><ul>{t.benefits.map((item) => <li key={item}><Check size={16} />{item}</li>)}</ul></section>
            <section><h2>{t.audienceTitle}</h2><ul>{t.audience.map((item) => <li key={item}><Check size={16} />{item}</li>)}</ul></section>
            <section className="boundary"><h2>{t.boundaryTitle}</h2><ul>{t.boundaries.map((item) => <li key={item}><ShieldCheck size={16} />{item}</li>)}</ul></section>
          </aside>
        </section>

        <section className="communitySupport">
          <MessageCircle size={21} />
          <div className="communitySupportLocal"><h2>{t.support}</h2><p>{config?.support || t.supportText}</p></div>
          <div className="communitySupportUpstream">
            <img className="communitySupportQr" src={officialAccountQr} alt={t.upstreamSupportQrAlt} />
            <div><h3>{t.upstreamSupport}</h3><p>{t.upstreamSupportText}</p></div>
          </div>
        </section>
      </main>
    </div>
  );
}

export function CommunityAdminSection({ language, session }) {
  const zh = language === 'zh';
  const orderStatusLabels = zh
    ? { PENDING: '待付款', PAID: '已付款', CLOSED: '已關閉', REFUNDED: '已退款', REVOKED: '已撤銷' }
    : { PENDING: 'Pending', PAID: 'Paid', CLOSED: 'Closed', REFUNDED: 'Refunded', REVOKED: 'Revoked' };
  const refundStatusLabels = zh
    ? { NONE: '未申請退款', PROCESSING: '退款處理中', SUCCEEDED: '退款完成', FAILED: '退款失敗' }
    : { NONE: 'No refund', PROCESSING: 'Refund processing', SUCCEEDED: 'Refunded', FAILED: 'Refund failed' };
  const [orders, setOrders] = useState([]);
  const [qrMeta, setQrMeta] = useState(null);
  const [qrUrl, setQrUrl] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [busyId, setBusyId] = useState('');

  const loadData = useCallback(async () => {
    if (!session?.access_token) return;
    setStatus('loading');
    setMessage('');
    try {
      const headers = authHeaders(session);
      const [ordersResponse, qrResponse] = await Promise.all([
        fetch('/api/admin/community/orders', { headers, cache: 'no-store' }),
        fetch('/api/admin/community/qr?metadata=1', { headers, cache: 'no-store' })
      ]);
      const ordersPayload = await ordersResponse.json().catch(() => ({}));
      if (!ordersResponse.ok || !ordersPayload.ok) throw new Error(ordersPayload.error || 'COMMUNITY_ADMIN_ORDERS_FAILED');
      setOrders(ordersPayload.orders || []);
      if (qrResponse.ok) {
        const qrPayload = await qrResponse.json().catch(() => ({}));
        setQrMeta(qrPayload.asset || null);
        const imageResponse = await fetch(`/api/admin/community/qr?v=${encodeURIComponent(qrPayload.asset?.id || '')}`, {
          headers,
          cache: 'no-store'
        });
        if (imageResponse.ok) {
          const nextUrl = URL.createObjectURL(await imageResponse.blob());
          setQrUrl((current) => {
            if (current) URL.revokeObjectURL(current);
            return nextUrl;
          });
        }
      } else if (qrResponse.status === 404) {
        setQrMeta(null);
        setQrUrl((current) => {
          if (current) URL.revokeObjectURL(current);
          return '';
        });
      } else {
        const qrPayload = await qrResponse.json().catch(() => ({}));
        throw new Error(qrPayload.error || 'COMMUNITY_QR_FAILED');
      }
      setStatus('ready');
    } catch (error) {
      setMessage(String(error?.message || 'COMMUNITY_ADMIN_FAILED'));
      setStatus('error');
    }
  }, [session?.access_token]);

  useEffect(() => { loadData(); }, [loadData]);
  useEffect(() => () => { if (qrUrl) URL.revokeObjectURL(qrUrl); }, [qrUrl]);

  async function uploadQr(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 2 * 1024 * 1024) {
      setMessage(zh ? '僅支援 2 MB 以下的 PNG、JPEG 或 WebP 檔案。' : 'Use a PNG, JPEG, or WebP file under 2 MB.');
      return;
    }
    setStatus('loading');
    try {
      const response = await fetch('/api/admin/community/qr', {
        method: 'POST',
        headers: { 'Content-Type': file.type, ...authHeaders(session) },
        body: file
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload.ok) throw new Error(payload.error || 'COMMUNITY_QR_UPLOAD_FAILED');
      await loadData();
      setMessage(zh ? '社群 QR Code 已更新。' : 'The group QR has been updated.');
    } catch (error) {
      setMessage(String(error?.message || 'COMMUNITY_QR_UPLOAD_FAILED'));
      setStatus('error');
    }
  }

  async function orderAction(order, action) {
    const destructive = action === 'refund' || action === 'revoke';
    if (destructive && !window.confirm(zh ? '確定要對這筆訂單執行此操作嗎？' : 'Confirm this order action?')) return;
    setBusyId(`${action}:${order.id}`);
    setMessage('');
    try {
      const isQuery = action === 'refund-query';
      const url = isQuery
        ? `/api/admin/community/refund-query?orderId=${encodeURIComponent(order.id)}`
        : `/api/admin/community/${action}`;
      const response = await fetch(url, {
        method: isQuery ? 'GET' : 'POST',
        headers: isQuery ? authHeaders(session) : { 'Content-Type': 'application/json', ...authHeaders(session) },
        body: isQuery ? undefined : JSON.stringify({ orderId: order.id })
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload.ok) throw new Error(payload.error || 'COMMUNITY_ADMIN_ACTION_FAILED');
      await loadData();
      setMessage(zh ? '訂單狀態已更新。' : 'Order status updated.');
    } catch (error) {
      setMessage(String(error?.message || 'COMMUNITY_ADMIN_ACTION_FAILED'));
    } finally {
      setBusyId('');
    }
  }

  return (
    <section className="communityAdminBlock">
      <div className="communityAdminHeader">
        <div><span><Users size={17} />{zh ? '付費交流社群' : 'Paid community'}</span><h3>{zh ? '訂單、QR Code 與退款' : 'Orders, QR, and refunds'}</h3></div>
        <button type="button" onClick={loadData} disabled={status === 'loading'}><RefreshCw size={16} />{zh ? '重新整理' : 'Refresh'}</button>
      </div>
      <div className="communityAdminQr">
        {qrUrl ? <img src={qrUrl} alt={zh ? '目前付費社群 QR Code' : 'Current paid group QR'} /> : <div><ImageUp size={28} /><span>{zh ? '尚未上傳受保護的社群 QR Code' : 'No protected QR uploaded'}</span></div>}
        <label><ImageUp size={16} />{qrMeta ? (zh ? '替換社群 QR Code' : 'Replace QR') : (zh ? '上傳社群 QR Code' : 'Upload QR')}<input type="file" accept="image/png,image/jpeg,image/webp" onChange={uploadQr} /></label>
        {qrMeta ? <small>{qrMeta.mediaType} · {Math.ceil(qrMeta.sizeBytes / 1024)} KB</small> : null}
      </div>
      {message ? <p className="communityAdminMessage">{message}</p> : null}
      <div className="communityAdminTableWrap">
        <table>
          <thead><tr><th>{zh ? '帳號' : 'Account'}</th><th>{zh ? '狀態' : 'Status'}</th><th>{zh ? '金額' : 'Amount'}</th><th>{zh ? '付款時間' : 'Paid at'}</th><th>{zh ? '退款狀態' : 'Refund'}</th><th>{zh ? '操作' : 'Actions'}</th></tr></thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td><strong>{order.email || order.userId}</strong><small>{order.id}</small></td>
                <td><span className={`communityOrderStatus ${order.status.toLowerCase()}`}>{orderStatusLabels[order.status] || order.status}</span></td>
                <td>¥{(order.amountCents / 100).toFixed(2)}</td>
                <td>{order.paidAt ? new Date(order.paidAt).toLocaleString(zh ? 'zh-TW' : 'en-US') : '—'}</td>
                <td>{refundStatusLabels[order.refundStatus] || order.refundStatus}</td>
                <td><div className="communityAdminActions">
                  {order.status === 'PAID' && order.refundStatus !== 'PROCESSING' ? <button type="button" disabled={Boolean(busyId)} onClick={() => orderAction(order, 'refund')}>{zh ? '退款' : 'Refund'}</button> : null}
                  {order.status === 'PAID' && order.refundStatus === 'PROCESSING' ? <button type="button" disabled={Boolean(busyId)} onClick={() => orderAction(order, 'refund-query')}>{zh ? '查詢退款' : 'Query refund'}</button> : null}
                  {order.status === 'PAID' && order.refundStatus !== 'PROCESSING' ? <button className="danger" type="button" disabled={Boolean(busyId)} onClick={() => orderAction(order, 'revoke')}>{zh ? '撤銷資格' : 'Revoke'}</button> : null}
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!orders.length && status !== 'loading' ? <p>{zh ? '尚無付費社群訂單。' : 'No paid-community orders yet.'}</p> : null}
      </div>
    </section>
  );
}
