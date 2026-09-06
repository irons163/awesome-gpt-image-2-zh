# GPT-Image2 付費交流群上線手冊（歷史參考）

> 繁中網站目前不提供付費交流群入口，導覽與舊 `/community` 路徑會改開 Phil AI 的 Discord。本文僅保留上游後端與資料庫 migration 的相容性參考；除非你要重新啟用這套付款流程，否則不需要套用本頁設定。

目前實作將付費群與點數包、會員付款完全分離：支付寶一次性付款 `¥9.90` 後，資格綁定 Supabase 使用者帳號；只有伺服器端確認訂單為 `PAID` 時才能讀取受保護社群 QR Code。

## 本機能力

- 頁面：`/community`
- 付款重新導向：`/community/result`
- 付款方式：支付寶網站付款 `alipay.trade.page.pay`
- 固定金額：`990` 分，`CNY`
- 訂單狀態：`PENDING`、`PAID`、`CLOSED`、`REFUNDED`、`REVOKED`
- 退款處理狀態：`NONE`、`PROCESSING`、`SUCCEEDED`、`FAILED`
- 資格規則：僅 `PAID` 有效；退款處理中保持 `PAID`；支付寶確認退款成功後改為 `REFUNDED`
- 社群 QR Code：資料庫 `bytea` 資源，限 PNG/JPEG/WebP、最大 2 MB，管理員透過交易 RPC 原子替換

## API

公開與目前使用者：

- `GET /api/community/config`
- `GET /api/community/status`
- `GET /api/community/qr`

支付寶：

- `POST /api/community/alipay/checkout`
- `GET /api/community/alipay/query`
- `POST /api/community/alipay/close`
- `POST /api/community/alipay/notify`

超級管理員：

- `GET /api/admin/community/orders`
- `GET|POST /api/admin/community/qr`
- `POST /api/admin/community/refund`
- `GET /api/admin/community/refund-query`
- `POST /api/admin/community/revoke`

## 環境變數

正式部署必須先保持：

```dotenv
COMMUNITY_PAYMENT_ENABLED=false
COMMUNITY_ALIPAY_NOTIFY_URL=https://your-domain.example/api/community/alipay/notify
COMMUNITY_SUPPORT_TEXT=請填寫本站客服聯絡方式
```

支付寶正式變數沿用現有 `ALIPAY_APP_ID`、`ALIPAY_PRIVATE_KEY`、`ALIPAY_PUBLIC_KEY`、`ALIPAY_SELLER_ID` 和正式閘道器設定。正式私鑰只放在 Hetzner 伺服器的敏感環境變數或秘密管理器中，不寫入儲存庫、檔案或對話。

## 首次部署順序

1. 保持 `COMMUNITY_PAYMENT_ENABLED=false`。
2. 在目標 Supabase 專案應用 `supabase/migrations/20260722090000_paid_community.sql`。
3. 部署同一版本程式碼，確認 `/community`、`/community/result` 和唯讀狀態介面正常。
4. 由 `super_admin` 在管理面板上傳一張從未公開過的新社群 QR Code。
5. 在支付寶開放平臺完成網站付款簽約、應用設定與釋出，並確認公用網路 HTTPS 通知地址沒有重新導向。
6. 設定屬於同一正式應用的 App ID、應用公鑰、應用私鑰和支付寶公鑰；Node.js 使用 PKCS#1 私鑰原文。
7. 開啟 `COMMUNITY_PAYMENT_ENABLED=true`。
8. 用同一正式版本完成一筆真實 `¥9.90` 付款和退回原付款方式驗收。

## 正式驗收

真實付款必須逐項確認：

- 前端不能提交或覆蓋金額。
- 建立的是獨立 `community_orders`，不會觸發點數包履約。
- 支付寶主動查詢訂單和非同步通知都能冪等寫入 `PAID`。
- 同步重新導向只觸發伺服器端查詢訂單，不信任 URL 參數。
- 付款帳號可以讀取社群 QR Code，未付款帳號得到拒絕回應。
- 管理員退款使用穩定退款請求號；處理中資格仍有效。
- 退款查詢得到 `REFUND_SUCCESS` 後寫入 `REFUNDED`，隨後社群 QR Code存取失效。
- 任何關鍵項失敗時立即將 `COMMUNITY_PAYMENT_ENABLED` 改回 `false`。

## 社群 QR Code輪換與日常維運

- 社群 QR Code 過期時，在管理面板上傳新圖片；RPC 會在同一交易中停用舊圖並啟用新圖。
- 不要把受保護社群 QR Code上傳到 GitHub、README、公開物件儲存或前端靜態目錄。
- 退款由本站客服人工審核（透過 `COMMUNITY_SUPPORT_TEXT` 設定聯絡方式）；管理員操作前核對帳號、訂單號和退款狀態。
- 人工撤銷資格不會自動退款；需要退款時使用退款流程，不用撤銷代替退款。
