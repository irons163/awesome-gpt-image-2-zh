# 支付寶網站付款

專案同時保留 Stripe，併為一次性點數包增加支付寶網站付款。會員訂閱仍由 Stripe 處理，避免把支付寶單次付款誤當成自動續費。

## 介面

| 路徑 | 用途 | 許可權 |
| --- | --- | --- |
| `POST /api/billing/alipay/checkout` | 建立訂單並返回支付寶 POST 表單 | 登入使用者 |
| `GET /api/billing/alipay/query` | 主動查詢交易並冪等發放點數 | 訂單所屬使用者 |
| `POST /api/billing/alipay/notify` | 驗籤、校驗訂單並處理非同步通知 | 支付寶伺服器 |
| `POST /api/billing/alipay/refund` | 發起全額退款並預扣對應點數 | 超級管理員 |
| `GET /api/billing/alipay/refund-query` | 查詢退款結果 | 超級管理員 |
| `POST /api/billing/alipay/close` | 關閉未付款訂單 | 超級管理員 |

付款結果只接受驗籤透過的非同步通知或 `alipay.trade.query` 主動查詢。瀏覽器同步重新導向只用於開啟結果頁，不直接判定付款成功。

## 資料庫與人民幣定價

先應用遷移 `supabase/migrations/20260721090000_alipay_webpay.sql`。迁移会增加付款通道、付款宝交易号、退款状态和原子积分入账/退款函数。

每個需要開放支付寶購買的點數包，都必須在 `credit_packs.alipay_amount_cents` 中填寫經過業務確認的人民幣分值。沒有獨立人民幣價格的點數包不會展示可用的支付寶按鈕；程式碼不會把現有美元價格按 1:1 當作人民幣價格。

## 本機沙箱

原生程式碼直接讀取專案根目錄下、由支付寶 AI 付 Skill 建立並驗證的 `.alipay-sandbox.json`：

- Node.js 使用 `appIds[0].appPrivatePkcsKey`（PKCS#1）。
- 閘道器固定為 `https://openapi-sandbox.dl.alipaydev.com/gateway.do`。
- 設定檔案必須保持 Git 忽略和僅目前使用者可讀寫。
- 本機沒有公用網路 HTTPS 地址時不傳送 `notify_url`，付款結果由交易查詢確認；通知處理程式碼仍會保留。

## 正式設定

正式環境透過伺服器端環境變數設定：

- `ALIPAY_APP_ID`
- `ALIPAY_PRIVATE_KEY`
- `ALIPAY_PUBLIC_KEY`
- `ALIPAY_SELLER_ID`
- `ALIPAY_GATEWAY`
- `ALIPAY_NOTIFY_URL`
- `ALIPAY_NOTIFY_ENABLED`

`ALIPAY_APP_ID`、應用公鑰和應用私鑰必須屬於同一套正式應用金鑰。Node.js 使用 PKCS#1 原始私鑰字串，不新增 PEM 頭尾，不在日誌、前端或儲存庫中儲存金鑰。

真實上線必須使用公用網路 HTTPS `notify_url`，完成通知驗籤、冪等處理、`app_id`、`seller_id`、訂單號和金額校驗，並保留主動查詢作為補償鏈路。
