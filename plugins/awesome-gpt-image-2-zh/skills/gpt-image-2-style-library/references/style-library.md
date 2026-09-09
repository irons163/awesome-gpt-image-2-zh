# GPT Image 風格庫參考（台灣繁體中文）

由 `data/style-library.json` 產生，提供提示詞範本、視覺風格、分類與情境標籤索引。中文欄位使用台灣繁體中文。

## 選擇原則

- Match explicit product types to template categories first, such as product, poster, UI, infographic, brand, photography, character, or document.
- Match visual words to style tags next, such as realistic, 3D, illustration, classical, brand, poster, or UI.
- Match context words to scene tags next, such as commerce, education, social, food, travel, story, history, tech, or creative.
- If a request is vague, offer 2-3 strong template directions and ask the user to choose before writing the final prompt.
- Final output should include the selected template name, a copyable GPT Image prompt, and concise constraints for text, aspect ratio, layout, and negative details.

## 範本索引

### UI Screenshot System / UI 截圖系統

- ID: `ui-screenshot-system`
- Category: UI & Interfaces
- Styles: UI
- Scenes: Tech, Social
- Tags: UI, Dashboard, Screenshot
- Cover: `/images/case17.jpg`
- 本專案範本連結： https://github.com/irons163/awesome-gpt-image-2-zh/blob/main/docs/templates.md#tpl-ui
- 參考案例： case 17, case 2, case 4

適用時機：
- EN: Use for app screens, dashboards, social screenshots, and live interface mockups.
- 台灣繁中: 用於 App 截圖、儀表板、社群媒體截圖和直播介面。

使用建議：
  - Lock platform, aspect ratio, layout hierarchy, and exact visible text.
  - Specify UI chrome such as status bars, tabs, action rows, or comment layers.
  - 鎖定平台、比例、層級和畫面文字。
  - 明確狀態列、Tab、操作區、留言層等 UI 元素。

常見問題：
  - Avoid vague platform names and generic app mockups.
  - Constrain text readability and platform-specific details.
  - 避免平台描述過泛。
  - 約束文字可讀性和平台特徵。

### Infographic Engine / 資訊圖表引擎

- ID: `infographic-engine`
- Category: Charts & Infographics
- Styles: Infographic, Charts
- Scenes: Education, Tech
- Tags: Infographic, Chart, Education
- Cover: `/images/case334.png`
- 本專案範本連結： https://github.com/irons163/awesome-gpt-image-2-zh/blob/main/docs/templates.md#tpl-infographic
- 參考案例： case 334, case 1, case 8

適用時機：
- EN: Use for explainer graphics, technical diagrams, timelines, and knowledge cards.
- 台灣繁中: 用於解釋圖、技術圖解、時間軸和知識卡片。

使用建議：
  - Define 3-5 modules, information flow, visual hierarchy, and short labels.
  - Use color groups, arrows, icons, and clean spacing to reduce clutter.
  - 定義 3-5 個模組、資訊流、層級和短標籤。
  - 用色塊、箭頭、圖示和留白控制複雜度。

常見問題：
  - Avoid long paragraphs inside the image.
  - Limit module count before adding visual detail.
  - 避免把長段正文塞進畫面。
  - 先限制模組數量，再補視覺細節。

### Scientific Scale Diagram / 科學尺度縮放圖

- ID: `scientific-scale-diagram`
- Category: Charts & Infographics
- Styles: Infographic, Charts, Realistic
- Scenes: Education, Tech
- Tags: Infographic, Chart, Education
- Cover: `/images/case341.jpg`
- 本專案範本連結： https://github.com/irons163/awesome-gpt-image-2-zh/blob/main/docs/templates.md#tpl-infographic
- 參考案例： case 341

適用時機：
- EN: Use when the topic needs micro-to-macro scale comparison and labeled detail windows.
- 台灣繁中: 用於需要從微觀到宏觀展示尺度變化的科普主題。

使用建議：
  - Use 6-8 scale frames and keep each label short.
  - Show units, magnification, and distinct scale detail.
  - 使用 6-8 個尺度框，每個標籤保持短句。
  - 展示單位、倍率和不同尺度的細節。

