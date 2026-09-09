# GPT-Image-2.5 圖庫重產

使用者已指定直接使用 Codex 內建產圖。2026/9/8 官方公告 Images 2.5 已供應於 Codex，網站依公告與使用者確認歸類為 GPT-Image-2.5。內建工具不回傳子型號；actualModel 保留 null，不宣稱指定 Flare 或 Sunburst。此流程不需要 API 金鑰。

網站使用「全部／GPT-Image-2／GPT-Image-2.5」。每個案例保留原 ID、提示詞與收藏關係；有已上架 2.5 圖片時，「全部」優先顯示新圖。選擇 2.5 不會退回舊圖。

完整目標為目前 541 個案例。`node scripts/prepare-image-25-batch.mjs` 可整理提示詞；其中 API 模型欄位僅供另行明確指定 API 時使用，當前產圖一律使用內建工具。需要參考照片的案例先記錄缺少的輸入，不把舊結果當成原始照片。

逐張以完整提示詞呼叫內建產圖，檢視輸出後執行 `node scripts/register-builtin-image.mjs 案例ID 生成圖片絕對路徑 '觀察註記'`。圖片會複製到 data/images/gpt-image-2.5，並登記 data/image-variants.json。已完成的同日內建產圖可沿用既有檔案，避免不必要的重複生成。生成器驗證檔案與輸出雜湊，published 圖片才會出現在前台。

官方公告：https://openai.com/index/introducing-chatgpt-images-2-5/
