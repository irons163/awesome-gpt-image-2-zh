import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowUpRight,
  BarChart3,
  Bot,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  Coins,
  Copy,
  CreditCard,
  Crown,
  Eye,
  Github,
  Heart,
  ImageIcon,
  LoaderCircle,
  LogIn,
  LogOut,
  MessageCircle,
  PackageCheck,
  RefreshCw,
  ReceiptText,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Terminal,
  TrendingUp,
  UserCircle,
  UserPlus,
  Users,
  WandSparkles,
  X
} from 'lucide-react';
import './styles.css';
import { isSupabaseConfigured, supabase } from './supabaseClient';
import skillExampleImage from '../plugins/awesome-gpt-image-2-zh/skills/gpt-image-2-style-library/assets/taiwan-railway-travel-map.png';

const fallbackRepoUrl = 'https://github.com/irons163/awesome-gpt-image-2-zh';
const discordUrl = import.meta.env.VITE_DISCORD_URL || 'https://discord.gg/XmXqnb9zu';
const personalSiteUrl = 'https://philforge.com/';
const codexLearningUrl = 'https://zero2codex.dev/';
const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
const watchaLogoUrl =
  'https://watcha.tos-cn-beijing.volces.com/products/logo/1752064513_guan-cha-insights.png?x-tos-process=image/resize,w_720/format,webp';

const copy = {
  en: {
    loading: 'Loading GPT-Image2 cases...',
    brand: 'GPT-Image2 Gallery',
    navCases: 'Cases',
    navSkill: 'Plugin',
    navTemplates: 'Templates',
    navDiscord: 'Discord',
    navPersonal: 'Personal site',
    navCodexLearning: 'Learn Codex',
    navMembership: 'Membership',
    navUpstream: 'GitHub',
    latestCases: 'Latest GPT-Image2 cases',
    eyebrow: 'Live GPT-Image2 prompt gallery',
    title: 'From viral images to reusable prompts.',
    subtitle:
      'A visual workspace for GPT-Image2 creation: browse real cases, copy prompts, explore industrial templates, and join the creator community.',
    explore: 'Explore cases',
    githubProject: 'GitHub project',
    cases: 'cases',
    categories: 'categories',
    templates: 'templates',
    sectionEyebrow: 'Copy, filter, remix',
    sectionTitle: 'Viral cases with prompts one click away.',
    templateEyebrow: '20+ industrial prompt templates',
    templateTitle: 'Start from a proven template, then remix the case library.',
    templateSubtitle:
      'Each template is distilled from real GPT-Image2 examples and includes structure, constraints, and pitfalls for production use.',
    templateKind: 'Prompt Template',
    openTemplate: 'View Template',
    skillEyebrow: 'Agent Plugin 1.0',
    skillTitle: 'Use the Taiwan-localized GPT-Image2 library as a portable Agent Plugin.',
    skillSubtitle:
      'Built with the open Agent Plugins standard, this package bundles the style workflow and shared template library for compatible AI agents.',
    skillCommandLabel: 'Install from GitHub in Codex',
    skillPromptLabel: 'Try this request',
    skillPrompt: 'Use gpt-image-2-style-library to create a Taiwan round-island railway travel map.',
    skillCopyCommand: 'Copy command',
    skillOpenDocs: 'View Agent Plugin source',
    skillOpenStandard: 'Agent Plugins standard',
    skillCopied: 'Command copied',
    skillExampleAlt: 'Taiwan round-island railway travel map generated with the GPT-Image2 style library skill',
    skillExampleCaption: 'Example: create a Taiwan round-island railway travel map with gpt-image-2-style-library.',
    skillStats: ['Agent Plugins 1.0', 'Portable package', '20+ templates'],
    search: 'Search cases, sources, prompts...',
    category: 'Category',
    style: 'Style',
    scene: 'Scene',
    all: 'All',
    matching: 'matching cases',
    previousPage: 'Previous',
    nextPage: 'Next',
    pageStatus: (current, total) => `Page ${current} of ${total}`,
    openGithub: 'View GitHub project',
    copied: 'Copied',
    copyPrompt: 'Copy Prompt',
    copyTemplatePrompt: 'Copy Template',
    favorite: 'Favorite',
    favorited: 'Favorited',
    unfavorite: 'Remove Favorite',
    myFavorites: 'My Favorites',
    noFavorites: 'No favorites yet.',
    signInToFavorite: 'Sign in to save favorite cases.',
    favoriteSaved: 'Favorite saved.',
    favoriteRemoved: 'Favorite removed.',
    favoriteFailed: 'Favorite update failed. Please try again.',
    closePreview: 'Close preview',
    viewDetails: 'View Details',
    generateTest: 'Generate Test',
    generateImage: 'Generate Image',
    generating: 'Generating...',
    editablePrompt: 'Editable Prompt',
    generatedResult: 'Generated Result',
    originalImage: 'Original Image',
    savedInBrowser: 'Saved in this browser',
    resetPrompt: 'Reset Prompt',
    oneFreeGeneration: '1 free test image',
    superAdminGeneration: 'Super admin mode: every generation costs 1 credit.',
    generationCost: 'Costs 1 credit',
    freeLimitReached: 'Free generation used. Buy credits or start a membership to keep generating.',
    creditsRequired: 'Credits required. Buy credits or start a membership to keep generating.',
    generationBusy: 'The image service is busy. Please try again in a moment.',
    generationFailed: 'Generation failed. Please try again later.',
    promptRequired: 'Prompt is required and must stay under 6000 characters.',
    serverUnavailable: 'Generation service is not configured yet.',
    checkoutUnavailable: 'Checkout is not configured yet.',
    checkoutFailed: 'Checkout failed. Please try again later.',
    billingSuccess: 'Payment is processing. Credits will appear after Stripe confirms it.',
    billingCancelled: 'Checkout cancelled. You can choose another pack anytime.',
    alipayReturnPending: 'Returned from Alipay. Confirming the order with Alipay now…',
    alipayPaymentSuccess: 'Alipay payment confirmed. Your credits are available.',
    alipayPaymentPending: 'The Alipay result is not confirmed yet. Do not pay again; refresh this return page to query the same order.',
    alipayQueryFailed: 'The Alipay result could not be confirmed. Do not pay again; refresh this return page or contact support.',
    authRequired: 'Sign in to generate a test image.',
    signIn: 'Sign in',
    signInTitle: 'Sign in to generate test images',
    signInSubtitle: 'Use Google or Watcha to unlock image generation, credits, and membership features.',
    authRateLimited: 'Too many login attempts. Please wait a bit, then try again.',
    googleNotConfigured: 'Google sign-in is not enabled yet.',
    continueWithGoogle: 'Continue with Google',
    continueWithWatcha: 'Continue with Watcha',
    authNotConfigured: 'Login is not configured yet.',
    watchaNotConfigured: 'Watcha sign-in is not configured yet.',
    watchaSessionExpired: 'Watcha sign-in expired. Please try again.',
    watchaDenied: 'Watcha authorization was cancelled.',
    watchaLoginFailed: 'Watcha sign-in failed. Please try again.',
    authError: 'Login failed. Please try again.',
    signOut: 'Sign out',
    account: 'Account',
    accountSettings: 'Account settings',
    accountTitle: 'Account settings',
    accountSubtitle: 'Manage your public display name, membership status, and GPT-Image2 credit usage.',
    displayName: 'Display name',
    saveProfile: 'Save profile',
    profileSaved: 'Profile saved.',
    profileUpdateFailed: 'Profile update failed. Please try again.',
    googleAvatarSource: 'Avatar is synced from your login provider.',
    accountOverview: 'Account overview',
    totalGenerations: 'Generated tests',
    totalGenerationCredits: 'Credits spent',
    generationUsage: 'Generation spending',
    openCase: 'View case',
    sourceCase: 'Source case',
    noGenerationTransactions: 'No generation spending yet.',
    adminPanel: 'Admin',
    membershipCenter: 'Membership & Credits',
    superAdmin: 'Super admin',
    credits: 'credits',
    buyCredits: 'Buy credits',
    subscribe: 'Subscribe',
    manageSubscription: 'Manage subscription',
    currentPlan: 'Current plan',
    noPlan: 'Free plan',
    activeUntil: 'Active until',
    membershipPlans: 'Membership',
    creditPacks: 'Credit packs',
    monthlyCredits: (count) => `${count} credits / month`,
    packCredits: (count) => `${count} credits`,
    billingTitle: 'Membership & credits',
    billingSubtitle: 'Members get monthly credits. Credit packs can be added anytime for more GPT-Image2 tests.',
    balanceTitle: 'Current balance',
    transactionHistory: 'Credit history',
    noTransactions: 'No credit history yet.',
    loadBilling: 'Loading billing...',
    openBilling: 'Open membership center',
    paymentReady: 'Secure checkout via Stripe or Alipay.',
    billingNotReady: 'No payment provider is configured yet.',
    payWithStripe: 'Stripe',
    payWithAlipay: 'Alipay',
    alipayPriceMissing: 'Alipay price pending',
    adminAdjust: 'Adjust credits',
    creditAmount: 'Amount',
    reason: 'Reason',
    applyAdjustment: 'Apply adjustment',
    freeReady: 'Free test ready',
    freeUsedShort: 'Free test used',
    signInToGenerate: 'Sign in to generate',
    creditsAvailable: (count) => `${count} credit${count === 1 ? '' : 's'} available`,
    adminTitle: 'User admin',
    adminSubtitle: 'Traffic, users, memberships, credits, and generation activity in one dashboard.',
    adminMetrics: 'Dashboard',
    trafficMetrics: 'Traffic',
    businessMetrics: 'Business',
    analyticsNotConfigured: 'GA4 is not configured yet. Business metrics are still available.',
    analyticsLoadFailed: 'GA4 data could not be loaded. Business metrics are still available.',
    invalidDateRange: 'Choose a date range within 180 days.',
    rangeToday: 'Today',
    range7d: '7 days',
    range30d: '30 days',
    range90d: '90 days',
    customRange: 'Custom',
    startDate: 'Start date',
    endDate: 'End date',
    applyRange: 'Apply',
    selectedRange: 'Selected range',
    pv: 'PV',
    uv: 'UV',
    visits: 'Visits',
    sessions: 'Sessions',
    newUsers: 'New users',
    registeredUsers: 'Registered users',
    newRegistrations: 'New registrations',
    newMembers: 'New members',
    activeMemberships: 'Active members',
    totalGenerationsMetric: 'Total generations',
    rangeGenerations: 'Range generations',
    succeeded: 'Succeeded',
    failed: 'Failed',
    pending: 'Pending',
    creditsConsumed: 'Credits consumed',
    creditsInCirculation: 'Credits in balances',
    purchasedCredits: 'Purchased credits',
    membershipCredits: 'Membership credits',
    dailyTraffic: 'Daily traffic',
    trafficTrend: 'Traffic trend',
    businessTrend: 'Business trend',
    registrations: 'Registrations',
    topPages: 'Top pages',
    channels: 'Channels',
    countries: 'Countries',
    pageViews: 'Views',
    noAnalyticsRows: 'No analytics rows yet.',
    refresh: 'Refresh',
    users: 'Users',
    role: 'Role',
    creditBalance: 'Credits',
    freeGeneration: 'Free test',
    spentCredits: 'Spent',
    purchased: 'Purchased',
    lastGeneration: 'Last generation',
    createdAt: 'Created',
    loadingUsers: 'Loading users...',
    noUsers: 'No users yet.',
    adminOnly: 'Only super admins can view this page.',
    fullPrompt: 'Full Prompt',
    templatePrompt: 'Template Prompt',
    useWhen: 'Use When',
    guidance: 'Guidance',
    pitfalls: 'Pitfalls',
    examples: 'Example Cases',
    source: 'Original source',
    openOnGithub: 'View case on GitHub'
  },
  zh: {
    loading: '正在載入 GPT-Image2 案例…',
    brand: 'GPT-Image2 圖庫',
    navCases: '案例',
    navSkill: '外掛',
    navTemplates: '範本',
    navDiscord: 'Discord 社群',
    navPersonal: '個人主頁',
    navCodexLearning: '從零開始學習 Codex',
    navMembership: '會員',
    navUpstream: 'GitHub',
    latestCases: '最新 GPT-Image2 案例',
    eyebrow: '持續更新的 GPT-Image2 提示詞圖庫',
    title: '從熱門影像，到可重複使用的提示詞。',
    subtitle:
      '專為 GPT-Image2 創作打造的視覺化工作區：瀏覽真實案例、複製提示詞、查看產業級範本，並加入創作者社群。',
    explore: '瀏覽案例',
    githubProject: 'GitHub 專案',
    cases: '則案例',
    categories: '個分類',
    templates: '個範本',
    sectionEyebrow: '複製、篩選、再利用',
    sectionTitle: '熱門案例與提示詞，一鍵即可取得。',
    templateEyebrow: '20+ 個產業級提示詞範本',
    templateTitle: '從成熟範本開始，再結合案例庫進一步調整。',
    templateSubtitle:
      '每個範本均由真實 GPT-Image2 案例萃取，包含結構、限制與常見陷阱，適合直接納入工作流程。',
    templateKind: '提示詞範本',
    openTemplate: '查看範本',
    skillEyebrow: 'Agent Plugin 1.0',
    skillTitle: '用可攜式 Agent Plugin 安裝台灣繁中 GPT-Image2 風格庫。',
    skillSubtitle:
      '採用開放的 Agent Plugins 標準，將風格工作流程與共用範本庫包成一份外掛，可供相容的 AI 代理程式載入。',
    skillCommandLabel: '從 GitHub 安裝到 Codex',
    skillPromptLabel: '試試這個要求',
    skillPrompt: '使用 gpt-image-2-style-library 技能建立台灣環島鐵道旅行圖。',
    skillCopyCommand: '複製命令',
    skillOpenDocs: '查看 Agent Plugin 原始碼',
    skillOpenStandard: 'Agent Plugins 標準',
    skillCopied: '命令已複製',
    skillExampleAlt: '由 GPT-Image2 風格庫技能產生的台灣環島鐵道旅行圖',
    skillExampleCaption: '範例：透過 gpt-image-2-style-library 建立「台灣環島鐵道旅行圖」。',
    skillStats: ['Agent Plugins 1.0', '可攜式套件', '20+ 個範本'],
    search: '搜尋案例、來源、提示詞…',
    category: '分類',
    style: '風格',
    scene: '場景',
    all: '全部',
    matching: '則符合條件的案例',
    previousPage: '上一頁',
    nextPage: '下一頁',
    pageStatus: (current, total) => `第 ${current}／${total} 頁`,
    openGithub: '查看 GitHub 專案',
    copied: '已複製',
    copyPrompt: '複製提示詞',
    copyTemplatePrompt: '複製範本',
    favorite: '收藏',
    favorited: '已收藏',
    unfavorite: '取消收藏',
    myFavorites: '我的收藏',
    noFavorites: '尚無收藏案例。',
    signInToFavorite: '登入後即可收藏案例。',
    favoriteSaved: '已加入收藏。',
    favoriteRemoved: '已取消收藏。',
    favoriteFailed: '收藏更新失敗，請稍後再試。',
    closePreview: '關閉預覽',
    viewDetails: '查看詳情',
    generateTest: '產生測試影像',
    generateImage: '產生影像',
    generating: '產生中…',
    editablePrompt: '可編輯提示詞',
    generatedResult: '產生結果',
    originalImage: '原始影像',
    savedInBrowser: '已儲存於此瀏覽器',
    resetPrompt: '恢復原始提示詞',
    oneFreeGeneration: '免費產生 1 張測試影像',
    superAdminGeneration: '超級管理員模式：每次產生影像需消耗 1 點數。',
    generationCost: '本次需消耗 1 點數',
    freeLimitReached: '免費額度已用完，可購買點數包或訂閱會員方案，繼續產生影像。',
    creditsRequired: '點數不足，可購買點數包或訂閱會員方案，繼續產生影像。',
    generationBusy: '影像生成服務忙碌中，請稍後再試。',
    generationFailed: '影像生成失敗，請稍後再試。',
    promptRequired: '提示詞不可留白，且不得超過 6,000 個字元。',
    serverUnavailable: '影像生成服務尚未完成設定。',
    checkoutUnavailable: '付款功能尚未完成設定。',
    checkoutFailed: '建立付款程序失敗，請稍後再試。',
    billingSuccess: '付款正在處理中，Stripe 確認後點數將自動入帳。',
    billingCancelled: '已取消付款；你可隨時改選其他點數包或會員方案。',
    alipayReturnPending: '已從支付寶返回，正在由伺服器查詢訂單結果…',
    alipayPaymentSuccess: '支付寶付款已確認，點數已入帳。',
    alipayPaymentPending: '支付寶付款結果尚未確認，請勿重複付款；重新整理此返回頁面可繼續查詢同一筆訂單。',
    alipayQueryFailed: '暫時無法確認支付寶付款結果，請勿重複付款；請重新整理此返回頁面或聯絡支援人員。',
    authRequired: '登入後即可產生測試影像。',
    signIn: '登入',
    signInTitle: '登入後產生測試影像',
    signInSubtitle: '使用 Google 或觀猹登入，即可使用影像生成測試、點數與會員功能。',
    authRateLimited: '登入嘗試過於頻繁，請稍後再試。',
    googleNotConfigured: 'Google 登入尚未啟用。',
    continueWithGoogle: '使用 Google 登入',
    continueWithWatcha: '使用觀猹登入',
    authNotConfigured: '登入功能尚未完成設定。',
    watchaNotConfigured: '觀猹登入尚未完成設定。',
    watchaSessionExpired: '觀猹登入已過期，請重新嘗試。',
    watchaDenied: '已取消觀猹授權。',
    watchaLoginFailed: '觀猹登入失敗，請稍後再試。',
    authError: '登入失敗，請稍後再試。',
    signOut: '登出',
    account: '帳號',
    accountSettings: '帳號設定',
    accountTitle: '帳號設定',
    accountSubtitle: '管理你的公開顯示名稱、會員狀態與 GPT-Image2 點數使用情形。',
    displayName: '顯示名稱',
    saveProfile: '儲存資料',
    profileSaved: '資料已儲存。',
    profileUpdateFailed: '資料儲存失敗，請稍後再試。',
    googleAvatarSource: '大頭貼會與登入帳號同步。',
    accountOverview: '帳號總覽',
    totalGenerations: '已產生測試次數',
    totalGenerationCredits: '已使用點數',
    generationUsage: '影像生成點數使用紀錄',
    openCase: '查看案例',
    sourceCase: '相關案例',
    noGenerationTransactions: '尚無影像生成點數使用紀錄。',
    adminPanel: '管理後台',
    membershipCenter: '會員與點數',
    superAdmin: '超級管理員',
    credits: '點數',
    buyCredits: '購買點數',
    subscribe: '訂閱會員',
    manageSubscription: '管理訂閱',
    currentPlan: '目前方案',
    noPlan: '免費方案',
    activeUntil: '有效期限',
    membershipPlans: '會員方案',
    creditPacks: '點數包',
    monthlyCredits: (count) => `每月 ${count} 點數`,
    packCredits: (count) => `${count} 點數`,
    billingTitle: '會員與點數',
    billingSubtitle: '會員每月可獲得點數，也能隨時購買點數包，測試更多 GPT-Image2 案例。',
    balanceTitle: '目前餘額',
    transactionHistory: '點數紀錄',
    noTransactions: '尚無點數紀錄。',
    loadBilling: '正在載入會員與點數…',
    openBilling: '開啟會員中心',
    paymentReady: '支援透過 Stripe 或支付寶安全付款。',
    billingNotReady: '付款服務尚未完成設定。',
    payWithStripe: 'Stripe 付款',
    payWithAlipay: '支付寶',
    alipayPriceMissing: '等待設定人民幣價格',
    adminAdjust: '調整點數',
    creditAmount: '點數數量',
    reason: '原因',
    applyAdjustment: '套用調整',
    freeReady: '免費測試可用',
    freeUsedShort: '免費測試已使用',
    signInToGenerate: '登入後產生',
    creditsAvailable: (count) => `可用點數：${count}`,
    adminTitle: '使用者管理',
    adminSubtitle: '在同一個儀表板查看流量、使用者、會員、點數與影像生成活動。',
    adminMetrics: '儀表板',
    trafficMetrics: '流量資料',
    businessMetrics: '業務資料',
    analyticsNotConfigured: 'GA4 尚未設定，仍可查看業務資料。',
    analyticsLoadFailed: 'GA4 資料暫時無法載入，仍可查看業務資料。',
    invalidDateRange: '請選擇 180 天以內的日期範圍。',
    rangeToday: '今天',
    range7d: '近 7 天',
    range30d: '近 30 天',
    range90d: '近 90 天',
    customRange: '自訂',
    startDate: '開始日期',
    endDate: '結束日期',
    applyRange: '套用',
    selectedRange: '目前區間',
    pv: 'PV',
    uv: 'UV',
    visits: '造訪數',
    sessions: '工作階段',
    newUsers: '新使用者',
    registeredUsers: '已註冊使用者',
    newRegistrations: '新增註冊',
    newMembers: '新增會員',
    activeMemberships: '活躍會員',
    totalGenerationsMetric: '總產生次數',
    rangeGenerations: '區間產生次數',
    succeeded: '成功',
    failed: '失敗',
    pending: '處理中',
    creditsConsumed: '已使用點數',
    creditsInCirculation: '帳號點數餘額',
    purchasedCredits: '購買點數',
    membershipCredits: '會員提供點數',
    dailyTraffic: '每日流量',
    trafficTrend: '流量趨勢',
    businessTrend: '業務趨勢',
    registrations: '註冊',
    topPages: '熱門頁面',
    channels: '流量來源',
    countries: '國家／地區',
    pageViews: '瀏覽次數',
    noAnalyticsRows: '尚無統計資料。',
    refresh: '重新整理',
    users: '使用者',
    role: '角色',
    creditBalance: '點數',
    freeGeneration: '免費測試',
    spentCredits: '已使用',
    purchased: '購買',
    lastGeneration: '最近產生',
    createdAt: '建立時間',
    loadingUsers: '正在載入使用者…',
    noUsers: '尚無使用者。',
    adminOnly: '僅超級管理員可檢視此頁面。',
    fullPrompt: '完整提示詞',
    templatePrompt: '範本提示詞',
    useWhen: '適用時機',
    guidance: '使用建議',
    pitfalls: '注意事項',
    examples: '相關案例',
    source: '原始來源',
    openOnGithub: '在 GitHub 查看案例'
  }
};

