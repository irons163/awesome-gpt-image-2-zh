# 參與編修

歡迎修正繁中翻譯、補充案例及改善網站。請先閱讀[繁中化規範](docs/localization.md)。

- 使用台灣繁體中文，優先檢查語句是否自然，再檢查字形。
- 保留作者署名、來源網址、英文原始提示詞、圖片與穩定的案例編號。
- 修改案例時編輯 `docs/gallery-part-*.md`；範本與標籤則編輯 `data/style-library.json` 及 `docs/templates.md`。
- 新增圖片必須提供來源。原始圖片上的文字不需為了翻譯而改圖。
- 後端的 `zh` 欄位是相容性識別碼，請勿直接重新命名為 `zh-TW`。

需要預覽網站時，請使用 Node.js 22.12 以上版本，在專案目錄執行：

```bash
npm ci
npm run dev
```

若更新來源文件中的英文提示詞，先執行 `npm run generate:prompt-translations` 更新 `zh-TW` 翻譯快取，再執行資料產生與檢查；此步驟需要網路連線。

送出變更前執行：

```bash
npm ci
npm run build
npm run check:localization
npm test
```

請在變更說明附上編修範圍及驗證結果；涉及介面時附上畫面截圖。上游同步另外標記來源版本與案例數量。
