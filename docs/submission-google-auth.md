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
6. 實測 Google 登入／登出、過期登入、未登入 POST、Turnstile 及並行提交 6 次。每帳號每天最多 5 次通過驗證後的送件，按 Asia/Taipei 日期計算。資料庫 atomic upsert 防止併發超額，服務重啟不重置。

欄位或 Turnstile 驗證失敗不扣額度。開始 GitHub 送件後若結果不確定，保留扣額度，避免網路逾時造成重複 Issue。會員信箱只用於認證，不寫入公開 Issue；Issue 使用投稿者填寫的公開暱稱。

未完成獨立登入設定時，新版會停止接受投稿，不會退回訪客模式。需先完成設定再合併部署。

## 我的最愛

在同一個獨立專案執行 `supabase/favorites.sql`。收藏使用既有 Google 工作階段，後端驗證帳號後限定 `user_id` 讀寫；瀏覽器不能直接存取資料表。每筆收藏以帳號與案例編號去重，收藏不消耗投稿額度。網站的「我的最愛」入口會顯示已收藏案例，案例卡片與詳情皆可加入或取消。

## Email 登入

站內共用登入介面支援登入連結、Email 驗證碼、密碼登入、註冊與忘記密碼。Email 與 Google 均使用此圖庫專案；API 只接受 Supabase 驗證且已確認信箱的非匿名帳號。

啟用前完成下列設定：

1. Supabase Authentication 的 Email provider 保持啟用，Confirm email 開啟。
2. 設定正式 SMTP 寄信服務（預設寄信服務不適合一般訪客）。若採 TCF 的 ForwardHello Send Email Hook，須另設圖庫專用的 Hook 與寄件身分，不能直接指向 TCF 的端點。
3. 將 `supabase/email-templates/` 三份範本分別貼至 Magic link、Confirm sign up、Reset password；登入與確認信都包含連結及 `{{ .Token }}`。
4. 允許返回 `https://gpt-image2.zero2codex.dev/?submission=login#submit`，保留既有 Google redirect。
5. 實測一般訪客信箱可收到信後，在伺服器設定 `SUBMISSION_EMAIL_AUTH_ENABLED=true` 並重啟服務。預設不顯示 Email 入口，避免寄信未設定就讓訪客嘗試。

密碼直接透過 Supabase SDK 送至此專案 Auth，不會寫入圖庫伺服器日誌。登入狀態沿用 PKCE、持久保存與自動更新 token；重設密碼透過 PASSWORD_RECOVERY 事件開啟專用表單。寄信重送介面倒數 60 秒，實際驗證及頻率限制由 Supabase Auth 執行。從郵件以不同瀏覽器開啟 PKCE 連結可能無法完成，請回原瀏覽器使用驗證碼。