const labelMap = {
  zh: {
    'Architecture & Spaces': '建築與空間',
    Architecture: '建築',
    Brand: '品牌',
    'Brand & Logos': '品牌與標誌',
    Character: '角色',
    Characters: '人物',
    'Characters & People': '人物與角色',
    Charts: '圖表',
    'Charts & Infographics': '圖表與資訊圖像',
    Classical: '古典',
    Commerce: '商業',
    Creative: '創意',
    Documents: '文件',
    'Documents & Publishing': '文件與出版',
    Education: '教育',
    Fashion: '時尚',
    Food: '食品與飲品',
    History: '歷史',
    'History & Classical Themes': '歷史與古典主題',
    Illustration: '插畫',
    'Illustration & Art': '插畫與藝術',
    Infographic: '資訊圖表',
    'Other Use Cases': '其他使用情境',
    Photography: '攝影',
    'Photography & Realism': '攝影與寫實',
    Poster: '海報',
    'Posters & Typography': '海報與字體設計',
    Product: '產品',
    Products: '產品',
    'Products & E-commerce': '產品與電子商務',
    Realistic: '寫實',
    Scenes: '場景',
    'Scenes & Storytelling': '場景與敘事',
    Social: '社群',
    Story: '敘事',
    Tech: '科技',
    Travel: '旅遊',
    UI: '介面',
    'UI & Interfaces': 'UI 與介面'
  }
};

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

function textFor(value, language) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[language] || value.zh || value.en || '';
}

function listFor(value, language) {
  const localized = value?.[language] || value?.zh || value?.en || [];
  return Array.isArray(localized) ? localized : [];
}

function compactText(value, maxLength = 180) {
  if (!value || value.length <= maxLength) return value || '';
  return `${value.slice(0, maxLength)}...`;
}

function promptFor(caseItem, language) {
  if (!caseItem) return '';
  return language === 'zh' ? (caseItem.promptZh || caseItem.prompt || '') : (caseItem.prompt || '');
}

function promptPreviewFor(caseItem, language) {
  if (!caseItem) return '';
  if (language === 'zh') {
    return caseItem.promptPreviewZh || promptFor(caseItem, language).replace(/\n+/g, ' ').slice(0, 220);
  }
  return caseItem.promptPreview || promptFor(caseItem, language).replace(/\n+/g, ' ').slice(0, 220);
}

const GENERATED_TESTS_STORAGE_KEY = 'gpt-image-2-generated-tests:v1';
const MAX_SAVED_GENERATIONS = 12;
const HERO_CASE_COUNT = 5;
const HOT_STRIP_CASE_COUNT = 8;
const CASES_PER_PAGE = 72;
let bodyScrollLockCount = 0;
let bodyScrollLockState = null;