常見問題：
  - Avoid making every scale frame visually identical.
  - Avoid generic magnifying glass icon layouts.
  - 避免所有尺度框長得一樣。
  - 避免通用放大鏡式佈局。

### Poster Layout System / 海報排版系統

- ID: `poster-layout-system`
- Category: Posters & Typography
- Styles: Poster
- Scenes: Commerce, Social
- Tags: Poster, Typography, Campaign
- Cover: `/images/case345.jpg`
- 本專案範本連結： https://github.com/irons163/awesome-gpt-image-2-zh/blob/main/docs/templates.md#tpl-poster
- 參考案例： case 345, case 5, case 10

適用時機：
- EN: Use for event posters, movie posters, covers, and social campaign visuals.
- 台灣繁中: 用於活動海報、電影海報、封面和社群媒體傳播視覺。

使用建議：
  - Lock subject, headline, layout, palette, and aspect ratio.
  - Make the title hierarchy and primary visual clear.
  - 鎖定主體、標題、版式、配色和比例。
  - 突出標題層級和主視覺。

常見問題：
  - Avoid mixed moodboards or process sheets when asking for one finished poster.
  - Constrain extra text and decorative symbols.
  - 需要成品海報時，避免生成拼貼展示板。
  - 約束多餘文字和裝飾符號。

### Sports Campaign Poster / 運動商業 Campaign

- ID: `sports-campaign-poster`
- Category: Posters & Typography
- Styles: Poster, Realistic
- Scenes: Commerce, Fashion
- Tags: Poster, Campaign, Typography
- Cover: `/images/case350.jpg`
- 本專案範本連結： https://github.com/irons163/awesome-gpt-image-2-zh/blob/main/docs/templates.md#tpl-poster
- 參考案例： case 350, case 3

適用時機：
- EN: Use for sports brand campaigns, athlete posters, and product-led sport visuals.
- 台灣繁中: 用於運動品牌 Campaign、運動員海報和運動產品視覺。

使用建議：
  - Define sport, athlete pose, hero prop, title, and brand palette.
  - Use dramatic light, clean composition, and readable data overlays.
  - 定義運動專案、姿態、核心道具、標題和品牌色。
  - 使用強光影、乾淨構圖和可讀資料層。

常見問題：
  - Avoid wrong equipment and noisy collage.
  - Keep the athlete and hero prop visually dominant.
  - 避免錯誤運動器材和雜亂拼貼。
  - 讓運動員和核心道具佔據主導。

### Conceptual Typography Poster / 概念字型海報

- ID: `conceptual-typography-poster`
- Category: Posters & Typography
- Styles: Poster
- Scenes: Creative, Social
- Tags: Typography, Poster, Style
- Cover: `/images/case355.jpg`
- 本專案範本連結： https://github.com/irons163/awesome-gpt-image-2-zh/blob/main/docs/templates.md#tpl-poster
- 參考案例： case 355

適用時機：
- EN: Use when the exact title must become the main visual structure.
- 台灣繁中: 用於標題文字需要成為主視覺結構的海報。

使用建議：
  - Make typography the hero and spell the title exactly.
  - Tie human figures, objects, or landscapes to the title meaning.
  - 讓字型成為畫面主角，並保證標題拼寫準確。
  - 人物、物體或風景需要服務標題含義。

常見問題：
  - Avoid default word art, unrelated icons, and misspelled title text.
  - Limit the color system to a restrained palette.
  - 避免預設字效、無關圖示和標題錯字。
  - 控制配色數量，保持克制。

### Ink Double Exposure Poster / 水墨雙重曝光海報

- ID: `ink-double-exposure-poster`
- Category: Posters & Typography
- Styles: Poster, Illustration, Classical
- Scenes: Story, History
- Tags: Poster, Classical, Style
- Cover: `/images/case359.jpg`
- 本專案範本連結： https://github.com/irons163/awesome-gpt-image-2-zh/blob/main/docs/templates.md#tpl-poster
- 參考案例： case 359

適用時機：
- EN: Use for poetic portrait posters, ink atmospheres, and layered cultural visuals.
- 台灣繁中: 用於詩意人像海報、水墨氛圍和文化主題視覺。

