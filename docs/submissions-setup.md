# 投稿串接設定（維護者）

網站使用者須先以 Google 登入才能投稿，後端使用 GitHub App 建立公開 Issue。
登入使用圖庫獨立的 Supabase 專案，設定步驟見 [Google 登入設定](submission-google-auth.md)。
Issue 不會自動上架到圖庫，維護者仍須審核。

## GitHub App

在 https://github.com/settings/apps/new 建立僅供自己安裝的 App：
- 名稱：自行選擇尚未被使用的名稱，例如 phil-image-gallery-submissions。
- Homepage URL：https://gpt-image2.zero2codex.dev/
- 關閉 Webhook，不需要 OAuth callback。
- Repository permissions：Issues — Read and write，其他維持預設。
- 安裝時僅選 irons163/awesome-gpt-image-2-zh。
- 記錄 App ID 和安裝頁網址中的 Installation ID，產生 PEM 私鑰。

## Cloudflare Turnstile

建立 Managed widget，允許 hostname：gpt-image2.zero2codex.dev。
取得 Site key 與 Secret key。驗證由後端呼叫 Siteverify 完成。

## Hetzner 設定

將以下變數加入現有服務使用的環境檔；私鑰和 Secret 不要提交至 Git。
私鑰放於主機受保護路徑，讓 gpt-image2 服務帳號可讀取即可。

    GITHUB_APP_ID=
    GITHUB_INSTALLATION_ID=
    GITHUB_APP_PRIVATE_KEY_PATH=/etc/gpt-image2/submission-app.pem
    TURNSTILE_SITE_KEY=
    TURNSTILE_SECRET_KEY=
    SUBMISSION_ORIGIN=https://gpt-image2.zero2codex.dev
    SUBMISSION_UPLOAD_DIR=/var/lib/gpt-image2/submissions
    SUBMISSION_SUPABASE_URL=
    SUBMISSION_SUPABASE_PUBLISHABLE_KEY=
    SUBMISSION_SUPABASE_SERVICE_ROLE_KEY=

建立上傳資料夾並讓 gpt-image2 擁有讀寫權限，加入主機備份。
若 systemd 設定了 ProtectSystem，需將此資料夾加入 ReadWritePaths。
重啟服務後 /api/submissions 應回傳 enabled: true，網站表單才會啟用。
啟用前需實際投稿一次，確認 bot 作者、圖片顯示與成功回條。

## 審核與維護

投稿只接受 PNG/JPEG、最多 3 MB；每個帳號每天最多 5 筆通過驗證的送件，於台灣時間午夜重置。
額度儲存在獨立 Supabase 資料庫，服務重啟不會重置，也不與其他帳號共用。
欄位或 Turnstile 驗證失敗不扣額度；開始 GitHub 送件後若結果不確定，仍保留扣額度以避免重複 Issue。
GitHub App 權杖只在後端取得。圖片以隨機檔名透過圖片 API 公開，不能列出目錄。
投稿者必須同意內容在 GitHub 公開；Google 帳號信箱僅用於登入驗證，不寫入公開 Issue。

若 GitHub 請求結果不確定，圖片與 pending JSON 回條會保留在上傳資料夾。
先以回條的投稿編號搜尋 GitHub Issues，確認是否已建立再手動處理，避免重複建立。
拒絕投稿若需刪圖，依回條編號移除對應圖片；關閉 Issue 不會自動刪除圖片。

## 審核後上架

1. 維護者在投稿 Issue 加上 `approved` 標籤。僅接受有 write、maintain 或 admin 權限的人操作。
2. GitHub Actions 下載本站投稿圖片，建立 `codex/submission-編號` 分支與 PR。重複加標籤不會重複收錄。
3. 在 PR 檢查圖片、台灣用語與 `data/submissions/issue-編號.json` 的分類；預設分類為 Other Use Cases。
4. 合併 PR 至 main 後，等待 Validate Taiwan Traditional Chinese edition 通過。Hetzner 每兩分鐘檢查一次，建置成功後更新網站；訪客重新整理即可看到。

投稿使用獨立資料檔，案例 ID 為 1000000 + Issue 編號；不改動上游來源快照。
建立 PR 使用 GitHub Actions 的短效 GITHUB_TOKEN，並在建立前執行完整檢查。GitHub 若將 bot 建立的 PR 檢查標為 Requires approval，維護者需在 Actions 核准執行；合併至 main 後仍會執行 push 檢查。
若初次執行失敗，可在 Actions 手動執行 Prepare approved submission 並輸入 Issue 編號。已存在分支會保留修改；已關閉 PR 不會自動重開。

伺服器使用 root 擁有的 `/usr/local/sbin/gpt-image2-auto-deploy` 與 `gpt-image2-deploy.timer`；建置以 gpt-image2 帳號執行。腳本來源為 scripts/auto-deploy.sh，修改後需由維護者重新安裝。建置失敗保留原靜態網站，部署結果可查 `journalctl -u gpt-image2-deploy.service`。

Caddy 的圖庫靜態頁面也須反向代理至 `172.17.0.1:4174`，並對非 API 回應設定 `Cache-Control: no-cache`。不要從 Docker 綁定的 `/srv/gpt-image2` 讀取靜態檔：部署切換 dist 資料夾時，既有 bind mount 仍會指向舊資料夾。2026-09-08 已在正式主機完成此設定並驗證投稿案例與圖片可讀取。