function pagePathWithHash() {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

function sendGaPageView() {
  if (!gaMeasurementId || typeof window.gtag !== 'function') return;
  window.gtag('event', 'page_view', {
    page_title: document.title,
    page_location: window.location.href,
    page_path: pagePathWithHash()
  });
}

function useGaPageViews() {
  useEffect(() => {
    if (!gaMeasurementId) return undefined;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', gaMeasurementId, { send_page_view: false });

    const existingScript = document.querySelector(`script[data-ga4="${gaMeasurementId}"]`);
    if (!existingScript) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaMeasurementId)}`;
      script.dataset.ga4 = gaMeasurementId;
      document.head.appendChild(script);
    }

    sendGaPageView();
    window.addEventListener('hashchange', sendGaPageView);
    window.addEventListener('popstate', sendGaPageView);
    return () => {
      window.removeEventListener('hashchange', sendGaPageView);
      window.removeEventListener('popstate', sendGaPageView);
    };
  }, []);
}

function useBodyScrollLock(active) {
  useEffect(() => {
    if (!active) return undefined;

    if (bodyScrollLockCount === 0) {
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      bodyScrollLockState = {
        scrollY,
        bodyOverflow: document.body.style.overflow,
        bodyPosition: document.body.style.position,
        bodyTop: document.body.style.top,
        bodyWidth: document.body.style.width,
        htmlOverflow: document.documentElement.style.overflow,
        htmlScrollBehavior: document.documentElement.style.scrollBehavior
      };
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    }

    bodyScrollLockCount += 1;

    return () => {
      bodyScrollLockCount = Math.max(0, bodyScrollLockCount - 1);
      if (bodyScrollLockCount > 0 || !bodyScrollLockState) return;

      const {
        scrollY,
        bodyOverflow,
        bodyPosition,
        bodyTop,
        bodyWidth,
        htmlOverflow,
        htmlScrollBehavior
      } = bodyScrollLockState;
      document.documentElement.style.scrollBehavior = 'auto';
      document.documentElement.style.overflow = htmlOverflow;
      document.body.style.overflow = bodyOverflow;
      document.body.style.position = bodyPosition;
      document.body.style.top = bodyTop;
      document.body.style.width = bodyWidth;
      bodyScrollLockState = null;
      window.scrollTo(0, scrollY);
      document.documentElement.style.scrollBehavior = htmlScrollBehavior;
    };
  }, [active]);
}

function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(Number(value || 0));
}

function formatShortDate(value, language) {
  if (!value) return '-';
  const normalized = /^\d{8}$/.test(String(value))
    ? `${String(value).slice(0, 4)}-${String(value).slice(4, 6)}-${String(value).slice(6, 8)}T00:00:00Z`
    : value;
  return new Date(normalized).toLocaleDateString(language === 'zh' ? 'zh-TW' : 'en-US', {
    month: 'short',
    day: 'numeric'
  });
}

function formatRangeDate(value, language) {
  if (!value) return '-';
  return new Date(`${value}T00:00:00`).toLocaleDateString(language === 'zh' ? 'zh-TW' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function dateInputValue(daysAgo = 0) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function firstNumber(...values) {
  const value = values.find((item) => item !== undefined && item !== null);
  return Number(value || 0);
}

function percentOf(value, max) {
  if (!max) return 0;
  return Math.max(4, Math.round((Number(value || 0) / max) * 100));
}

function readSavedGenerations() {
  try {
    return JSON.parse(localStorage.getItem(GENERATED_TESTS_STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function getSavedGeneration(caseId) {
  const saved = readSavedGenerations()[String(caseId)];
  return saved?.image ? saved : null;
}

function saveGeneratedTest(caseId, entry) {
  const key = String(caseId);
  const saved = readSavedGenerations();
  saved[key] = entry;

  const latestEntries = Object.entries(saved)
    .filter(([, value]) => value?.image)
    .sort(([, a], [, b]) => new Date(b.savedAt || 0) - new Date(a.savedAt || 0))
    .slice(0, MAX_SAVED_GENERATIONS);

  try {
    localStorage.setItem(GENERATED_TESTS_STORAGE_KEY, JSON.stringify(Object.fromEntries(latestEntries)));
  } catch {
    const compactEntries = latestEntries.slice(0, Math.max(1, Math.floor(MAX_SAVED_GENERATIONS / 2)));
    try {
      localStorage.setItem(GENERATED_TESTS_STORAGE_KEY, JSON.stringify(Object.fromEntries(compactEntries)));
    } catch {
      // Browser storage can be full or blocked. The generated image still stays
      // visible for the current dialog state when persistence is unavailable.
    }
  }
}

function normalizeFavoriteRows(favorites = []) {
  const rows = Array.isArray(favorites) ? favorites : [];
  return rows
    .map((favorite) => ({
      caseId: Number(favorite.caseId || favorite.case_id),
      createdAt: favorite.createdAt || favorite.created_at || ''
    }))
    .filter((favorite) => Number.isInteger(favorite.caseId) && favorite.caseId > 0);
}

function takeDistinctCases(cases, count, excludedIds = new Set()) {
  const picked = [];
  const seenIds = new Set(excludedIds);

  for (const caseItem of cases) {
    if (seenIds.has(caseItem.id)) continue;
    picked.push(caseItem);
    seenIds.add(caseItem.id);
    if (picked.length === count) break;
  }

  return picked;
}

function localizeLabel(value, language, styleLibrary) {
  const libraryItems = [
    ...(styleLibrary?.categories || []),
    ...(styleLibrary?.styles || []),
    ...(styleLibrary?.scenes || [])
  ];
  const match = libraryItems.find((item) => item.value === value || item.id === value);
  if (match) return textFor(match.title, language);
  return labelMap[language]?.[value] || value;
}

function localizeTemplateTag(value, language, styleLibrary) {
  const tagLabel = styleLibrary?.tagLabels?.[value];
  if (tagLabel) return textFor(tagLabel, language);
  return localizeLabel(value, language, styleLibrary);
}

function orderByLibrary(values, libraryItems = []) {
  const order = new Map(libraryItems.map((item, index) => [item.value, index]));
  return [...values].sort((a, b) => {
    const aOrder = order.has(a) ? order.get(a) : Number.MAX_SAFE_INTEGER;
    const bOrder = order.has(b) ? order.get(b) : Number.MAX_SAFE_INTEGER;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return a.localeCompare(b);
  });
}

async function copyToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Some embedded browsers block the async clipboard API. Fall back to the
      // older selection path so the copy button still works in local previews.
    }
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

function useCopy(language) {
  const [copiedId, setCopiedId] = useState(null);

  async function copyText(text, id) {
    await copyToClipboard(text);
    setCopiedId(id);
    window.setTimeout(() => setCopiedId(null), 1600);
  }

  async function copyPrompt(caseItem) {
    await copyText(promptFor(caseItem, language), `case-${caseItem.id}`);
  }

  return { copiedId, copyPrompt, copyText };
}

function generationErrorMessage(error, language) {
  const t = copy[language];
  if (error === 'FREE_LIMIT_REACHED') return t.freeLimitReached;
  if (error === 'CREDITS_REQUIRED') return t.creditsRequired;
  if (error === 'AUTH_REQUIRED') return t.authRequired;
  if (error === 'FORBIDDEN') return t.adminOnly;
  if (error === 'UPSTREAM_BUSY') return t.generationBusy;
  if (error === 'SERVER_NOT_CONFIGURED') return t.serverUnavailable;
  if (
    error === 'BILLING_NOT_CONFIGURED'
    || error === 'ALIPAY_NOT_CONFIGURED'
    || error === 'ALIPAY_PRICE_NOT_CONFIGURED'
  ) return t.checkoutUnavailable;
  if (
    error === 'CHECKOUT_FAILED'
    || error === 'BILLING_PORTAL_FAILED'
    || error === 'ALIPAY_CHECKOUT_FAILED'
  ) return t.checkoutFailed;
  if (
    error === 'ALIPAY_QUERY_FAILED'
    || error === 'ALIPAY_PAYMENT_RESULT_MISMATCH'
  ) return t.alipayQueryFailed;
  if (error === 'INVALID_PROMPT') return t.promptRequired;
  return t.generationFailed;
}

function submitAlipayPaymentForm(paymentHtml) {
  const documentNode = new DOMParser().parseFromString(paymentHtml, 'text/html');
  const sourceForm = documentNode.querySelector('form');
  if (!sourceForm) throw new Error('ALIPAY_CHECKOUT_FAILED');

  const action = new URL(sourceForm.getAttribute('action') || '');
  const allowedHosts = new Set([
    'openapi.alipay.com',
    'openapi-sandbox.dl.alipaydev.com'
  ]);
  if (action.protocol !== 'https:' || !allowedHosts.has(action.hostname)) {
    throw new Error('ALIPAY_CHECKOUT_FAILED');
  }

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = action.toString();
  form.acceptCharset = 'utf-8';
  form.style.display = 'none';

  sourceForm.querySelectorAll('input[name]').forEach((sourceInput) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = sourceInput.getAttribute('name');
    input.value = sourceInput.getAttribute('value') || '';
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
}

function getAuthHeaders(session) {
  return session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {};
}

function getGenerationQuotaText(profile, language) {
  const t = copy[language];
  if (!profile) return t.authRequired;
  if (profile.isSuperAdmin) {
    return profile.creditBalance > 0 ? `${t.superAdminGeneration} ${t.creditsAvailable(profile.creditBalance)}` : t.creditsRequired;
  }
  if (!profile.freeUsed) return t.oneFreeGeneration;
  if (profile.creditBalance > 0) return t.creditsAvailable(profile.creditBalance);
  return t.creditsRequired;
}

function productText(value, language) {
  if (!value) return '';
  return value[language] || value.zh || value.en || '';
}

function formatMembershipStatus(membership, language) {
  const t = copy[language];
  if (!membership?.isActive) return t.noPlan;
  const status = membership.status === 'trialing'
    ? (language === 'zh' ? '試用中' : 'Trialing')
    : (language === 'zh' ? '啟用中' : 'Active');
  if (!membership.currentPeriodEnd) return status;
  const date = new Date(membership.currentPeriodEnd).toLocaleDateString(language === 'zh' ? 'zh-TW' : 'en-US');
  return `${status} · ${t.activeUntil} ${date}`;
}

function formatRole(role, language) {
  if (role === 'super_admin') return language === 'zh' ? '超級管理員' : 'Super admin';
  if (role === 'user') return language === 'zh' ? '一般使用者' : 'User';
  return role || '-';
}

function transactionLabel(transaction, language) {
  const typeMap = {
    grant: language === 'zh' ? '贈與' : 'Grant',
    purchase: language === 'zh' ? '購買' : 'Purchase',
    membership_grant: language === 'zh' ? '會員提供' : 'Membership grant',
    generation: language === 'zh' ? '影像生成使用' : 'Generation',
    refund: language === 'zh' ? '失敗退回' : 'Refund',
    adjustment: language === 'zh' ? '管理員調整' : 'Admin adjustment'
  };
  return typeMap[transaction.type] || transaction.type || '-';
}

function transactionCaseId(transaction) {
  const rawCaseId = transaction?.caseId || transaction?.metadata?.caseId;
  const caseId = Number(rawCaseId);
  return Number.isFinite(caseId) && caseId > 0 ? caseId : null;
}

function TransactionItem({ transaction, language, casesById, onOpenCase }) {
  const t = copy[language];
  const caseId = transactionCaseId(transaction);
  const caseItem = caseId ? casesById?.get(caseId) : null;
  const caseLabel = caseItem
    ? `${t.openCase} #${caseId} · ${compactText(caseItem.title, 28)}`
    : `${t.sourceCase} #${caseId}`;

  return (
    <div className={cx('transactionItem', caseId && 'hasCase')}>
      <div className="transactionInfo">
        <span>{transactionLabel(transaction, language)}</span>
        {caseId ? (
          <button
            className="transactionCaseLink"
            type="button"
            onClick={() => caseItem && onOpenCase?.(caseItem)}
            disabled={!caseItem}
          >
            <ImageIcon size={14} />
            {caseLabel}
          </button>
        ) : null}
      </div>
      <strong className={transaction.amount >= 0 ? 'positive' : 'negative'}>
        {transaction.amount >= 0 ? '+' : ''}{transaction.amount}
      </strong>
      <em>
        {transaction.createdAt
          ? new Date(transaction.createdAt).toLocaleString(language === 'zh' ? 'zh-TW' : 'en-US')
          : '-'}
      </em>
    </div>
  );
}

function formatTemplatePrompt(item, language, styleLibrary) {
  const title = textFor(item.title, language);
  const description = textFor(item.description, language);
  const useWhen = textFor(item.useWhen, language);
  const guidance = listFor(item.guidance, language);
  const pitfalls = listFor(item.pitfalls, language);
  const tags = [
    localizeLabel(item.category, language, styleLibrary),
    ...(item.styles || []).map((style) => localizeLabel(style, language, styleLibrary)),
    ...(item.scenes || []).map((scene) => localizeLabel(scene, language, styleLibrary)),
    ...(item.tags || []).map((tag) => localizeTemplateTag(tag, language, styleLibrary))
  ].filter(Boolean);
  const uniqueTags = [...new Set(tags)];

  if (language === 'zh') {
    return [
      `範本：${title}`,
      `適用情境：${useWhen || description}`,
      `視覺方向：${uniqueTags.join(' / ')}`,
      '',
      '請依下列結構撰寫可直接用於 GPT Image 2 的影像提示詞：',
      '- 主體：[要產生的產品、人物、空間、介面或資訊主題]',
      '- 情境：[使用環境、敘事背景、受眾脈絡]',
      '- 構圖：[畫面比例、鏡頭距離、主體位置、層級關係]',
      '- 風格：[材質、光線、色彩、時代感、品牌調性]',
      '- 文字：[必須正確顯示的標題、標籤、按鈕或說明文字]',
      '- 細節：[關鍵裝飾、輔助元素、資訊標註、互動層]',
      '- 輸出：[影像品質、比例、完成度及可讀性要求]',
      '',
      '核心限制：',
      ...guidance.map((line) => `- ${line}`),
      '',
      '避免事項：',
      ...pitfalls.map((line) => `- ${line}`)
    ].join('\n');
  }

  return [
    `Template: ${title}`,
    `Use case: ${useWhen || description}`,
    `Visual direction: ${uniqueTags.join(' / ')}`,
    '',
    'Create a copy-ready GPT Image 2 prompt with this structure:',
    '- Subject: [product, person, space, interface, or information topic]',
    '- Scene: [context, audience, narrative setting]',
    '- Composition: [aspect ratio, camera distance, focal hierarchy, placement]',
    '- Style: [material, lighting, color, era, brand tone]',
    '- Text: [exact title, labels, buttons, or annotations that must be readable]',
    '- Details: [decorative elements, callouts, UI layers, supporting objects]',
    '- Output: [resolution, aspect ratio, polish level, readability requirements]',
    '',
    'Core constraints:',
    ...guidance.map((line) => `- ${line}`),
    '',
    'Avoid:',
    ...pitfalls.map((line) => `- ${line}`)
  ].join('\n');
}

function Hero({ latestCases, language, repoUrl, totalCases, categoryCount, onOpenCase }) {
  const t = copy[language];

  return (
    <section className="hero">
      <div className="heroGlow heroGlowA" />
      <div className="heroGlow heroGlowB" />
      <div className="scanGrid" />
      <div className="heroCopy">
        <div className="eyebrow">
          <Sparkles size={16} />
          {t.eyebrow}
        </div>
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
        <div className="heroActions">
          <a className="primaryAction" href="#gallery">
            {t.explore}
            <ArrowUpRight size={18} />
          </a>
          <a className="secondaryAction" href={repoUrl} target="_blank" rel="noreferrer">
            <Github size={18} />
            {t.githubProject}
          </a>
        </div>
        <div className="metrics">
          <span><strong>{totalCases}</strong> {t.cases}</span>
          <span><strong>{categoryCount}</strong> {t.categories}</span>
          <span><strong>20+</strong> {t.templates}</span>
        </div>
      </div>
      <div className="heroDeck" aria-label={t.latestCases}>
        {latestCases.slice(0, 5).map((caseItem, index) => (
          <button
            className={`heroCard heroCard${index + 1}`}
            type="button"
            aria-label={`${language === 'zh' ? '查看案例' : 'Open case'} ${caseItem.id}: ${caseItem.title}`}
            onClick={() => onOpenCase(caseItem)}
            key={caseItem.id}
          >
            <img src={caseItem.image} alt={caseItem.imageAlt} />
            <span>{language === 'zh' ? '案例' : 'Case'} {caseItem.id}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function FilterPill({ active, children, onClick }) {
  return (
    <button className={cx('filterPill', active && 'active')} type="button" onClick={onClick}>
      {children}
    </button>
  );
}

function useDropdownDismiss(open, setOpen) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    function handlePointerDown(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, setOpen]);

  return ref;
}

function LanguageSwitch({ language, setLanguage }) {
  const [open, setOpen] = useState(false);
  const ref = useDropdownDismiss(open, setOpen);
  const languageOptions = [
    { value: 'en', label: 'English', short: 'EN' },
    { value: 'zh', label: '繁體中文（台灣）', short: '繁中' }
  ];
  const activeLanguage = languageOptions.find((option) => option.value === language) || languageOptions[1];

  return (
    <div className="dropdownControl languageSwitch" ref={ref}>
      <button
        className={cx('dropdownTrigger', open && 'open')}
        type="button"
        aria-label={language === 'zh' ? '選擇語言' : 'Language'}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span>{activeLanguage.short}</span>
        <ChevronDown size={15} />
      </button>
      {open ? (
        <div className="dropdownMenu languageMenu" role="menu">
          {languageOptions.map((option) => (
            <button
              className={cx(option.value === language && 'active')}
              type="button"
              role="menuitemradio"
              aria-checked={option.value === language}
              onClick={() => {
                setLanguage(option.value);
                setOpen(false);
              }}
              key={option.value}
            >
              <span>{option.label}</span>
              <strong>{option.short}</strong>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function DiscordNavItem({ language }) {
  const t = copy[language];
  return (
    <a className="discordNavLink" href={discordUrl} target="_blank" rel="noreferrer" aria-label={t.navDiscord}>
      <MessageCircle size={17} />
      {t.navDiscord}
    </a>
  );
}

function LegacyCommunityRedirect({ language }) {
  useEffect(() => {
    window.location.replace(discordUrl);
  }, []);

  return (
    <main className="legacyRedirect">
      <MessageCircle size={28} />
      <p>{language === 'zh' ? '正在開啟 Discord 社群…' : 'Opening the Discord community…'}</p>
      <a href={discordUrl} target="_blank" rel="noreferrer">{language === 'zh' ? '手動開啟 Discord' : 'Open Discord'}</a>
    </main>
  );
}

function authErrorMessage(error, language) {
  const t = copy[language];
  const message = String(error?.message || error || '').trim();
  const normalized = message.toLowerCase();

  if (error?.status === 429 || normalized.includes('rate limit') || normalized.includes('too many')) {
    return t.authRateLimited;
  }

  if (normalized.includes('provider') || normalized.includes('oauth')) {
    return t.googleNotConfigured;
  }

  return message || t.authError;
}

function authRedirectErrorMessage(code, language) {
  const t = copy[language];
  if (code === 'watcha_not_configured') return t.watchaNotConfigured;
  if (code === 'supabase_not_configured') return t.authNotConfigured;
  if (code === 'watcha_state_failed') return t.watchaSessionExpired;
  if (code === 'watcha_denied') return t.watchaDenied;
  if (code === 'watcha_login_failed') return t.watchaLoginFailed;
  return t.authError;
}

function GoogleIcon() {
  return (
    <svg className="googleIcon" viewBox="0 0 18 18" aria-hidden="true" focusable="false">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.71v2.25h2.91c1.7-1.57 2.69-3.89 2.69-6.6z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.25c-.8.54-1.83.86-3.05.86-2.35 0-4.34-1.58-5.05-3.71H.94v2.33A9 9 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.95 10.72A5.41 5.41 0 0 1 3.67 9c0-.6.1-1.18.28-1.72V4.95H.94A9 9 0 0 0 0 9c0 1.45.34 2.82.94 4.05l3.01-2.33z" />
      <path fill="#EA4335" d="M9 3.57c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .94 4.95l3.01 2.33C4.66 5.15 6.65 3.57 9 3.57z" />
    </svg>
  );
}

function WatchaIcon() {
  return <img className="watchaIcon" src={watchaLogoUrl} alt="" aria-hidden="true" loading="lazy" />;
}

function AuthModal({ open, language, initialErrorCode, onClose }) {
  const t = copy[language];
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;
    if (initialErrorCode) {
      setStatus('error');
      setMessage(authRedirectErrorMessage(initialErrorCode, language));
      return;
    }
    setStatus('idle');
    setMessage('');
  }, [open, initialErrorCode, language]);

  if (!open) return null;

  const redirectTo = `${window.location.origin}${window.location.pathname}`;
  const isLoading = status === 'loading-google' || status === 'loading-watcha';

  async function handleGoogleSignIn() {
    if (!isSupabaseConfigured || !supabase) {
      setStatus('error');
      setMessage(t.authNotConfigured);
      return;
    }

    setStatus('loading-google');
    setMessage('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo
      }
    });

    if (error) {
      setStatus('error');
      setMessage(authErrorMessage(error, language));
    }
  }

  function handleWatchaSignIn() {
    if (!isSupabaseConfigured || !supabase) {
      setStatus('error');
      setMessage(t.authNotConfigured);
      return;
    }

    setStatus('loading-watcha');
    setMessage('');
    window.location.assign(`/api/auth/watcha/start?returnTo=${encodeURIComponent(redirectTo)}`);
  }

  return (
    <div
      className="previewOverlay authOverlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="authDialog" role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <button className="previewClose" type="button" onClick={onClose} aria-label={t.closePreview}>
          <X size={20} />
        </button>
        <div className="authIcon">
          <UserCircle size={28} />
        </div>
        <h2 id="auth-title">{t.signInTitle}</h2>
        <p>{t.signInSubtitle}</p>
        <div className="authProviders" aria-label={t.signInTitle}>
          <button className="googleButton" type="button" onClick={handleGoogleSignIn} disabled={isLoading}>
            {status === 'loading-google' ? <LoaderCircle className="spinIcon" size={18} /> : <GoogleIcon />}
            {t.continueWithGoogle}
          </button>
          <button className="watchaButton" type="button" onClick={handleWatchaSignIn} disabled={isLoading}>
            {status === 'loading-watcha' ? <LoaderCircle className="spinIcon" size={18} /> : <WatchaIcon />}
            {t.continueWithWatcha}
          </button>
        </div>
        {message ? (
          <p className={cx('authMessage', status === 'error' && 'error', status === 'sent' && 'sent')}>
            {message}
          </p>
        ) : null}
      </section>
    </div>
  );
}

function UserMenu({ language, session, profile, onSignIn, onSignOut, onAdmin, onBilling, onAccount, onFavorites }) {
  const t = copy[language];
  const [open, setOpen] = useState(false);
  const ref = useDropdownDismiss(open, setOpen);

  if (!session) {
    return (
      <button className="accountButton" type="button" onClick={onSignIn}>
        <LogIn size={17} />
        <span>{t.signIn}</span>
      </button>
    );
  }

  const email = profile?.email || session.user?.email || t.account;
  const displayName = profile?.fullName || session.user?.user_metadata?.name || email;
  const avatarUrl = profile?.avatarUrl || session.user?.user_metadata?.avatar_url || session.user?.user_metadata?.picture || '';
  const totalSpent = Number(profile?.usage?.totalGenerationCredits || 0);

  return (
    <div className="dropdownControl userMenu" ref={ref}>
      <button
        className={cx('userTrigger', open && 'open')}
        type="button"
        aria-label={t.account}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="avatarBadge">
          {avatarUrl ? <img src={avatarUrl} alt="" /> : <UserCircle size={18} />}
        </span>
        <ChevronDown size={15} />
      </button>
      {open ? (
        <div className="dropdownMenu userDropdown" role="menu">
          <div className="userSummary">
            {avatarUrl ? <img className="userSummaryAvatar" src={avatarUrl} alt="" /> : <UserCircle size={32} />}
            <div>
              <strong>{displayName}</strong>
              <span>{email}</span>
            </div>
          </div>
          <div className="userStats">
            {profile?.isSuperAdmin ? (
              <span className="userStat admin">
                <ShieldCheck size={15} />
                {t.superAdmin}
              </span>
            ) : null}
            <span className="userStat">
              <Coins size={15} />
              {profile?.creditBalance || 0} {t.credits}
            </span>
            <span className="userStat">
              <Crown size={15} />
              {formatMembershipStatus(profile?.membership, language)}
            </span>
            <span className="userStat">
              <ReceiptText size={15} />
              {t.totalGenerationCredits}: {totalSpent}
            </span>
          </div>
          <div className="dropdownDivider" />
          <button
            className="dropdownAction"
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onAccount();
            }}
          >
            <Settings size={17} />
            {t.accountSettings}
          </button>
          <button
            className="dropdownAction"
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onFavorites();
            }}
          >
            <Heart size={17} />
            {t.myFavorites}
          </button>
          <button
            className="dropdownAction"
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onBilling();
            }}
          >
            <CreditCard size={17} />
            {t.membershipCenter}
          </button>
          {profile?.isSuperAdmin ? (
            <button
              className="dropdownAction"
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onAdmin();
              }}
            >
              <ShieldCheck size={17} />
              {t.adminPanel}
            </button>
          ) : null}
          <button
            className="dropdownAction danger"
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onSignOut();
            }}
          >
            <LogOut size={17} />
            {t.signOut}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function AccountPanel({
  open,
  language,
  session,
  profile,
  casesById,
  favoriteRows,
  initialSection,
  onClose,
  onBilling,
  onProfileChange,
  onOpenCase
}) {
  const t = copy[language];
  const [fullName, setFullName] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const favoritesRef = useRef(null);
  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;
    setFullName(profile?.fullName || session?.user?.user_metadata?.name || '');
    setStatus('idle');
    setMessage('');
  }, [open, profile?.fullName, session?.user?.user_metadata?.name]);

  useEffect(() => {
    if (!open || initialSection !== 'favorites') return;
    const frame = window.requestAnimationFrame(() => {
      favoritesRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [open, initialSection, favoriteRows]);

  if (!open) return null;

  const email = profile?.email || session?.user?.email || '';
  const avatarUrl = profile?.avatarUrl || session?.user?.user_metadata?.avatar_url || session?.user?.user_metadata?.picture || '';
  const usage = profile?.usage || {};
  const recentTransactions = profile?.recentTransactions || [];
  const generationTransactions = recentTransactions.filter((transaction) => transaction.type === 'generation');
  const favoriteCases = normalizeFavoriteRows(favoriteRows)
    .map((favorite) => ({
      ...favorite,
      caseItem: casesById?.get(favorite.caseId)
    }))
    .filter((favorite) => favorite.caseItem);

  async function handleSubmit(event) {
    event.preventDefault();
    const nextName = fullName.trim();
    if (!nextName) {
      setStatus('error');
      setMessage(t.profileUpdateFailed);
      return;
    }

    setStatus('loading');
    setMessage('');
    try {
      const response = await fetch('/api/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(session)
        },
        body: JSON.stringify({ fullName: nextName })
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || 'PROFILE_UPDATE_FAILED');
      }
      if (payload.user) onProfileChange(payload.user);
      setStatus('success');
      setMessage(t.profileSaved);
    } catch {
      setStatus('error');
      setMessage(t.profileUpdateFailed);
    }
  }

  return (
    <div
      className="previewOverlay accountOverlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="accountDialog" role="dialog" aria-modal="true" aria-labelledby="account-title">
        <button className="previewClose" type="button" onClick={onClose} aria-label={t.closePreview}>
          <X size={20} />
        </button>
        <div className="accountHeader">
          <div className="accountAvatar">
            {avatarUrl ? <img src={avatarUrl} alt="" /> : <UserCircle size={44} />}
          </div>
          <div>
            <span className="eyebrow">
              <Settings size={16} />
              {t.accountSettings}
            </span>
            <h2 id="account-title">{t.accountTitle}</h2>
            <p>{t.accountSubtitle}</p>
          </div>
        </div>

        <div className="accountGrid">
          <form className="accountForm" onSubmit={handleSubmit}>
            <label>
              <span>{t.displayName}</span>
              <input
                value={fullName}
                maxLength={80}
                onChange={(event) => setFullName(event.target.value)}
              />
            </label>
            <div className="accountEmail">
              <span>{t.account}</span>
              <strong>{email}</strong>
              <em>{t.googleAvatarSource}</em>
            </div>
            <button type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? <LoaderCircle className="spinIcon" size={16} /> : <Check size={16} />}
              {t.saveProfile}
            </button>
            {message ? (
              <p className={cx('authMessage', status === 'error' && 'error', status === 'success' && 'sent')}>
                {message}
              </p>
            ) : null}
          </form>

          <section className="accountOverview">
            <h3>{t.accountOverview}</h3>
            <div className="accountMetrics">
              <div>
                <span>{t.creditBalance}</span>
                <strong>{profile?.creditBalance || 0}</strong>
              </div>
              <div>
                <span>{t.currentPlan}</span>
                <strong>{formatMembershipStatus(profile?.membership, language)}</strong>
              </div>
              <div>
                <span>{t.totalGenerations}</span>
                <strong>{Number(usage.totalGenerations || 0)}</strong>
              </div>
              <div>
                <span>{t.totalGenerationCredits}</span>
                <strong>{Number(usage.totalGenerationCredits || 0)}</strong>
              </div>
            </div>
            <button className="portalButton accountBillingButton" type="button" onClick={onBilling}>
              <CreditCard size={16} />
              {t.membershipCenter}
            </button>
          </section>
        </div>

        <section className="transactionSection favoritesSection" ref={favoritesRef}>
          <h3>
            <Heart size={18} />
            {t.myFavorites}
          </h3>
          {favoriteCases.length ? (
            <div className="favoriteGrid">
              {favoriteCases.map(({ caseId, createdAt, caseItem }) => (
                <button
                  className="favoriteCard"
                  type="button"
                  onClick={() => onOpenCase?.(caseItem)}
                  key={caseId}
                >
                  <img src={caseItem.image} alt={caseItem.imageAlt} />
                  <span>#{caseId}</span>
                  <strong>{caseItem.title}</strong>
                  <em>
                    {createdAt
                      ? new Date(createdAt).toLocaleDateString(language === 'zh' ? 'zh-TW' : 'en-US')
                      : localizeLabel(caseItem.category, language, null)}
                  </em>
                </button>
              ))}
            </div>
          ) : (
            <p className="emptyTransactions">{t.noFavorites}</p>
          )}
        </section>

        <section className="transactionSection accountTransactions">
          <h3>
            <ReceiptText size={18} />
            {t.generationUsage}
          </h3>
          {generationTransactions.length ? (
            <div className="transactionList">
              {generationTransactions.map((transaction) => (
                <TransactionItem
                  transaction={transaction}
                  language={language}
                  casesById={casesById}
                  onOpenCase={onOpenCase}
                  key={transaction.id}
                />
              ))}
            </div>
          ) : (
            <p className="emptyTransactions">{t.noGenerationTransactions}</p>
          )}
        </section>
      </section>
    </div>
  );
}