使用建議：
  - Blend portrait silhouette, ink texture, atmosphere, and negative space.
  - Keep composition quiet, premium, and readable.
  - 融合人像剪影、水墨質感、氛圍和留白。
  - 保持構圖克制、高階、可讀。

常見問題：
  - Avoid cheap fantasy collage and overloaded scenery.
  - Use subtle text or no text unless required.
  - 避免廉價奇幻拼貼和景物堆疊。
  - 非必要時減少文字。

### Nature Science Poster / 自然科普海報

- ID: `nature-science-poster`
- Category: Posters & Typography
- Styles: Poster, Infographic
- Scenes: Education
- Tags: Poster, Education, Style
- Cover: `/images/case339.jpg`
- 本專案範本連結： https://github.com/irons163/awesome-gpt-image-2-zh/blob/main/docs/templates.md#tpl-poster
- 參考案例： case 339

適用時機：
- EN: Use for natural subjects that need a premium, clean science poster feel.
- 台灣繁中: 用於自然主題的高階、乾淨科普海報。

使用建議：
  - Use a clear subject, minimal copy, soft shadows, and disciplined whitespace.
  - Keep the scientific label short and visible.
  - 使用清晰主體、少量文案、柔和陰影和充足留白。
  - 讓科普標籤短而清楚。

常見問題：
  - Avoid heavy advertising language.
  - Avoid dense encyclopedia blocks.
  - 避免廣告感太重。
  - 避免密集百科正文。

### Product Commerce Visual / 商品商業視覺

- ID: `product-commerce-visual`
- Category: Products & E-commerce
- Styles: Product, Realistic
- Scenes: Commerce, Food
- Tags: Product, Commerce, Packaging
- Cover: `/images/case373.jpg`
- 本專案範本連結： https://github.com/irons163/awesome-gpt-image-2-zh/blob/main/docs/templates.md#tpl-product
- 參考案例： case 373, case 358

適用時機：
- EN: Use for product hero shots, packaging visuals, detail pages, and sales layouts.
- 台灣繁中: 用於商品主圖、包裝視覺、詳情頁和銷售賣點排版。

使用建議：
  - Define product, selling points, material, scene, lighting, and layout blocks.
  - Separate hero product, benefit labels, and supporting props.
  - 定義商品、賣點、材質、場景、光線和版塊。
  - 區分主商品、賣點標籤和輔助道具。

常見問題：
  - Avoid random props that weaken product recognition.
  - Constrain packaging text and claim wording.
  - 避免無關道具削弱商品識別。
  - 約束包裝文字和賣點表達。

### Personalized Beauty Report / 個性化美妝報告

- ID: `personalized-beauty-report`
- Category: Products & E-commerce
- Styles: Product, UI
- Scenes: Commerce, Fashion
- Tags: Product, Layout, Style
- Cover: `/images/case353.jpg`
- 本專案範本連結： https://github.com/irons163/awesome-gpt-image-2-zh/blob/main/docs/templates.md#tpl-product
- 參考案例： case 353

適用時機：
- EN: Use for beauty recommendations, skin reports, shopping assistants, and lifestyle product cards.
- 台灣繁中: 用於美妝推薦、膚質報告、導購助手和生活方式商品卡片。

使用建議：
  - Use a report-like hierarchy with diagnosis, recommendation, and product cards.
  - Keep product images, labels, and ratings aligned.
  - 使用診斷、推薦和商品卡片的報告層級。
  - 對齊商品圖、標籤和評分。

常見問題：
  - Avoid medical claims and unreadable dense notes.
  - Keep recommendation logic simple.
  - 避免醫療化結論和難讀小字。
  - 保持推薦邏輯清楚。

### Brand Identity Package / 品牌身份包

- ID: `brand-identity-package`
- Category: Brand & Logos
- Styles: Brand
- Scenes: Commerce
- Tags: Brand, Logo, Identity
- Cover: `/images/case354.jpg`
- 本專案範本連結： https://github.com/irons163/awesome-gpt-image-2-zh/blob/main/docs/templates.md#tpl-brand
- 參考案例： case 354

