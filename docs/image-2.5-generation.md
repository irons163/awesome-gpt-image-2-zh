# GPT-Image-2.5 圖庫重產

2026/9/9 已逐筆核對全部 541 個案例，完成 414 張新版圖片。其餘 127 筆：89 筆缺原始參考圖、29 筆被產圖服務拒絕、7 筆需修改提示詞、2 筆未公開原始提示詞。逐筆原因見 `docs/image-2.5-generation-status.json`；這些案例尚無 2.5 圖片。

生成結果保留原提示詞與可見缺陷，醫療、百科、工程、廣告及模擬社群畫面的觀察註記存於 `data/image-variants.json`。圖片不是事實查核結果，也未作轉換率或模型優劣測試。

案例 237 的前置查閱包含 Coca-Cola 2025 年 [Share a Coke](https://www.coca-colacompany.com/media-center/iconic-share-a-coke-is-back-for-a-new-generation) 與 [夏季活動](https://www.coca-colacompany.com/media-center/coca-cola-invites-gen-z-to-live-fully-in-the-moment)，可觀察個人化包裝與 QR 活動入口，沒有可據以宣稱高轉換率的測試資料。案例 292 的 X 主頁直接讀取失敗，改查索引中的 [個人簡介](https://twstalker.com/dotey) 及公開貼文；生成結果仍誤將寶玉解讀為紅樓夢人物，已註記此偏差。

使用者已指定直接使用 Codex 內建產圖。2026/9/8 官方公告 Images 2.5 已供應於 Codex，網站依公告與使用者確認歸類為 GPT-Image-2.5。內建工具不回傳子型號；actualModel 保留 null，不宣稱指定 Flare 或 Sunburst。此流程不需要 API 金鑰。

網站使用「全部／GPT-Image-2／GPT-Image-2.5」。每個案例保留原 ID、提示詞與收藏關係；有已上架 2.5 圖片時，「全部」優先顯示新圖。選擇 2.5 不會退回舊圖。

完整目標為目前 541 個案例。`node scripts/prepare-image-25-batch.mjs` 可整理提示詞；其中 API 模型欄位僅供另行明確指定 API 時使用，當前產圖一律使用內建工具。需要參考照片的案例先記錄缺少的輸入，不把舊結果當成原始照片。

逐張以完整提示詞呼叫內建產圖，檢視輸出後執行 `node scripts/register-builtin-image.mjs 案例ID 生成圖片絕對路徑 '觀察註記'`。圖片會複製到 data/images/gpt-image-2.5，並登記 data/image-variants.json。已完成的同日內建產圖可沿用既有檔案，避免不必要的重複生成。生成器驗證檔案與輸出雜湊，published 圖片才會出現在前台。

官方公告：https://openai.com/index/introducing-chatgpt-images-2-5/
