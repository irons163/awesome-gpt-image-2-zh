# 圖庫獨立 Google 登入

沿用 tcf-canada-web 的 Supabase OAuth 模式，但使用本圖庫專用的 Supabase 專案與 Google OAuth 應用程式。不複製 TCF 金鑰、資料表或使用者資料。

1. 建立獨立 Supabase 專案，啟用 Google provider。Google OAuth callback 使用新專案 Authentication 設定顯示的 `/auth/v1/callback`。
2. Supabase Site URL 設為 `https://gpt-image2.zero2codex.dev`；允許 redirect URL `https://gpt-image2.zero2codex.dev/?submission=login` 及 `https://gpt-image2.zero2codex.dev/?submission=login#submit`。
3. 在新專案執行 `supabase/submission-quota.sql`。額度資料不開放 anon 或 authenticated 讀寫，只允許後端透過 service_role 呼叫函式。
4. 在 Hetzner `/etc/gpt-image2/gpt-image2.env` 設定：

   SUBMISSION_SUPABASE_URL=
   SUBMISSION_SUPABASE_PUBLISHABLE_KEY=
   SUBMISSION_SUPABASE_SERVICE_ROLE_KEY=

5. 重啟服務。GET /api/submissions 僅回傳公開網址與 publishable key，不回傳 service role key。
6. 實测 Google 登入／登出、過期登入、未登入 POST、Turnstile 及並行提交 6 次。每帳號每天最多 5 次通過驗證後的送件，按 Asia/Taipei 日期計算。資料庫 atomic upsert 防止併發超額，服務重啟不重置。

欄位或 Turnstile 驗證失敗不扣額度。開始 GitHub 送件後若結果不確定，保留扣額度，避免網路逾時造成重複 Issue。會員信箱只用於認證，不寫入公開 Issue；Issue 使用投稿者填寫的公開暱稱。

未完成獨立登入設定時，新版會停止接受投稿，不會退回訪客模式。需先完成設定再合併部署。