適用時機：
- EN: Use for logo systems, brand boards, visual identity kits, and application mockups.
- 台灣繁中: 用於 Logo 系統、品牌板、VI 套件和應用樣機。

使用建議：
  - Define brand name, positioning, palette, typography, logo usage, and touchpoints.
  - Ask for a coherent board with aligned applications.
  - 定義品牌名、定位、配色、字型、Logo 用法和觸點。
  - 要求視覺板中的應用統一對齊。

常見問題：
  - Avoid unrelated logo variants and inconsistent palettes.
  - Keep brand text accurate.
  - 避免無關 Logo 變體和混亂配色。
  - 保持品牌文字準確。

### Brand Touchpoint Board / 品牌觸點視覺板

- ID: `brand-touchpoint-board`
- Category: Brand & Logos
- Styles: Brand, Product
- Scenes: Commerce, Social
- Tags: Brand, Identity, Campaign
- Cover: `/images/case362.jpg`
- 本專案範本連結： https://github.com/irons163/awesome-gpt-image-2-zh/blob/main/docs/templates.md#tpl-brand
- 參考案例： case 362

適用時機：
- EN: Use for multi-touchpoint campaign boards and brand rollout previews.
- 台灣繁中: 用於多觸點 Campaign 展示和品牌落地預覽。

使用建議：
  - Specify touchpoint list, shared visual rules, and mockup arrangement.
  - Use one palette and one typography logic across all panels.
  - 指定觸點清單、統一視覺規則和樣機排列。
  - 讓所有面板共享配色和字型邏輯。

常見問題：
  - Avoid mixing many unrelated campaign styles.
  - Limit touchpoints if readability drops.
  - 避免混入多個無關 Campaign 風格。
  - 可讀性下降時減少觸點數量。

### Architecture & Space / 建築與空間

- ID: `architecture-space`
- Category: Architecture & Spaces
- Styles: Architecture
- Scenes: Travel, Commerce
- Tags: Architecture, Interior, Map
- Cover: `/images/case331.png`
- 本專案範本連結： https://github.com/irons163/awesome-gpt-image-2-zh/blob/main/docs/templates.md#tpl-architecture
- 參考案例： case 331, case 11

適用時機：
- EN: Use for interiors, architecture renders, city maps, spatial plans, and environment concepts.
- 台灣繁中: 用於室內、建築表現、城市地圖、空間規劃和環境概念圖。

使用建議：
  - Define viewpoint, scale, material, lighting, and spatial function.
  - For maps, specify landmarks, labels, border decoration, and visual accuracy level.
  - 定義視角、尺度、材質、光線和空間功能。
  - 地圖需要指定地標、標籤、邊框裝飾和準確度。

常見問題：
  - Avoid impossible perspectives unless the output is conceptual.
  - Lock map label language and relative placement.
  - 概念圖之外要避免不合理透視。
  - 鎖定地圖示籤語言和相對位置。

### Realistic Photography / 寫實攝影

- ID: `realistic-photography`
- Category: Photography & Realism
- Styles: Photography, Realistic
- Scenes: Fashion, Commerce
- Tags: Photography, Realistic, Lens
- Cover: `/images/case377.jpg`
- 本專案範本連結： https://github.com/irons163/awesome-gpt-image-2-zh/blob/main/docs/templates.md#tpl-photo
- 參考案例： case 377

適用時機：
- EN: Use for portraits, street photos, product photography, and cinematic realism.
- 台灣繁中: 用於人像、街拍、商品攝影和電影感寫實。

使用建議：
  - Specify camera distance, lens, light source, texture, background, and motion.
  - Use believable imperfections for documentary realism.
  - 指定機位、鏡頭、光源、質感、背景和動作。
  - 加入可信的小瑕疵增強紀實感。

常見問題：
  - Avoid over-polished plastic skin unless commercial beauty is required.
  - Add negative constraints for hands, text, and anatomy when needed.
  - 商業美妝之外，避免過度磨皮。
  - 需要時加入手部、文字、結構類負面約束。

### Street Accident Moment / 街頭意外瞬間攝影

