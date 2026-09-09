# GPT-Image-2.5 圖庫重產

網站的產圖模型切換使用「全部／GPT-Image-2／GPT-Image-2.5」。每個案例保留原 ID、提示詞與收藏關係；有已上架 2.5 圖片時，「全部」優先顯示新圖。選擇 2.5 不會退回舊圖。先前版本不明的 Codex 實測圖片不納入 2.5。

執行 `node scripts/prepare-image-25-batch.mjs`，會從目前圖庫準備所有提示詞及盤點清單，存於 `tmp/imagegen/gpt-image-2.5/`。目前 541 筆。這個指令不呼叫 API。

重產指定 `gpt-image-2.5-sunburst`，需要執行環境有可用的 `OPENAI_API_KEY`。不要將金鑰提交到 Git。先逐筆確認 inventory 的輸入需求；possibleReferenceRequired 只是文字初篩，沒有命中也必須確認。需要參考照片的案例必須取得原始輸入，不使用既有生成結果假冒參考圖。

確認純文字生成的案例後，另存為 reviewed-prompts.jsonl，透過 ImageGen skill 的 scripts/image_gen.py generate-batch 執行，使用 --model gpt-image-2.5-sunburst --no-augment --input reviewed-prompts.jsonl --out-dir output/imagegen/gpt-image-2.5。需要參考圖的案例使用該 CLI 的 edit 子命令，逐筆指定已確認的輸入圖。不要直接執行未審閱的 all-prompts.jsonl。

檢查結果後將圖片放入 data/images/gpt-image-2.5/，並在 data/image-variants.json 的 cases[案例ID] 陣列登記 image、model、generatedDate、promptSha256、outputSha256 和 status: published。記錄實際 API 請求的模型；保留請求及結果記錄。生成器會驗證檔案與輸出雜湊；只有 published 圖片會出現在前台。所有批次產圖尚未開始，不能將盤點清單視為已生成結果。

官方模型文件：https://developers.openai.com/api/docs/models/gpt-image-2.5-sunburst