function AdminMetricCard({ icon, label, value, hint }) {
  return (
    <div className="adminMetricCard">
      <span className="adminMetricIcon">{icon}</span>
      <div>
        <span>{label}</span>
        <strong>{formatNumber(value)}</strong>
        {hint ? <em>{hint}</em> : null}
      </div>
    </div>
  );
}

function AdminTrendChart({ rows = [], series = [], language, emptyLabel }) {
  const chartRef = useRef(null);
  const [hoverIndex, setHoverIndex] = useState(null);
  const width = 720;
  const height = 260;
  const padding = { top: 24, right: 24, bottom: 38, left: 54 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const maxValue = Math.max(
    1,
    ...rows.flatMap((row) => series.map((item) => Number(row[item.key] || 0)))
  );

  function pointFor(row, index, key) {
    const x = padding.left + (rows.length <= 1 ? chartWidth / 2 : (index / (rows.length - 1)) * chartWidth);
    const y = padding.top + chartHeight - (Number(row[key] || 0) / maxValue) * chartHeight;
    return { x, y };
  }

  function linePath(points) {
    return points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(' ');
  }

  function areaPath(points) {
    if (!points.length) return '';
    const bottom = padding.top + chartHeight;
    const lastPoint = points[points.length - 1];
    return `${linePath(points)} L ${lastPoint.x.toFixed(2)} ${bottom} L ${points[0].x.toFixed(2)} ${bottom} Z`;
  }

  function handlePointerMove(event) {
    if (!chartRef.current || !rows.length) return;
    const clientX = event.touches?.[0]?.clientX ?? event.clientX;
    const rect = chartRef.current.getBoundingClientRect();
    const relativeX = ((clientX - rect.left) / rect.width) * width;
    const ratio = Math.min(1, Math.max(0, (relativeX - padding.left) / chartWidth));
    setHoverIndex(Math.round(ratio * (rows.length - 1)));
  }

  if (!rows.length) {
    return <p className="emptyTransactions">{emptyLabel}</p>;
  }

  const gridLines = [0, 0.25, 0.5, 0.75, 1];
  const xLabelIndexes = rows.length <= 8
    ? rows.map((_, index) => index)
    : [0, Math.round((rows.length - 1) / 2), rows.length - 1];
  const activeIndex = hoverIndex ?? rows.length - 1;
  const activeRow = rows[activeIndex];
  const activeX = pointFor(activeRow, activeIndex, series[0]?.key).x;
  const tooltipX = Math.min(activeX + 12, width - 178);

  return (
    <div className="adminTrendChart">
      <div className="adminChartLegend">
        {series.map((item) => (
          <span key={item.key}>
            <i style={{ background: item.color }} />
            {item.label}
          </span>
        ))}
      </div>
      <svg
        ref={chartRef}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={series.map((item) => item.label).join(', ')}
        onMouseMove={handlePointerMove}
        onMouseLeave={() => setHoverIndex(null)}
        onTouchMove={handlePointerMove}
        onTouchEnd={() => setHoverIndex(null)}
      >
        <defs>
          {series.filter((item) => item.area).map((item) => (
            <linearGradient id={`area-${item.key}`} key={item.key} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={item.color} stopOpacity="0.38" />
              <stop offset="100%" stopColor={item.color} stopOpacity="0.02" />
            </linearGradient>
          ))}
        </defs>
        {gridLines.map((line) => {
          const y = padding.top + chartHeight * line;
          return (
            <g key={line}>
              <line x1={padding.left} x2={width - padding.right} y1={y} y2={y} />
              <text x={padding.left - 10} y={y + 4} textAnchor="end">
                {formatNumber(Math.round(maxValue * (1 - line)))}
              </text>
            </g>
          );
        })}
        {xLabelIndexes.map((index) => {
          const point = pointFor(rows[index], index, series[0]?.key);
          return (
            <text className="adminChartDate" key={`${rows[index].date}-${index}`} x={point.x} y={height - 10} textAnchor="middle">
              {formatShortDate(rows[index].date, language)}
            </text>
          );
        })}
        {series.map((item) => {
          const points = rows.map((row, index) => pointFor(row, index, item.key));
          return (
            <g key={item.key}>
              {item.area ? <path className="adminChartArea" d={areaPath(points)} fill={`url(#area-${item.key})`} /> : null}
              <path
                className="adminChartLine"
                d={linePath(points)}
                stroke={item.color}
                strokeDasharray={item.dashed ? '8 7' : undefined}
              />
            </g>
          );
        })}
        {activeRow ? (
          <g className="adminChartActive">
            <line x1={activeX} x2={activeX} y1={padding.top} y2={padding.top + chartHeight} />
            {series.map((item) => {
              const point = pointFor(activeRow, activeIndex, item.key);
              return <circle key={item.key} cx={point.x} cy={point.y} r="4.5" fill={item.color} />;
            })}
            <g className="adminChartTooltip" transform={`translate(${tooltipX} 34)`}>
              <rect width="164" height={38 + series.length * 18} rx="8" />
              <text x="12" y="22">{formatRangeDate(activeRow.date, language)}</text>
              {series.map((item, index) => (
                <text key={item.key} x="12" y={44 + index * 18}>
                  {item.label}: {formatNumber(activeRow[item.key])}
                </text>
              ))}
            </g>
          </g>
        ) : null}
      </svg>
    </div>
  );
}

function AdminRankList({ rows, type, language }) {
  const t = copy[language];
  if (!rows?.length) return <p className="emptyTransactions">{t.noAnalyticsRows}</p>;

  return (
    <div className="adminRankList">
      {rows.map((row, index) => {
        const title = row.page || row.channel || row.country || '-';
        const mainValue = row.pageViews ?? row.sessions ?? row.activeUsers ?? 0;
        const subValue = row.activeUsers ?? row.pageViews ?? 0;
        return (
          <div className="adminRankItem" key={`${type}-${title}-${index}`}>
            <span>{index + 1}</span>
            <div>
              <strong title={title}>{title}</strong>
              <em>{type === 'channels' ? t.sessions : t.uv}: {formatNumber(subValue)}</em>
            </div>
            <b>{formatNumber(mainValue)}</b>
          </div>
        );
      })}
    </div>
  );
}

function AdminPanel({ open, language, session, casesById, onClose, onOpenCase }) {
  const t = copy[language];
  const [users, setUsers] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [range, setRange] = useState('7d');
  const [customStart, setCustomStart] = useState(() => dateInputValue(29));
  const [customEnd, setCustomEnd] = useState(() => dateInputValue());
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [adjustment, setAdjustment] = useState(null);
  const [adjustStatus, setAdjustStatus] = useState('idle');
  useBodyScrollLock(open);

  async function loadAdminData(nextRange = range, nextStart = customStart, nextEnd = customEnd) {
    if (!session?.access_token) {
      setStatus('error');
      setMessage(t.adminOnly);
      return;
    }

    setStatus('loading');
    setMessage('');
    try {
      const headers = getAuthHeaders(session);
      const params = new URLSearchParams({ range: nextRange });
      if (nextRange === 'custom') {
        params.set('start', nextStart);
        params.set('end', nextEnd);
      }
      const [usersResponse, metricsResponse] = await Promise.all([
        fetch('/api/admin/users', { headers }),
        fetch(`/api/admin/metrics?${params.toString()}`, { headers })
      ]);
      const usersPayload = await usersResponse.json().catch(() => ({}));
      const metricsPayload = await metricsResponse.json().catch(() => ({}));
      if (!usersResponse.ok || !usersPayload.ok) {
        throw new Error(usersPayload.error || 'SERVER_NOT_CONFIGURED');
      }
      if (!metricsResponse.ok || !metricsPayload.ok) {
        throw new Error(metricsPayload.error || 'SERVER_NOT_CONFIGURED');
      }
      setUsers(usersPayload.users || []);
      setMetrics(metricsPayload);
      setStatus('ready');
    } catch (error) {
      setStatus('error');
      setMessage(
        error.message === 'SERVER_NOT_CONFIGURED'
          ? t.checkoutUnavailable
          : error.message === 'INVALID_DATE_RANGE'
            ? t.invalidDateRange
            : generationErrorMessage(error.message, language)
      );
    }
  }

  function handleCustomApply() {
    if (range !== 'custom') {
      setRange('custom');
      return;
    }
    loadAdminData('custom', customStart, customEnd);
  }

  async function handleAdjustCredits(event) {
    event.preventDefault();
    if (!adjustment?.userId) return;
    setAdjustStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/admin/credits/adjust', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(session)
        },
        body: JSON.stringify({
          userId: adjustment.userId,
          amount: Number(adjustment.amount),
          reason: adjustment.reason
        })
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || 'CREDIT_ADJUSTMENT_FAILED');
      }
      setAdjustment(null);
      setAdjustStatus('idle');
      await loadAdminData();
    } catch (error) {
      setAdjustStatus('error');
      setMessage(generationErrorMessage(error.message, language));
    }
  }

  useEffect(() => {
    if (open) loadAdminData(range);
  }, [open, session?.access_token, range]);

  if (!open) return null;
  const traffic = metrics?.traffic || {};
  const business = metrics?.business || {};
  const trafficTotals = traffic.totals || {};
  const businessTotals = business.totals || {};
  const businessRange = business.range || {};
  const selectedRange = metrics?.range;
  const selectedRangeLabel = selectedRange?.startDate && selectedRange?.endDate
    ? `${formatRangeDate(selectedRange.startDate, language)} - ${formatRangeDate(selectedRange.endDate, language)}`
    : '';
  const analyticsMessage = !traffic.configured
    ? t.analyticsNotConfigured
    : traffic.error
      ? t.analyticsLoadFailed
      : '';
  const trafficSeries = [
    { key: 'pv', label: t.pv, color: '#42e6ff', area: true },
    { key: 'uv', label: t.uv, color: '#c7ff65' },
    { key: 'visits', label: t.visits, color: '#ff8f70', dashed: true }
  ];
  const businessSeries = [
    { key: 'generations', label: t.rangeGenerations, color: '#42e6ff', area: true },
    { key: 'registrations', label: t.registrations, color: '#c7ff65' },
    { key: 'creditsConsumed', label: t.creditsConsumed, color: '#ff8f70', dashed: true }
  ];

  return (
    <div
      className="previewOverlay adminOverlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="adminDialog" role="dialog" aria-modal="true" aria-labelledby="admin-title">
        <button className="previewClose" type="button" onClick={onClose} aria-label={t.closePreview}>
          <X size={20} />
        </button>
        <div className="adminHeader">
          <div>
            <span className="eyebrow">
              <ShieldCheck size={16} />
              {t.superAdmin}
            </span>
            <h2 id="admin-title">{t.adminTitle}</h2>
            <p>{t.adminSubtitle}</p>
          </div>
          <div className="adminHeaderActions">
            <div className="adminRangeToggle" role="group" aria-label={t.adminMetrics}>
              {[
                ['today', t.rangeToday],
                ['7d', t.range7d],
                ['30d', t.range30d],
                ['90d', t.range90d],
                ['custom', t.customRange]
              ].map(([value, label]) => (
                <button
                  className={cx(range === value && 'active')}
                  type="button"
                  onClick={() => setRange(value)}
                  key={value}
                >
                  {label}
                </button>
              ))}
            </div>
            {range === 'custom' ? (
              <div className="adminCustomRange">
                <label>
                  <span>{t.startDate}</span>
                  <input type="date" value={customStart} onChange={(event) => setCustomStart(event.target.value)} />
                </label>
                <label>
                  <span>{t.endDate}</span>
                  <input type="date" value={customEnd} onChange={(event) => setCustomEnd(event.target.value)} />
                </label>
                <button type="button" onClick={handleCustomApply} disabled={status === 'loading'}>
                  {t.applyRange}
                </button>
              </div>
            ) : null}
            <button type="button" onClick={() => loadAdminData()} disabled={status === 'loading'}>
              {status === 'loading' ? <LoaderCircle className="spinIcon" size={17} /> : <RefreshCw size={17} />}
              {t.refresh}
            </button>
          </div>
        </div>

        {metrics ? (
          <div className="adminDashboard">
            <section className="adminBlock">
              <h3>
                <TrendingUp size={18} />
                {t.trafficMetrics}
              </h3>
              {analyticsMessage ? <p className="adminNotice">{analyticsMessage}</p> : null}
              {selectedRangeLabel ? (
                <p className="adminRangeSummary">
                  {t.selectedRange}: <strong>{selectedRangeLabel}</strong>
                </p>
              ) : null}
              <div className="adminMetricGrid">
                <AdminMetricCard icon={<BarChart3 size={18} />} label={t.pv} value={firstNumber(trafficTotals.pv, trafficTotals.pageViews)} />
                <AdminMetricCard icon={<Users size={18} />} label={t.uv} value={firstNumber(trafficTotals.uv, trafficTotals.activeUsers)} />
                <AdminMetricCard icon={<ReceiptText size={18} />} label={t.visits} value={firstNumber(trafficTotals.visits, trafficTotals.sessions)} />
                <AdminMetricCard icon={<UserPlus size={18} />} label={t.newUsers} value={trafficTotals.newUsers} />
              </div>
              <div className="adminChartGrid">
                <div className="adminPanelCard chart">
                  <h4>{t.trafficTrend}</h4>
                  {traffic.configured && traffic.daily?.length ? (
                    <AdminTrendChart rows={traffic.daily} series={trafficSeries} language={language} emptyLabel={t.noAnalyticsRows} />
                  ) : (
                    <p className="emptyTransactions">{t.noAnalyticsRows}</p>
                  )}
                </div>
              </div>
              <div className="adminTrafficGrid">
                <div className="adminPanelCard">
                  <h4>{t.topPages}</h4>
                  <AdminRankList rows={traffic.topPages || []} type="pages" language={language} />
                </div>
                <div className="adminPanelCard">
                  <h4>{t.channels}</h4>
                  <AdminRankList rows={traffic.channels || []} type="channels" language={language} />
                </div>
                <div className="adminPanelCard">
                  <h4>{t.countries}</h4>
                  <AdminRankList rows={traffic.countries || []} type="countries" language={language} />
                </div>
              </div>
            </section>

            <section className="adminBlock">
              <h3>
                <ShieldCheck size={18} />
                {t.businessMetrics}
              </h3>
              <div className="adminMetricGrid">
                <AdminMetricCard icon={<Users size={18} />} label={t.registeredUsers} value={firstNumber(businessTotals.registeredUsers, business.totalUsers)} hint={`${t.newRegistrations}: ${formatNumber(firstNumber(businessRange.newRegistrations, business.rangeUsers))}`} />
                <AdminMetricCard icon={<Crown size={18} />} label={t.activeMemberships} value={firstNumber(businessTotals.activeMembers, business.activeMemberships)} hint={`${t.newMembers}: ${formatNumber(firstNumber(businessRange.newMembers, business.rangeMemberships))}`} />
                <AdminMetricCard icon={<ImageIcon size={18} />} label={t.totalGenerationsMetric} value={firstNumber(businessTotals.totalGenerations, business.totalGenerations)} hint={`${t.rangeGenerations}: ${formatNumber(firstNumber(businessRange.generations, business.rangeGenerations))}`} />
                <AdminMetricCard icon={<PackageCheck size={18} />} label={t.succeeded} value={firstNumber(businessTotals.succeededGenerations, business.succeededGenerations)} hint={`${t.rangeGenerations}: ${formatNumber(firstNumber(businessRange.succeededGenerations, business.rangeSucceededGenerations))}`} />
                <AdminMetricCard icon={<Coins size={18} />} label={t.creditsConsumed} value={firstNumber(businessTotals.totalCreditsConsumed, business.totalGenerationCredits)} hint={`${t.rangeGenerations}: ${formatNumber(firstNumber(businessRange.creditsConsumed, business.rangeGenerationCredits))}`} />
                <AdminMetricCard icon={<X size={18} />} label={t.failed} value={firstNumber(businessTotals.failedGenerations, business.failedGenerations)} />
                <AdminMetricCard icon={<LoaderCircle size={18} />} label={t.pending} value={firstNumber(businessTotals.pendingGenerations, business.pendingGenerations)} />
                <AdminMetricCard icon={<Coins size={18} />} label={t.creditsInCirculation} value={firstNumber(businessTotals.totalCreditBalance, business.totalCreditBalance)} />
                <AdminMetricCard icon={<CreditCard size={18} />} label={t.purchasedCredits} value={firstNumber(businessTotals.purchasedCredits, business.purchasedCredits)} />
                <AdminMetricCard icon={<Crown size={18} />} label={t.membershipCredits} value={firstNumber(businessTotals.membershipCredits, business.membershipCredits)} />
              </div>
              <div className="adminChartGrid">
                <div className="adminPanelCard chart">
                  <h4>{t.businessTrend}</h4>
                  {business.daily?.length ? (
                    <AdminTrendChart rows={business.daily} series={businessSeries} language={language} emptyLabel={t.noAnalyticsRows} />
                  ) : (
                    <p className="emptyTransactions">{t.noAnalyticsRows}</p>
                  )}
                </div>
              </div>
            </section>
          </div>
        ) : null}

        <div className="adminHeader compact">
          <div>
            <h3>{t.users}</h3>
          </div>
          <button type="button" onClick={() => loadAdminData()} disabled={status === 'loading'}>
            {status === 'loading' ? <LoaderCircle className="spinIcon" size={17} /> : <RefreshCw size={17} />}
            {t.refresh}
          </button>
        </div>
        {status === 'loading' ? (
          <div className="adminState">
            <LoaderCircle className="spinIcon" size={20} />
            {t.loadingUsers}
          </div>
        ) : null}
        {status === 'error' ? <p className="authMessage error">{message || t.adminOnly}</p> : null}
        {adjustment ? (
          <form className="adminAdjustForm" onSubmit={handleAdjustCredits}>
            <strong>{adjustment.email}</strong>
            <label>
              {t.creditAmount}
              <input
                type="number"
                step="1"
                value={adjustment.amount}
                onChange={(event) => setAdjustment((current) => ({ ...current, amount: event.target.value }))}
              />
            </label>
            <label>
              {t.reason}
              <input
                value={adjustment.reason}
                onChange={(event) => setAdjustment((current) => ({ ...current, reason: event.target.value }))}
              />
            </label>
            <button type="submit" disabled={adjustStatus === 'loading'}>
              {adjustStatus === 'loading' ? <LoaderCircle className="spinIcon" size={16} /> : <Coins size={16} />}
              {t.applyAdjustment}
            </button>
          </form>
        ) : null}
        {adjustStatus === 'error' ? <p className="authMessage error">{message}</p> : null}
        {status !== 'loading' && !users.length && status !== 'error' ? (
          <div className="adminState">
            <Users size={20} />
            {t.noUsers}
          </div>
        ) : null}
        {users.length ? (
          <div className="adminTableWrap">
            <table className="adminTable">
              <thead>
                <tr>
                  <th>{t.users}</th>
                  <th>{t.role}</th>
                  <th>{t.creditBalance}</th>
                  <th>{t.currentPlan}</th>
                  <th>{t.freeGeneration}</th>
                  <th>{t.totalGenerations}</th>
                  <th>{t.spentCredits}</th>
                  <th>{t.purchased}</th>
                  <th>{t.lastGeneration}</th>
                  <th>{t.createdAt}</th>
                  <th>{t.adminAdjust}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="adminUserCell">
                        {user.avatarUrl ? <img src={user.avatarUrl} alt="" /> : <UserCircle size={28} />}
                        <div>
                          <strong>{user.email}</strong>
                          {user.fullName ? <span>{user.fullName}</span> : null}
                        </div>
                      </div>
                    </td>
                    <td><span className="roleBadge">{formatRole(user.role, language)}</span></td>
                    <td>{user.creditBalance}</td>
                    <td>{formatMembershipStatus(user.membership, language)}</td>
                    <td>{user.freeUsed ? t.freeUsedShort : t.freeReady}</td>
                    <td>{formatNumber(user.usage?.totalGenerations)}</td>
                    <td>{formatNumber(user.usage?.totalGenerationCredits)}</td>
                    <td>{formatNumber(user.usage?.purchasedCredits)}</td>
                    <td>
                      {user.usage?.lastGenerationCaseId ? (
                        <button
                          className="tableAction compactAction"
                          type="button"
                          onClick={() => {
                            const caseItem = casesById?.get(user.usage.lastGenerationCaseId);
                            if (caseItem) onOpenCase?.(caseItem);
                          }}
                          disabled={!casesById?.has(user.usage.lastGenerationCaseId)}
                        >
                          <ImageIcon size={14} />
                          #{user.usage.lastGenerationCaseId}
                        </button>
                      ) : '-'}
                    </td>
                    <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString(language === 'zh' ? 'zh-TW' : 'en-US') : '-'}</td>
                    <td>
                      <button
                        className="tableAction"
                        type="button"
                        onClick={() => setAdjustment({
                          userId: user.id,
                          email: user.email,
                          amount: 10,
                          reason: ''
                        })}
                      >
                        <Coins size={15} />
                        {t.adminAdjust}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function BillingPanel({
  open,
  language,
  session,
  profile,
  notice,
  casesById,
  onClose,
  onAuthRequired,
  onProfileChange,
  onOpenCase
}) {
  const t = copy[language];
  const [plans, setPlans] = useState([]);
  const [packs, setPacks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [checkoutAvailable, setCheckoutAvailable] = useState(false);
  const [checkoutProviders, setCheckoutProviders] = useState({ stripe: false, alipay: false });
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [busyProduct, setBusyProduct] = useState('');
  useBodyScrollLock(open);

  async function loadBilling() {
    setStatus('loading');
    setMessage(notice || '');

    try {
      const headers = getAuthHeaders(session);
      const [plansResponse, historyResponse] = await Promise.all([
        fetch('/api/billing/plans', { headers }),
        session?.access_token
          ? fetch('/api/billing/history', { headers })
          : Promise.resolve(null)
      ]);
      const plansPayload = await plansResponse.json().catch(() => ({}));
      if (!plansResponse.ok || !plansPayload.ok) {
        throw new Error(plansPayload.error || 'SERVER_NOT_CONFIGURED');
      }

      setPlans(plansPayload.plans || []);
      setPacks(plansPayload.packs || []);
      setCheckoutAvailable(Boolean(plansPayload.checkoutAvailable));
      setCheckoutProviders({
        stripe: Boolean(plansPayload.checkoutProviders?.stripe),
        alipay: Boolean(plansPayload.checkoutProviders?.alipay)
      });
      if (plansPayload.user) onProfileChange(plansPayload.user);

      if (historyResponse) {
        const historyPayload = await historyResponse.json().catch(() => ({}));
        if (historyResponse.ok && historyPayload.ok) {
          setTransactions(historyPayload.transactions || []);
        }
      } else {
        setTransactions([]);
      }

      setStatus('ready');
    } catch (error) {
      setStatus('error');
      setMessage(generationErrorMessage(error.message, language));
    }
  }

  useEffect(() => {
    if (open) loadBilling();
  }, [open, session?.access_token]);

  useEffect(() => {
    if (open && notice) setMessage(notice);
  }, [notice, open]);

  async function handleCheckout(product, provider = 'stripe') {
    if (!session?.access_token) {
      onAuthRequired();
      return;
    }
    if (!checkoutProviders[provider] || (provider === 'alipay' && !product.alipayAvailable)) {
      setMessage(t.checkoutUnavailable);
      return;
    }

    setBusyProduct(`${provider}:${product.type}:${product.id}`);
    setMessage('');

    try {
      const response = await fetch(
        provider === 'alipay' ? '/api/billing/alipay/checkout' : '/api/billing/checkout',
        {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(session)
        },
        body: JSON.stringify({
          productType: product.type,
          productId: product.id
        })
        }
      );
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || 'CHECKOUT_FAILED');
      }
      if (payload.user) onProfileChange(payload.user);

      if (provider === 'alipay') {
        if (!payload.paymentHtml) throw new Error('ALIPAY_CHECKOUT_FAILED');
        submitAlipayPaymentForm(payload.paymentHtml);
      } else {
        if (!payload.url) throw new Error('CHECKOUT_FAILED');
        window.location.href = payload.url;
      }
    } catch (error) {
      setBusyProduct('');
      setMessage(generationErrorMessage(error.message, language));
    }
  }

  async function handlePortal() {
    if (!session?.access_token) {
      onAuthRequired();
      return;
    }
    setBusyProduct('portal');
    setMessage('');

    try {
      const response = await fetch('/api/billing/portal', {
        method: 'POST',
        headers: getAuthHeaders(session)
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload.ok || !payload.url) {
        throw new Error(payload.error || 'BILLING_PORTAL_FAILED');
      }
      window.location.href = payload.url;
    } catch (error) {
      setBusyProduct('');
      setMessage(generationErrorMessage(error.message, language));
    }
  }

  if (!open) return null;

  const activePlanId = profile?.membership?.isActive ? profile.membership.planId : '';
  const activePlan = plans.find((plan) => plan.id === activePlanId);
  const activePlanName = activePlan ? productText(activePlan.name, language) : activePlanId || t.noPlan;

  return (
    <div
      className="previewOverlay billingOverlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="billingDialog" role="dialog" aria-modal="true" aria-labelledby="billing-title">
        <button className="previewClose" type="button" onClick={onClose} aria-label={t.closePreview}>
          <X size={20} />
        </button>
        <div className="billingHero">
          <span className="eyebrow">
            <CreditCard size={16} />
            {t.membershipCenter}
          </span>
          <h2 id="billing-title">{t.billingTitle}</h2>
          <p>{t.billingSubtitle}</p>
        </div>

        <div className="billingSummary">
          <div>
            <span>{t.balanceTitle}</span>
            <strong>{profile?.creditBalance || 0}</strong>
            <em>{t.credits}</em>
          </div>
          <div>
            <span>{t.currentPlan}</span>
            <strong>{activePlanName}</strong>
            <em>{formatMembershipStatus(profile?.membership, language)}</em>
          </div>
          <div>
            <span>{t.freeGeneration}</span>
            <strong>{profile?.freeUsed ? t.freeUsedShort : t.freeReady}</strong>
            <em>{checkoutAvailable ? t.paymentReady : t.billingNotReady}</em>
          </div>
        </div>

        {!session?.access_token ? (
          <div className="billingState">
            <p>{t.authRequired}</p>
            <button type="button" onClick={onAuthRequired}>
              <LogIn size={17} />
              {t.signIn}
            </button>
          </div>
        ) : null}

        {status === 'loading' ? (
          <div className="billingState">
            <LoaderCircle className="spinIcon" size={20} />
            {t.loadBilling}
          </div>
        ) : null}

        {message ? (
          <p className={cx('authMessage', status === 'error' && 'error')}>{message}</p>
        ) : null}

        <div className="billingSections">
          <section>
            <h3>
              <Crown size={18} />
              {t.membershipPlans}
            </h3>
            <div className="billingCards">
              {plans.map((plan) => {
                const isCurrent = activePlanId === plan.id;
                const busy = busyProduct === `stripe:${plan.type}:${plan.id}`;
                return (
                  <article className={cx('billingCard', isCurrent && 'current')} key={plan.id}>
                    <span>{productText(plan.name, language)}</span>
                    <strong>{plan.priceLabel}<small>/{plan.interval}</small></strong>
                    <p>{productText(plan.description, language)}</p>
                    <div className="billingCredits">{t.monthlyCredits(plan.monthlyCredits)}</div>
                    <button
                      type="button"
                      disabled={busy || isCurrent || !checkoutProviders.stripe}
                      onClick={() => handleCheckout(plan, 'stripe')}
                    >
                      {busy ? <LoaderCircle className="spinIcon" size={16} /> : <Crown size={16} />}
                      {isCurrent ? t.currentPlan : t.subscribe}
                    </button>
                  </article>
                );
              })}
            </div>
            {profile?.membership?.isActive ? (
              <button className="portalButton" type="button" onClick={handlePortal} disabled={busyProduct === 'portal'}>
                {busyProduct === 'portal' ? <LoaderCircle className="spinIcon" size={16} /> : <CreditCard size={16} />}
                {t.manageSubscription}
              </button>
            ) : null}
          </section>

          <section>
            <h3>
              <Coins size={18} />
              {t.creditPacks}
            </h3>
            <div className="billingCards">
              {packs.map((pack) => {
                const stripeBusy = busyProduct === `stripe:${pack.type}:${pack.id}`;
                const alipayBusy = busyProduct === `alipay:${pack.type}:${pack.id}`;
                const busy = stripeBusy || alipayBusy;
                return (
                  <article className="billingCard" key={pack.id}>
                    <span>{productText(pack.name, language)}</span>
                    <strong>{pack.priceLabel}</strong>
                    <p>{productText(pack.description, language)}</p>
                    <div className="billingCredits">{t.packCredits(pack.credits)}</div>
                    <div className="billingPaymentActions">
                      <button
                        type="button"
                        disabled={busy || !checkoutProviders.stripe}
                        onClick={() => handleCheckout(pack, 'stripe')}
                      >
                        {stripeBusy ? <LoaderCircle className="spinIcon" size={16} /> : <CreditCard size={16} />}
                        {t.payWithStripe}
                      </button>
                      <button
                        className="alipayButton"
                        type="button"
                        disabled={busy || !checkoutProviders.alipay || !pack.alipayAvailable}
                        onClick={() => handleCheckout(pack, 'alipay')}
                      >
                        {alipayBusy ? <LoaderCircle className="spinIcon" size={16} /> : <Coins size={16} />}
                        {pack.alipayAvailable
                          ? `${t.payWithAlipay} · ${pack.alipayPriceLabel}`
                          : t.alipayPriceMissing}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>

        <section className="transactionSection">
          <h3>
            <ReceiptText size={18} />
            {t.transactionHistory}
          </h3>
          {transactions.length ? (
            <div className="transactionList">
              {transactions.map((transaction) => (
                <TransactionItem
                  transaction={transaction}
                  language={language}
                  casesById={casesById}
                  onOpenCase={onOpenCase}
                  key={transaction.id}
                />
              ))}
            </div>
          ) : (
            <p className="emptyTransactions">{t.noTransactions}</p>
          )}
        </section>
      </section>
    </div>
  );
}

function SkillSection({ language, repoUrl }) {
  const t = copy[language];
  const [commandCopied, setCommandCopied] = useState(false);
  const installCommand =
    'codex plugin marketplace add irons163/awesome-gpt-image-2-zh\ncodex plugin add awesome-gpt-image-2-zh@awesome-gpt-image-2-zh';
  const skillSourceUrl = `${repoUrl}/tree/main/plugins/awesome-gpt-image-2-zh`;

  async function handleCopyCommand() {
    await copyToClipboard(installCommand);
    setCommandCopied(true);
    window.setTimeout(() => setCommandCopied(false), 1600);
  }

  return (
    <section className="skillSection" id="agent-skill">
      <div className="skillGrid">
        <div className="skillCopy">
          <span className="eyebrow">
            <Bot size={16} />
            {t.skillEyebrow}
          </span>
          <h2>{t.skillTitle}</h2>
          <p>{t.skillSubtitle}</p>
          <div className="skillStats">
            {t.skillStats.map((item, index) => {
              const icons = [Bot, Terminal, PackageCheck];
              const Icon = icons[index] || Check;
              return (
                <span key={item}>
                  <Icon size={16} />
                  {item}
                </span>
              );
            })}
          </div>
          <div className="skillCommand">
            <div className="skillCommandHeader">
              <strong>{t.skillCommandLabel}</strong>
              <button type="button" onClick={handleCopyCommand}>
                {commandCopied ? <Check size={16} /> : <Copy size={16} />}
                {commandCopied ? t.skillCopied : t.skillCopyCommand}
              </button>
            </div>
            <code>{installCommand}</code>
          </div>
          <div className="skillPrompt">
            <span>{t.skillPromptLabel}</span>
            <code>{t.skillPrompt}</code>
          </div>
          <div className="skillActions">
            <a href={skillSourceUrl} target="_blank" rel="noreferrer">
              <Github size={18} />
              {t.skillOpenDocs}
            </a>
            <a href="https://agent-plugins.org/" target="_blank" rel="noreferrer">
              <PackageCheck size={18} />
              {t.skillOpenStandard}
            </a>
          </div>
        </div>
        <figure className="skillPreview">
          <img src={skillExampleImage} alt={t.skillExampleAlt} loading="lazy" />
          <figcaption>
            <Sparkles size={15} />
            {t.skillExampleCaption}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function TemplateSection({ language, styleLibrary, onOpenTemplate }) {
  const t = copy[language];
  const repoDocsUrl = `${styleLibrary.repository || fallbackRepoUrl}/blob/main/${styleLibrary.templateDocument}`;
  const templates = styleLibrary.templates || [];

  return (
    <section className="templateSection" id="templates">
      <div className="sectionHead templateHead">
        <div>
          <span className="eyebrow">{t.templateEyebrow}</span>
          <h2>{t.templateTitle}</h2>
          <p>{t.templateSubtitle}</p>
        </div>
        <a className="templateCta" href={`${repoDocsUrl}#section-templates`} target="_blank" rel="noreferrer">
          {t.openTemplate}
          <ArrowUpRight size={16} />
        </a>
      </div>
      <div className="caseGrid templateCaseGrid">
        {templates.map((item, index) => {
          const title = textFor(item.title, language);
          const description = textFor(item.description, language);
          return (
            <article className="caseCard templateVisualCard" key={item.id}>
              <button
                className="caseImage imageButton templateImage"
                type="button"
                onClick={() => onOpenTemplate(item)}
              >
                <img src={item.cover} alt={title} loading="lazy" />
                <span className="caseBadge">
                  {language === 'zh' ? '範本' : 'Template'} {String(index + 1).padStart(2, '0')}
                </span>
                <span className="imageHint">
                  <Eye size={15} />
                  {t.viewDetails}
                </span>
              </button>
              <div className="caseBody">
                <div className="caseMeta">
                  <span>{t.templateKind}</span>
                  <span>{localizeLabel(item.category, language, styleLibrary)}</span>
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
                <div className="tagRow">
                  {(item.tags || []).map((tag) => (
                    <span key={`${item.id}-${tag}`}>{localizeTemplateTag(tag, language, styleLibrary)}</span>
                  ))}
                </div>
                <div className="cardActions templateActions">
                  <button type="button" onClick={() => onOpenTemplate(item)}>
                    <Eye size={17} />
                    {t.viewDetails}
                  </button>
                  <a href={`${repoDocsUrl}#${item.anchor}`} target="_blank" rel="noreferrer">
                    {t.openTemplate}
                    <ArrowUpRight size={17} />
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function PromptCard({
  caseItem,
  copied,
  language,
  onCopy,
  onOpen,
  styleLibrary
}) {
  const t = copy[language];
  const tags = [...new Set([...caseItem.styles, ...caseItem.scenes])].slice(0, 4);

  return (
    <article className="caseCard">
      <button className="caseImage imageButton" type="button" onClick={() => onOpen(caseItem)}>
        <img src={caseItem.image} alt={caseItem.imageAlt} loading="lazy" />
        <span className="caseBadge">{language === 'zh' ? '案例' : 'Case'} {caseItem.id}</span>
        <span className="imageHint">
          <Eye size={15} />
          {t.viewDetails}
        </span>
      </button>
      <div className="caseBody">
        <div className="caseMeta">
          <span>{localizeLabel(caseItem.category, language, styleLibrary)}</span>
          {caseItem.sourceUrl ? (
            <a href={caseItem.sourceUrl} target="_blank" rel="noreferrer">
              {caseItem.sourceLabel}
            </a>
          ) : (
            <span>{caseItem.sourceLabel}</span>
          )}
        </div>
        <h3>{caseItem.title}</h3>
        <p>{promptPreviewFor(caseItem, language)}</p>
        <div className="tagRow">
          {tags.map((tag) => (
            <span key={`${caseItem.id}-${tag}`}>{localizeLabel(tag, language, styleLibrary)}</span>
          ))}
        </div>
        <div className="cardActions caseActions">
          <button type="button" onClick={() => onCopy(caseItem)}>
            {copied ? <Check size={17} /> : <Copy size={17} />}
            {copied ? t.copied : t.copyPrompt}
          </button>
          <button type="button" onClick={() => onOpen(caseItem)}>
            <Eye size={17} />
            {t.viewDetails}
          </button>
          <a href={caseItem.localGithubUrl || caseItem.githubUrl} target="_blank" rel="noreferrer" aria-label={t.openOnGithub}>
            <Github size={18} />
            {t.navUpstream}
          </a>
        </div>
      </div>
    </article>
  );
}

function PreviewDialog({
  preview,
  language,
  styleLibrary,
  copiedId,
  onClose,
  onCopyText
}) {
  const t = copy[language];
  const repoDocsUrl = `${styleLibrary.repository || fallbackRepoUrl}/blob/main/${styleLibrary.templateDocument}`;
  const [editablePrompt, setEditablePrompt] = useState('');
  useBodyScrollLock(Boolean(preview));

  useEffect(() => {
    if (!preview) return undefined;

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [preview, onClose]);

  useEffect(() => {
    if (preview?.type !== 'case') return;
    setEditablePrompt(promptFor(preview.item, language));
  }, [preview, language]);

  if (!preview) return null;

  const { type, item } = preview;
  const isTemplate = type === 'template';
  const title = isTemplate ? textFor(item.title, language) : item.title;
  const description = isTemplate ? textFor(item.description, language) : compactText(promptPreviewFor(item, language));
  const image = isTemplate ? item.cover : item.image;
  const imageAlt = isTemplate ? title : item.imageAlt;
  const promptText = isTemplate ? formatTemplatePrompt(item, language, styleLibrary) : editablePrompt;
  const copyId = isTemplate ? `template-${item.id}` : `case-${item.id}`;
  const isCopied = copiedId === copyId;
  const primaryLink = isTemplate ? `${repoDocsUrl}#${item.anchor}` : (item.localGithubUrl || item.githubUrl);
  const primaryLabel = isTemplate ? t.openTemplate : t.openOnGithub;
  const meta = isTemplate
    ? [t.templateKind, localizeLabel(item.category, language, styleLibrary)]
    : [
        `${language === 'zh' ? '案例' : 'Case'} ${item.id}`,
        localizeLabel(item.category, language, styleLibrary)
      ];
  const tags = isTemplate
    ? [...new Set([...(item.tags || []), ...(item.styles || []), ...(item.scenes || [])])].slice(0, 8)
    : [...new Set([...(item.styles || []), ...(item.scenes || [])])].slice(0, 8);
  const guidance = listFor(item.guidance, language);
  const pitfalls = listFor(item.pitfalls, language);

  return (
    <div
      className="previewOverlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="previewDialog" role="dialog" aria-modal="true" aria-labelledby="preview-title">
        <button className="previewClose" type="button" onClick={onClose} aria-label={t.closePreview}>
          <X size={20} />
        </button>
        <div className="previewMedia">
          <img src={image} alt={imageAlt} />
        </div>
        <div className="previewContent">
          <div className="previewMeta">
            {meta.map((itemMeta) => (
              <span key={itemMeta}>{itemMeta}</span>
            ))}
          </div>
          <h2 id="preview-title">{title}</h2>
          <p>{description}</p>
          <div className="tagRow previewTags">
            {tags.map((tag) => (
              <span key={`${type}-${item.id}-${tag}`}>
                {isTemplate
                  ? localizeTemplateTag(tag, language, styleLibrary)
                  : localizeLabel(tag, language, styleLibrary)}
              </span>
            ))}
          </div>
          {isTemplate && item.useWhen ? (
            <div className="previewSection compactSection">
              <h3>{t.useWhen}</h3>
              <p>{textFor(item.useWhen, language)}</p>
            </div>
          ) : null}
          <div className="previewActions">
            <button type="button" onClick={() => onCopyText(promptText, copyId)}>
              {isCopied ? <Check size={17} /> : <Copy size={17} />}
              {isCopied ? t.copied : isTemplate ? t.copyTemplatePrompt : t.copyPrompt}
            </button>
            <a href={primaryLink} target="_blank" rel="noreferrer">
              {primaryLabel}
              <ArrowUpRight size={17} />
            </a>
            {!isTemplate && item.sourceUrl ? (
              <a href={item.sourceUrl} target="_blank" rel="noreferrer">
                {t.source}
                <ArrowUpRight size={17} />
              </a>
            ) : null}
          </div>
          <div className="previewSection">
            <div className="sectionTitleRow">
              <h3>{isTemplate ? t.templatePrompt : t.editablePrompt}</h3>
              {!isTemplate ? (
                <button type="button" onClick={() => setEditablePrompt(promptFor(item, language))}>
                  {t.resetPrompt}
                </button>
              ) : null}
            </div>
            {isTemplate ? (
              <pre className="promptBlock">{promptText}</pre>
            ) : (
              <textarea
                className="promptEditor"
                value={editablePrompt}
                onChange={(event) => setEditablePrompt(event.target.value)}
                maxLength={6000}
              />
            )}
          </div>
          {isTemplate && (guidance.length || pitfalls.length || item.exampleCases?.length) ? (
            <div className="previewColumns">
              {guidance.length ? (
                <div className="previewSection compactSection">
                  <h3>{t.guidance}</h3>
                  <ul>
                    {guidance.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {pitfalls.length ? (
                <div className="previewSection compactSection">
                  <h3>{t.pitfalls}</h3>
                  <ul>
                    {pitfalls.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {item.exampleCases?.length ? (
                <div className="previewSection compactSection">
                  <h3>{t.examples}</h3>
                  <div className="exampleCaseRow">
                    {item.exampleCases.map((caseId) => (
                      <a
                        href={`${styleLibrary.repository || fallbackRepoUrl}/blob/main/docs/gallery-part-${caseId <= 165 ? 1 : 2}.md#case-${caseId}`}
                        target="_blank"
                        rel="noreferrer"
                        key={caseId}
                      >
                        #{caseId}
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function App() {
  useGaPageViews();
  const [siteData, setSiteData] = useState(null);
  const [styleLibrary, setStyleLibrary] = useState(null);
  const [language, setLanguage] = useState(() => (
    localStorage.getItem('language') === 'en' ? 'en' : 'zh'
  ));
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [style, setStyle] = useState('All');
  const [scene, setScene] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [preview, setPreview] = useState(null);
  const { copiedId, copyPrompt, copyText } = useCopy(language);
  const repoUrl = siteData?.repository || fallbackRepoUrl;
  const t = copy[language];

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch('/cases.json').then((response) => response.json()),
      fetch('/style-library.json').then((response) => response.json())
    ])
      .then(([payload, library]) => {
        if (!cancelled) {
          setSiteData(payload);
          setStyleLibrary(library);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language === 'zh' ? 'zh-TW' : 'en';
    document.title = language === 'zh'
      ? 'GPT-Image2 提示詞圖庫｜繁體中文（台灣）'
      : 'GPT-Image2 Prompt Gallery';
  }, [language]);

  useEffect(() => {
    if (!siteData || !styleLibrary || !window.location.hash) return;
    const target = document.getElementById(window.location.hash.slice(1));
    if (!target) return;
    window.requestAnimationFrame(() => {
      target.scrollIntoView({ block: 'start' });
    });
  }, [siteData, styleLibrary]);

  const latestCases = useMemo(() => {
    if (!siteData) return [];
    return [...siteData.cases].sort((a, b) => b.id - a.id);
  }, [siteData]);

  const heroCases = useMemo(
    () => takeDistinctCases(latestCases, HERO_CASE_COUNT),
    [latestCases]
  );

  const hotStripCases = useMemo(
    () => takeDistinctCases(
      latestCases,
      HOT_STRIP_CASE_COUNT,
      new Set(heroCases.map((caseItem) => caseItem.id))
    ),
    [heroCases, latestCases]
  );

  const filteredCases = useMemo(() => {
    if (!siteData) return [];
    const q = query.trim().toLowerCase();
    return siteData.cases.filter((item) => {
      const matchQuery =
        !q ||
        `${item.id} ${item.title} ${item.category} ${item.promptZh || ''} ${item.prompt || ''} ${item.sourceLabel}`
          .toLowerCase()
          .includes(q);
      const matchCategory = category === 'All' || item.category === category;
      const matchStyle = style === 'All' || item.styles.includes(style);
      const matchScene = scene === 'All' || item.scenes.includes(scene);
      return matchQuery && matchCategory && matchStyle && matchScene;
    });
  }, [siteData, query, category, style, scene]);

  const orderedCategories = useMemo(
    () => (siteData && styleLibrary ? orderByLibrary(siteData.categories, styleLibrary.categories) : []),
    [siteData, styleLibrary]
  );
  const orderedStyles = useMemo(
    () => (siteData && styleLibrary ? orderByLibrary(siteData.styles, styleLibrary.styles) : []),
    [siteData, styleLibrary]
  );
  const orderedScenes = useMemo(
    () => (siteData && styleLibrary ? orderByLibrary(siteData.scenes, styleLibrary.scenes) : []),
    [siteData, styleLibrary]
  );

  const totalPages = Math.max(1, Math.ceil(filteredCases.length / CASES_PER_PAGE));
  const pageStart = (currentPage - 1) * CASES_PER_PAGE;
  const visibleCases = filteredCases.slice(pageStart, pageStart + CASES_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [query, category, style, scene]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const goToPage = (page) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    if (nextPage === currentPage) return;
    setCurrentPage(nextPage);
    window.requestAnimationFrame(() => {
      document.getElementById('case-results')?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    });
  };

  const normalizedPath = window.location.pathname.replace(/\/+$/, '') || '/';
  const isLegacyCommunityRoute = normalizedPath === '/community' || normalizedPath === '/community/result';

  if (isLegacyCommunityRoute) {
    return (
      <main>
        <LegacyCommunityRedirect language={language} />
      </main>
    );
  }

  if (!siteData || !styleLibrary) {
    return (
      <main>
        <div className="loadingScreen">
          <WandSparkles size={28} />
          <span>{t.loading}</span>
        </div>
      </main>
    );
  }

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#">
          <WandSparkles size={21} />
          {t.brand}
        </a>
        <div className="topbarControls">
          <nav>
            <a href="#gallery">{t.navCases}</a>
            <a href="#templates">{t.navTemplates}</a>
            <a href="#agent-skill">{t.navSkill}</a>
            <a href={personalSiteUrl} target="_blank" rel="noreferrer">
              {t.navPersonal}
            </a>
            <a href={codexLearningUrl} target="_blank" rel="noreferrer">
              {t.navCodexLearning}
            </a>
            <DiscordNavItem language={language} />
            <a href={repoUrl} target="_blank" rel="noreferrer">
              {t.navUpstream}
            </a>
          </nav>
          <LanguageSwitch language={language} setLanguage={setLanguage} />
        </div>
      </header>

      <Hero
        latestCases={heroCases}
        language={language}
        repoUrl={repoUrl}
        totalCases={siteData.totalCases}
        categoryCount={siteData.categories.length}
        onOpenCase={(item) => setPreview({ type: 'case', item })}
      />

      <section className="hotStrip">
        {hotStripCases.map((caseItem) => (
          <button
            type="button"
            aria-label={`${language === 'zh' ? '查看案例' : 'Open case'} ${caseItem.id}: ${caseItem.title}`}
            onClick={() => setPreview({ type: 'case', item: caseItem })}
            key={caseItem.id}
          >
            <img src={caseItem.image} alt={caseItem.imageAlt} />
            <span>#{caseItem.id}</span>
          </button>
        ))}
      </section>

      <section className="gallerySection" id="gallery">
        <div className="sectionHead">
          <div>
            <span className="eyebrow">{t.sectionEyebrow}</span>
            <h2>{t.sectionTitle}</h2>
          </div>
          <div className="searchBox">
            <Search size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t.search}
            />
          </div>
        </div>

        <div className="filterPanel">
          <div>
            <strong>{t.category}</strong>
            <div className="filterRow">
              <FilterPill active={category === 'All'} onClick={() => setCategory('All')}>{t.all}</FilterPill>
              {orderedCategories.map((item) => (
                <FilterPill key={item} active={category === item} onClick={() => setCategory(item)}>
                  {localizeLabel(item, language, styleLibrary)}
                </FilterPill>
              ))}
            </div>
          </div>
          <div>
            <strong>{t.style}</strong>
            <div className="filterRow">
              <FilterPill active={style === 'All'} onClick={() => setStyle('All')}>{t.all}</FilterPill>
              {orderedStyles.map((item) => (
                <FilterPill key={item} active={style === item} onClick={() => setStyle(item)}>
                  {localizeLabel(item, language, styleLibrary)}
                </FilterPill>
              ))}
            </div>
          </div>
          <div>
            <strong>{t.scene}</strong>
            <div className="filterRow">
              <FilterPill active={scene === 'All'} onClick={() => setScene('All')}>{t.all}</FilterPill>
              {orderedScenes.map((item) => (
                <FilterPill key={item} active={scene === item} onClick={() => setScene(item)}>
                  {localizeLabel(item, language, styleLibrary)}
                </FilterPill>
              ))}
            </div>
          </div>
        </div>

        <div className="resultBar" id="case-results">
          <span>{language === 'zh' ? `${filteredCases.length} ${t.matching}` : `${filteredCases.length} ${t.matching}`}</span>
          <a href={repoUrl} target="_blank" rel="noreferrer">
            {t.openGithub}
            <ArrowUpRight size={16} />
          </a>
        </div>

        <div className="caseGrid">
          {visibleCases.map((caseItem) => (
            <PromptCard
              caseItem={caseItem}
              copied={copiedId === `case-${caseItem.id}`}
              language={language}
              onCopy={copyPrompt}
              onOpen={(item) => setPreview({ type: 'case', item })}
              styleLibrary={styleLibrary}
              key={caseItem.id}
            />
          ))}
        </div>

        {totalPages > 1 && (
          <nav className="pagination" aria-label={t.pageStatus(currentPage, totalPages)}>
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={18} />
              {t.previousPage}
            </button>
            <div className="pageNumbers">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  className={page === currentPage ? 'active' : ''}
                  type="button"
                  aria-current={page === currentPage ? 'page' : undefined}
                  aria-label={t.pageStatus(page, totalPages)}
                  onClick={() => goToPage(page)}
                  key={page}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              {t.nextPage}
              <ChevronRight size={18} />
            </button>
          </nav>
        )}
      </section>

      <TemplateSection
        language={language}
        styleLibrary={styleLibrary}
        onOpenTemplate={(item) => setPreview({ type: 'template', item })}
      />

      <SkillSection language={language} repoUrl={repoUrl} />
      <PreviewDialog
        preview={preview}
        language={language}
        styleLibrary={styleLibrary}
        copiedId={copiedId}
        onClose={() => setPreview(null)}
        onCopyText={copyText}
      />
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