- ID: `street-accident-moment`
- Category: Photography & Realism
- Styles: Photography, Realistic
- Scenes: Travel, Social
- Tags: Photography, Realistic, Scene
- Cover: `/images/case376.jpg`
- 本專案範本連結： https://github.com/irons163/awesome-gpt-image-2-zh/blob/main/docs/templates.md#tpl-photo
- 參考案例： case 376

適用時機：
- EN: Use for candid street moments, accidental spills, documentary phone shots, and fast action.
- 台灣繁中: 用於街頭抓拍、意外潑灑、手機紀實和快速動作。

使用建議：
  - Describe the exact moment, camera height, motion blur, and street context.
  - Add negative constraints for staged poses and fake ad lighting.
  - 描述具體瞬間、機位高度、運動模糊和街景。
  - 加入避免擺拍和廣告棚拍感的限制。

常見問題：
  - Avoid too-clean compositions.
  - Keep the event plausible and grounded.
  - 避免畫面過於乾淨。
  - 讓事件看起來可信。

### Illustration & Art Style / 插畫與藝術風格

- ID: `illustration-art-style`
- Category: Illustration & Art
- Styles: Illustration
- Scenes: Story, Creative
- Tags: Illustration, Art, Style
- Cover: `/images/case346.jpg`
- 本專案範本連結： https://github.com/irons163/awesome-gpt-image-2-zh/blob/main/docs/templates.md#tpl-illustration
- 參考案例： case 346, case 6

適用時機：
- EN: Use for anime, watercolor, ink, decorative art, and style experiments.
- 台灣繁中: 用於動漫、水彩、水墨、裝飾畫和風格實驗。

使用建議：
  - Define composition, subject, palette, brush material, mood, and rendering depth.
  - For reference images, state what must be preserved.
  - 定義構圖、主體、配色、筆觸材質、情緒和完成度。
  - 參考圖任務需要說明保留哪些特徵。

常見問題：
  - Avoid style-only prompts without composition.
  - Lock character identity when using references.
  - 避免只寫風格，不寫構圖。
  - 使用參考圖時鎖定角色識別。

### Character Design Sheet / 角色設定表

- ID: `character-design-sheet`
- Category: Characters & People
- Styles: Character, Illustration
- Scenes: Story
- Tags: Character, Pose, Style
- Cover: `/images/case347.jpg`
- 本專案範本連結： https://github.com/irons163/awesome-gpt-image-2-zh/blob/main/docs/templates.md#tpl-character
- 參考案例： case 347

適用時機：
- EN: Use for character sheets, pose grids, action breakdowns, and identity references.
- 台灣繁中: 用於角色設定表、動作網格、動作拆解和一致性參考。

使用建議：
  - Define identity anchors, outfit, proportions, pose count, and sheet layout.
  - Keep face, hairstyle, and costume details consistent.
  - 定義身份錨點、服裝、比例、動作數量和版式。
  - 保持臉、髮型和服裝細節一致。

常見問題：
  - Avoid changing costume details between poses.
  - Limit pose count if the sheet becomes crowded.
  - 避免不同動作裡服裝細節變化。
  - 畫面擁擠時減少動作數量。

### 3D Collectible Toy / 3D 收藏玩具

- ID: `3d-collectible-toy`
- Category: Characters & People
- Styles: 3D, Character
- Scenes: Commerce, Creative
- Tags: Character, 3D, Style
- Cover: `/images/case378.jpg`
- 本專案範本連結： https://github.com/irons163/awesome-gpt-image-2-zh/blob/main/docs/templates.md#tpl-character
- 參考案例： case 378

適用時機：
- EN: Use for premium collectible figures, avatar toys, blind-box characters, and 3D display renders.
- 台灣繁中: 用於高階收藏玩具、頭像公仔、潮玩角色和 3D 展示圖。

使用建議：
  - Preserve face and outfit anchors from the reference.
  - Specify material, packaging, base, lighting, and collectible scale.
  - 保留參考圖中的臉和服裝錨點。
  - 指定材質、包裝、底座、光線和收藏比例。

常見問題：
  - Avoid generic toy bodies without identity details.
  - Keep packaging text minimal and accurate.
  - 避免沒有身份細節的通用玩具。
  - 包裝文字保持少量且準確。

### Scene Storytelling / 場景敘事

- ID: `scene-storytelling`
- Category: Scenes & Storytelling
- Styles: Scenes, Illustration
- Scenes: Story, Social
- Tags: Scene, Story, Storyboard
- Cover: `/images/case330.png`
- 本專案範本連結： https://github.com/irons163/awesome-gpt-image-2-zh/blob/main/docs/templates.md#tpl-scene
- 參考案例： case 330

適用時機：
- EN: Use for storyboards, worldbuilding, live scenes, and emotional narrative frames.
- 台灣繁中: 用於分鏡、世界觀、直播場景和情緒敘事畫面。

使用建議：
  - Define who, where, when, conflict, emotion, and camera framing.
  - Use scene details to support narrative rather than decoration.
  - 定義人物、地點、時間、衝突、情緒和機位。
  - 讓場景細節服務故事。

常見問題：
  - Avoid generic fantasy backgrounds.
  - Keep narrative cues visible in the frame.
  - 避免通用幻想背景。
  - 讓故事線索在畫面裡可見。

### History & Classical Themes / 歷史與古風題材

- ID: `history-classical-themes`
- Category: History & Classical Themes
- Styles: History, Classical, Illustration
- Scenes: History, Story
- Tags: History, Classical, Scroll
- Cover: `/images/case375.jpg`
- 本專案範本連結： https://github.com/irons163/awesome-gpt-image-2-zh/blob/main/docs/templates.md#tpl-history
- 參考案例： case 375, case 338

適用時機：
- EN: Use for ancient Chinese themes, scrolls, dynasty clothing, poetry visuals, and historical scenes.
- 台灣繁中: 用於古風題材、長卷、朝代服飾、詩詞視覺和歷史場景。

使用建議：
  - Specify dynasty, clothing system, object references, layout format, and cultural mood.
  - Use scroll, album page, or poster format deliberately.
  - 指定朝代、服飾制度、器物參考、版式和文化氣質。
  - 明確長卷、冊頁或海報形式。

常見問題：
  - Avoid mixing dynasties when historical accuracy matters.
  - Constrain random modern props.
  - 需要歷史準確時，避免朝代混搭。
  - 約束隨機現代物件。

### Document & Publishing / 檔案與出版物

- ID: `document-publishing`
- Category: Documents & Publishing
- Styles: Documents, Infographic
- Scenes: Education, Tech
- Tags: Document, Publishing, Layout
- Cover: `/images/case360.jpg`
- 本專案範本連結： https://github.com/irons163/awesome-gpt-image-2-zh/blob/main/docs/templates.md#tpl-document
- 參考案例： case 360

適用時機：
- EN: Use for white papers, manuals, encyclopedic plates, report pages, and publication systems.
- 台灣繁中: 用於白皮書、手冊、百科圖鑑、報告頁面和出版系統。

使用建議：
  - Define page size, columns, table of contents, figure system, and typography hierarchy.
  - Use readable headings, tables, labels, and page rhythm.
  - 定義頁面尺寸、分欄、目錄、圖表系統和字型層級。
  - 使用可讀標題、表格、標籤和頁面節奏。

常見問題：
  - Avoid tiny dense text.
  - Keep charts and captions aligned to the page grid.
  - 避免密集小字。
  - 讓圖表和說明對齊頁面網格。

### Concept Product Breakdown / 概念產品研發拆解

- ID: `concept-product-breakdown`
- Category: Other Use Cases
- Styles: Other Use Cases, Product
- Scenes: Creative, Tech
- Tags: Creative, R&D, Special
- Cover: `/images/case370.jpg`
- 本專案範本連結： https://github.com/irons163/awesome-gpt-image-2-zh/blob/main/docs/templates.md#tpl-other
- 參考案例： case 370, case 361

適用時機：
- EN: Use for experimental prompt tasks, R&D boards, exploded diagrams, and unusual visual systems.
- 台灣繁中: 用於實驗型任務、研發視覺板、拆解圖和特殊視覺系統。

使用建議：
  - Define the artifact type, components, labels, material logic, and final presentation format.
  - Use clear callouts and a controlled technical style.
  - 定義產物型別、元件、標籤、材質邏輯和展示格式。
  - 使用清晰標註和受控技術風格。

常見問題：
  - Avoid unspecified mixed tasks.
  - Keep labels short and component relationships visible.
  - 避免任務邊界過泛。
  - 標籤要短，元件關係要清楚。

## 分類

- UI & Interfaces: UI 與介面 | Apps, websites, dashboards, social screenshots, and product interfaces.
- Charts & Infographics: 圖表與資訊視覺化 | Infographics, knowledge maps, technical explainers, and structured diagrams.
- Posters & Typography: 海報與排版 | Event posters, covers, type-driven visuals, and strong layout compositions.
- Products & E-commerce: 商品與電商 | Product shots, detail pages, packaging, selling points, and ads.
- Brand & Logos: 品牌與標誌 | Logos, identity systems, brand touchpoints, and campaign visuals.
- Architecture & Spaces: 建築與空間 | Architecture renders, interiors, city maps, and spatial concepts.
- Photography & Realism: 攝影與寫實 | Portraits, phone photography, film texture, and commercial photography.
- Illustration & Art: 插畫與藝術 | Illustration, art styles, material experiments, and decorative images.
- Characters & People: 人物與角色 | Character design, pose references, cards, and 3D toys.
- Scenes & Storytelling: 場景與敘事 | Storyboards, narrative scenes, livestream frames, and worldbuilding.
- History & Classical Themes: 歷史與古風題材 | Classical scrolls, historical figures, traditional themes, and poetry visuals.
- Documents & Publishing: 檔案與出版物 | White papers, manuals, encyclopedic plates, and publishing layouts.
- Other Use Cases: 其他應用場景 | Creative experiments, special tasks, mixed workflows, and practical cases.

## 風格

- 3D: 3D | Keywords: 3d, toy, render, 玩具
- Architecture: 建築 | Keywords: None
- Brand: 品牌 | Keywords: brand, logo, identity, 品牌, 標誌
- Character: 角色 | Keywords: character, avatar, pose, 角色, 人物
- Characters: 人物 | Keywords: None
- Charts: 圖表 | Keywords: None
- Classical: 古典 | Keywords: classical, dynasty, history, 古風, 歷史
- Documents: 檔案 | Keywords: None
- History: 歷史 | Keywords: None
- Illustration: 插畫 | Keywords: illustration, painting, watercolor, 插畫, 繪畫
- Infographic: 資訊圖表 | Keywords: infographic, diagram, 資訊圖表, 圖解
- Other Use Cases: 其他應用場景 | Keywords: None
- Photography: 攝影 | Keywords: None
- Poster: 海報 | Keywords: poster, cover, typography, 海報, 封面
- Product: 商品 | Keywords: product, packaging, 商品, 包裝
- Products: 商品 | Keywords: None
- Realistic: 寫實 | Keywords: photo, realistic, camera, 寫真, 寫實
- Scenes: 場景 | Keywords: None
- UI: 介面 | Keywords: ui, interface, dashboard, 介面, 截圖

## 情境

- Creative: 創意 | Keywords: None
- Tech: 科技 | Keywords: ai, rag, tech, data, 技術, 資料
- Commerce: 商業 | Keywords: product, brand, ad, campaign, 商品, 商業, 廣告
- Education: 教育 | Keywords: guide, atlas, science, learning, 學習, 科普
- Social: 社群媒體 | Keywords: social, x , wechat, 朋友圈, 社群媒體
- Fashion: 時尚 | Keywords: fashion, clothing, portrait, 服飾, 寫真
- Food: 食品飲品 | Keywords: food, drink, coffee, tea, 餐廳, 咖啡, 茶
- Travel: 旅行 | Keywords: city, map, street, 城市, 地圖, 街頭
- Story: 敘事 | Keywords: story, scene, world, 故事, 場景
- History: 歷史 | Keywords: history, dynasty, ancient, 歷史, 古希臘, 唐

