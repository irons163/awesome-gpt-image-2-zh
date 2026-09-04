> [返回 README 首頁](../README.md) | [完整畫廊總覽](./gallery.md) | [宣告與公眾帳號](./disclaimer.md)

<a name="section-templates"></a>

## 🧩 實務提示詞範本與常見問題指南

> 大家好，我是你們的無情逆向機器。為了讓大家能直接“開箱即用”，我把這 393 個案例扒了個底朝天，硬生生提煉出了 21 套**工業級提示詞範本**。
> 說實話，整理這些規則差點給我幹廢了，但跑通之後真的很香！每一套範本都自帶“防坑指南”，直接複製填空，再也不用玄學抽卡了。

<a name="tpl-ui"></a>

### UI與介面

**常規範本**

```text
為[產品型別]生成一張[平台，如 iOS/Android/Web]介面圖。
核心功能：[功能點A]、[功能點B]、[功能點C]。
視覺風格：[極簡/科技/擬物]，主色[顏色]，強調色[顏色]。
佈局：[頂部導航/雙欄/卡片流]，資訊層級清晰，留白充足。
輸出：高保真UI截圖，文字清晰可讀，比例[9:16/16:9]。
```

**JSON 進階範本（推薦給 Agent 呼叫）**

```json
{
  "type": "UI Screenshot",
  "platform": "iOS",
  "product": "Fitness App",
  "layout": "Card-based feed with bottom tab bar",
  "style": {
    "theme": "Dark Mode",
    "primary_color": "Neon Green",
    "typography": "Clean sans-serif"
  },
  "content": {
    "header": "Today's Activity",
    "cards": [
      {"title": "Running", "data": "5.2 km", "button": "Start"},
      {"title": "Calories", "data": "340 kcal"}
    ]
  },
  "constraints": "High fidelity, readable text, 9:16 aspect ratio"
}
```

**截圖生成範本**

```text
生成一張[平台，如 X/抖音/小红书/微信朋友圈]內容截圖，[深色/淺色]模式。
整體比例：[9:16 / 3:4 / 1:1]，手機截圖風格。

核心內容：
- 帳號資訊：[頭像描述 / 使用者名稱 / 認證標識]
- 正文內容：[具體文字內容，包含指定中文]
- 互動資料：[按讚/留言/轉發/收藏數量]

介面元素：
- 頂部：[狀態列/導覽列/搜尋欄]
- 底部：[操作欄/Tab欄/輸入框]
- 附加：[浮窗/彈幕/禮物特效/購物車卡片]

約束：文字必須準確顯示指定的中文，禁止亂碼和佔位文字，比例固定。
輸出：高仿社交平台截圖，文字清晰可讀。
```

**直播介面範本**

```text
生成一張[平台，如抖音/快手/B站]直播介面截圖。
主播：[人物描述/名稱]，姿態：[坐姿/站立/動作]，服裝：[服裝描述]。
背景：[直播間背景描述]，燈光：[暖色/冷色/混合]。

UI疊加層：
- 頂部：主播頭像 + 關注按鈕 + 線上人數 + 排名/熱值
- 左下：彈幕/留言列表（[N]條，內容示例）
- 右下或中部：商品卡片 / 禮物特效 / PK進度條
- 底部：輸入框 + 功能圖示（分享/按讚/禮物/購物車）

風格：[寫實直播截圖/高保真UI/暗黑系/粉嫩系]，比例 9:16。
約束：文字清晰可讀，彈幕內容合理，介面元素不遮擋主播面部。
輸出：高仿直播截圖畫面。
```
**避坑指南**

- **不要給模糊指令**：明確"平台 + 比例 + 佈局"，否則模型會像個實習生一樣亂排版。
- **強制文字鎖定**：要求"文字絕對可讀，必須顯示指定的中文"，避免出現亂碼按鈕和毫無意義的火星文。
- **截圖區分平台特徵**：X（Twitter）有藍勾認證、轉發/引用區分；抖音有音樂碟片和按讚動畫；小红书有雙列瀑布流特徵。生成前指定平台，否則模型會混搭。
- **直播介面先定場景**：帶貨直播和才藝直播的UI佈局差異很大（帶貨右上角有商品列表，才藝直播偏重在彈幕互動），先鎖定直播型別再填細節。
- **中空介面比例鎖定**：車機/智慧家居等特殊螢幕有固定比例（如21:9），必須寫在最前面，否則模型預設出手機9:16。

<a name="tpl-infographic"></a>

### 圖表與資訊視覺化

**常規範本**

```text
生成[主題：明確、具體，避免寬泛。例如：“老年人日常健康管理指南”而非“健康”]資訊圖表，目標讀者為[人群:細化人群特徵，如年齡段、職業、興趣等]。
結構：標題區 + [3-5]個模組（每模組含圖示、短標題、1-2句說明,模組間邏輯：可用箭頭、顏色區分或連線線提示資訊流或關係等適當的方式）。
圖表型別：[流程圖/對比圖/關係圖/時間軸]。
風格：[專業報告/科普插畫/兒童教育等]，主色[顏色]，背景[淺色/深色]。
輸出：資訊層級清晰、可讀性高的中文資訊圖表。
```

**JSON 進階範本（推薦給 Agent 呼叫）**

```json
{
  "type": "Infographic",
  "topic": "Urban Metabolism",
  "audience": "General Public",
  "structure": {
    "title_area": "城市生命系统图谱",
    "layout": "Isometric cutaway, 12 numbered panels",
    "modules": [
      {"title": "能源", "icon": "lightning", "text": "Power flows"},
      {"title": "水循环", "icon": "water_drop", "text": "Water flows"}
    ]
  },
  "style": {
    "aesthetic": "Scientific atlas",
    "colors": "Low saturation, color-coded flows",
    "background": "Light paper texture"
  },
  "constraints": "No cyberpunk, no gibberish text, strict structural layout"
}
```

**尺度縮放科學資訊圖表範本**

```text
為[主題]生成一張科學尺度縮放資訊圖表。
結構：6-8 個圓形或六邊形框，按從微觀到宏觀的尺度遞進排列。
每個框包含：尺度名稱、3-5 個詞的洞察、測量單位或放大倍率，以及該尺度下的高細節 3D 渲染。
用細線連線各尺度，避免重複層級。標題使用“[主題]：AT EVERY SCALE”或“ZOOM: THE WORLD OF [主題]”。
風格：科學編輯資訊圖表、精準微距光、清晰層級、文字短而可讀。
約束：不要通用放大鏡圖示，不要把所有尺度畫成同一大小，不要塞長段正文。
```

**避坑指南**

- **控制模組數量**：強制定製“模組數量”和“圖表型別”，能極大降低畫面混亂和資訊溢位。
- **文案克制**：圖表場景優先使用短句文案，千萬不要把大段正文塞進畫面裡，模型不是排版工人。

<a name="tpl-poster"></a>

### 海報與排版

**常規範本**

```text
設計一張[活動/產品/電影]海報，主題為[主題詞]。
主視覺：[主體元素]，標題文案：[標題]，副標題：[副標題]。
版式：[居中/左對齊/對角構圖]，風格：[復古/未來/極簡]。
色彩：[主色 + 輔色]，氛圍：[情緒關鍵詞]。
輸出：可用於社群媒體傳播的高解析度海報。
```

**運動商業 Campaign 範本**

```text
設計一張[運動專案/健身品類]商業 Campaign 海報。
主體：[運動員/模特/產品道具]，姿態：[坐姿/衝刺/揮拍/力量動作]。
核心道具：[球拍/啞鈴/球鞋/球衣]，以誇張比例或對角構圖成為視覺錨點。
版式：[單張強主視覺/三聯畫/資料塗鴉海報]。
大字標題："[主標題]"，輔助文案："[短句/資料/精神口號]"。
視覺風格：高階運動品牌廣告，強光影，反光地面，乾淨構圖，品牌化配色[主色+輔助色]。
約束：主體清晰，文字可讀，色調統一，不要雜亂拼貼，不要生成錯誤運動器材。
輸出：1:1 或 4:5，適合社群媒體傳播的運動商業視覺。
```

**概念字型海報範本**

```text
Create ONE finished premium conceptual typography poster for the exact title:

"[标题/词语/短句]"

Single poster only. No moodboard, grid, presentation board, mockup, captions, prompt text, process sheet, or sample labels.

The title must be the dominant visual structure of the poster: huge, readable, powerful, and spelled exactly. Do not translate, shorten, replace, or misspell it. Do not add other large readable text.

Silently interpret the title's meaning, mood, cultural aura, symbolic associations, psychological tension, and visual rhythm. Turn that interpretation into one strong visual metaphor.

Typography is the hero. Design custom-looking letterforms whose weight, width, contrast, spacing, rhythm, distortion, negative space, edge quality, and ink texture express the temperament of the title. The type should feel intentionally designed, not like a default font.

If the title refers to a widely known person, make a large editorial portrait or half-body figure a major visual presence, occupying roughly 40%-70% of the composition. The figure should interact with the typography: overlapping the letters, emerging from them, being framed by them, casting shadows on them, breaking through them, or being partially hidden behind them.

For abstract or non-person titles, use a human figure, landscape, object, or atmospheric setting only when it strengthens the meaning. It must interact with the typography and deepen the concept, not decorate it.

Use a restrained 4-6 color system matched to the theme: dominant background color, primary typography color, figure / landscape tone, emotional accent color, muted support color, and subtle paper / ink texture tone.

Composition style: high-end editorial poster, museum-quality graphic design, dramatic scale, strong hierarchy, few elements, intelligent whitespace, bold flat color areas, sharp cropping, silkscreen / lithograph / risograph grain, paper fibers, subtle ink imperfections, refined visual tension.

Avoid generic word art, glossy 3D lettering, random icons, stock-photo realism, cluttered collage, excessive grunge, tourist clichés, official logos, copied slogans, copied campaign aesthetics, unrelated text, and misspelled typography.
```

**多風格簽名選擇海報範本**

> 來源參考：[signature-image-prompts-gpt-image-2.md](https://github.com/zaizhi-1112/ai-image-extension-playbook/blob/main/signature-image-prompts-gpt-image-2.md) / [@liyue_ai](https://x.com/liyue_ai)

```text
你是一個高階簽名設計系統 + 風格人格視覺系統。

輸入：
姓名：[姓名/暱稱]

任務：
基於姓名自動生成一張 9:16 豎版「多風格簽名選擇海報」。
目標是把姓名轉譯成 6 種具有筆勢、氣質和力量感的簽名方案。

隱藏分析：
1. 分析姓名字形：疏密、橫豎比例、重心、連筆空間、草寫空間。
2. 推斷氣質：清冷、張揚、克制、商業、文藝、鬆弛、鋒利、高階。
3. 為每個簽名先設定書寫行為：起筆、連筆、節奏、結構變形、收筆。

版式：
- 純白或極淺灰漸變背景，留白不少於 40%
- 頂部大標題：[姓名] · 簽名風格選擇
- 副標題：不同筆勢，不同氣場
- 中部使用 2 列 × 3 行卡片網格
- 底部小字：選一個，作為你的專屬簽名。

卡片規範：
- 每張卡片統一尺寸、統一間距、整體對齊
- 輕微圓角 8-16px
- 極細描邊或無邊框
- 極輕陰影
- 純白微差、極淺灰、宣紙或磨砂質感
- 視覺目標接近高階雜誌排版，避免強 UI 感

6 種簽名：
1. 極簡理性：接近品牌簽名，筆畫克制，留白清晰
2. 狂放張力：強連筆，速度感強，尾筆拉伸
3. 鬆弛隨性：手寫感明顯，自然舒展，親和輕鬆
4. 東方行草：飛白、墨感、節奏起伏明顯
5. 鋒利結構：幾何切角，斷裂感，冷靜克制
6. 實驗風格：部分不可讀，結構重塑，先鋒個性

每張卡片必須包含：
- 編號
- 風格名稱
- 大尺寸簽名
- 一句短氣質說明
- 一個極輕微點綴色

光影與質感：
高階棚拍光、柔光環境、細膩陰影、乾淨空氣感。
整體以黑、灰、白為主，點綴色克制。

禁止項：
不要字型拼貼，不要普通書法字，不要顏色雜亂，不要簽名太小，不要排版鬆散，不要缺乏筆勢，不要範本拼接感。
```

**單款簽名提取範本**

```text
從輸入圖中的[位置/編號/風格名]簽名裡，提取該簽名的核心筆勢，生成一張純簽名圖。

要求：
- 只保留簽名主體，不生成海報卡片、標題、副標題或說明文字
- 保留原簽名的起筆、連筆、結構傾斜、飛白和收筆節奏
- 背景為純白或極淺米白
- 簽名居中，尺寸充足，邊緣留白乾淨
- 墨色為深黑或墨黑，帶自然筆鋒、輕微墨痕和真實手寫壓力變化
- 輸出適合繼續臨摹、收藏或二次設計的高畫質純簽名圖

避免：
不要新增多種簽名，不要變成字型展示，不要加邊框，不要加裝飾元素，不要弱化原有筆勢。
```

**簽名練習拆解圖範本**

```text
基於輸入的[簽名圖/簽名風格]，生成一張簽名練習拆解圖。

目標：
幫助使用者用黑筆在紙上練好這個簽名，拆解每一筆的書寫路徑、順序、力度和節奏。

畫面結構：
- 豎版教學圖或橫版練習板
- 頂部放最終簽名小樣
- 中部用 8-12 個步驟拆解關鍵筆畫
- 每個步驟展示目前筆畫、運動方向箭頭、起筆點、停頓點、收筆點
- 下方展示完整連寫路徑和 3-5 行練習建議

拆解要求：
- 每一筆都要對應簽名主體中的真實筆勢
- 標出快寫、慢寫、重壓、輕提、轉折、回鉤、飛白、長甩尾
- 展示從基礎骨架到完整簽名的漸進過程
- 說明字間連線邏輯和整體重心變化

視覺風格：
白紙背景、黑色手寫線條、紅色或藍色教學箭頭、清晰編號、練習冊質感。

避免：
不要只給成品圖，不要省略關鍵筆畫，不要把步驟畫成隨機塗鴉，不要生成無關書法字帖。

**中文版：概念字型海報範本**

```text
為以下標題生成一張完成度極高的高階概念字型海報，只需要一張。

標題：「[標題/詞語/短句]」

只需要一張海報。不要 moodboard、不要網格排版、不要展示板、不要樣機、不要說明文字、不要過程稿、不要樣張標籤。

標題必須是海報的主視覺結構：巨大、可讀、有力量、拼寫完全正確。不要翻譯、縮短、替換或拼錯標題。不要新增其他大段可讀文字。

深入理解標題的含義、情緒、文化氛圍、符號關聯、心理張力和視覺節奏。把這種理解轉化成一個強有力的視覺隱喻。

字型是主角。設計定製的字形，其字重、字寬、對比度、間距、節奏、變形、負空間、邊緣質感和墨跡紋理必須表達標題的氣質。字型應該看起來經過精心設計，而不是一個預設字型。

如果標題指向一個廣為人知的人物，讓一個大型編輯肖像或半身人物成為主要的視覺存在，佔據構圖的 40%-70%。人物必須與字型互動：重疊字母、從字母中浮現、被字母框住、在字母上投下陰影、打破字母、或部分隱藏在字母后面。

對於抽象或非人物標題，只有當人像、風景、物體或氛圍場景能強化意義時才使用。它必須與字型互動並深化概念，而不是裝飾它。

使用受限制的 4-6 色調色盤來匹配主題：主背景色、主字型色、人物/風景色調、情感強調色、柔和輔助色、微妙的紙張/墨跡紋理色。

構圖風格：高階編輯海報、博物館級平面設計、戲劇性尺度、強層級、少元素、聰明留白、大膽平色區域、銳利裁切、絲網/平版/孔版印刷顆粒、紙纖維、微妙油墨瑕疵、精煉視覺張力。

避免：通用字效、光澤 3D 字型、隨機圖示、素材庫寫實、雜亂拼貼、過度髒舊、旅遊明信片陳詞濫調、官方標誌、抄襲標語、抄襲 Campaign 美學、無關文字和拼寫錯誤的字型。

```

**水墨雙重曝光人物海報範本**

```text
生成一張[人物/角色/品牌主理人/運動員]的水墨雙重曝光人物海報。
畫幅：9:16 豎版，高階電影海報構圖。
主體結構：
- 上半區：放大的人物頭部、面部輪廓或半身剪影，形成最強識別錨點。
- 中下區：同一人物的全身或半身主體，姿態為[站姿/動作姿態/凝視鏡頭]。
- 剪影內部：融合[關鍵場景]、[象徵物]、[敘事片段]、[環境紋理]，形成雙重曝光敘事。
視覺連線：用雲霧、水墨擴散、飛白邊緣、負空間和柔和明暗過渡，把上方剪影、內部拼貼和下方主體連成一條從上到下的視覺動線。
風格：東方水墨美學 + 寫實電影感，克制、高階、留白充足，層次豐富但不雜亂。
文字：可加入[標題/姓名/短句]，必須少量、可讀、像海報題簽而不是資訊圖表說明。
約束：不要硬拼貼，不要把背景塞滿，不要廉價武俠特效，不要複製真實海報版式，不要讓剪影和主體互相搶焦點。
輸出：海報級完成圖，主體清晰，水墨邊緣自然，敘事元素與人物身份強相關。
```

**自然科普海報範本**

```text
你是一個高階自然科普海報生成系統，目標是為稀有動物、昆蟲、爬行動物、哺乳動物或其他小眾生物生成 Apple keynote 風格的高階科普視覺海報。

整體視覺方向：
生成一張 9:16 豎版高階科普海報，畫面採用極簡、純白、乾淨、現代、Apple 式產品發布海報語言。背景應為純白或極淺灰白漸變，保持大量留白。整體設計應具備高階感、克制感、視覺衝擊力和科學展示感。

核心設計原則：
1. 主體動物必須被極度放大，成為畫面最強視覺中心。
2. 主體應具有強烈立體感、真實質感、高畫質細節和柔和棚拍光影。
3. 海報資訊要少而準，避免擁擠。
4. 不使用傳統資訊圖表的卡片、圓角框、複雜底紋、淡黃色紙張質感或裝飾性邊框。
5. 底部資訊區只使用四列極簡 icon + 標題 + 短說明，透過細豎線分隔。
6. 文字排版要像高階發布會視覺，標題巨大，副標題克制，正文小而清晰。
7. 風格關鍵詞：Apple-inspired, premium editorial, pure white background, hero subject, clean typography, minimal infographic, high-end science poster.

畫面結構：
頂部左側為標題區：
中文大標題：{中文物種名}
中文副標題：{一句有吸引力的物種定位}
細短橫線
英文名：{英文物種名}
分佈資訊：主要分佈：{分佈區域}

中部與下中部為主體視覺：
生成一個超高畫質、真實、具有強烈立體感的 {中文物種名}。
主體應占據畫面 50% 到 70% 的視覺面積。
主體姿態應具有展示性、力量感或識別度。
保持白色背景，不新增複雜自然環境。
可以保留少量必要承託物，例如樹枝、岩石、雪地、沙土或木皮，但必須簡潔。
主體要有真實陰影，使其像高階產品攝影一樣立在畫面中。

底部資訊區：
用四個極簡資訊欄目展示科普資訊。
每個欄目包含：
一個細線 icon
一個彩色小標題
一段 1 到 3 行短文字
欄目之間用極細淺灰豎線分隔。
不使用卡片框，不使用圓角背景，不使用大面積色塊。

四個資訊欄目：
欄目 1：
標題：{重點特徵1標題}
說明：{重點特徵1短說明}

欄目 2：
標題：{重點特徵2標題}
說明：{重點特徵2短說明}

欄目 3：
標題：{重點特徵3標題}
說明：{重點特徵3短說明}

欄目 4：
標題：{重點特徵4標題}
說明：{重點特徵4短說明}

底部總結句：
在最底部居中放置一句灰色小字總結：
{一句高階、克制、有記憶點的科普總結}

字型與排版：
中文標題使用大號黑色、高階、穩重、有力量感的字型。
副標題使用灰色，中等字號，字距略寬。
英文名使用小號灰色，簡潔現代。
正文使用清晰現代中文字型，保持可讀。
所有文字必須留有足夠呼吸感。

色彩規範：
背景：純白、極淺灰、輕微柔光漸變。
主標題：黑色或深石墨色。
副標題與正文：中性灰。
底部四個資訊標題可使用低飽和強調色：
暖棕、冷藍、松石綠、紫色、橙色。
顏色只用於 icon 和小標題，不要大面積鋪色。

影象品質：
2K 高畫質質感，細節清晰，主體銳利，光影真實。
主體紋理必須可信，例如毛髮、鱗片、甲殼、皮膚褶皺、羽毛或斑紋。
避免變形、錯誤肢體、錯誤解剖結構、模糊主體、低質貼圖、塑膠感、卡通感。

禁止項：
不要使用淡黃色舊紙背景。
不要使用複雜資訊圖表網格。
不要使用圓角卡片。
不要使用厚邊框。
不要使用大面積裝飾圖形。
不要新增無關 logo。
不要新增多餘小字。
不要讓主體太小。
不要讓文字壓住主體。
不要讓底部資訊區過度擁擠。
不要出現兒童科普風、卡通風、低端展板風。

最終輸出：
生成一張 9:16 豎版、高階、乾淨、強視覺衝擊的 Apple 風自然科普海報。
```

**JSON 進階範本（推薦給 Agent 呼叫）**

```json
{
  "type": "Movie Poster",
  "theme": "Interstellar Journey",
  "typography": {
    "headline": "BEYOND STARS",
    "subheading": "A New Era Begins",
    "layout": "Centered, bold cinematic font, bottom heavy"
  },
  "visuals": {
    "subject": "Silhouette of an astronaut looking at a glowing nebula",
    "style": "Cinematic lighting, high contrast, dramatic shadows",
    "color_palette": "Deep space blue, glowing orange accents"
  },
  "vibe": "Epic, mysterious, vast"
}
```

**避坑指南**

- **不要偷懶**：寫清“主視覺到底是什麼玩意兒”，不要只丟一句“做一張海報”就指望出神圖。
- **文案硬編碼**：主標題與副標題都要寫死，否則模型會給你瘋狂加戲，自動瞎編不知所云的文字。
- **運動海報先定結構**：運動 Campaign 最容易變成雜亂拼貼，先鎖定“單主視覺 / 三聯畫 / 資料塗鴉”再寫主體和文案。
- **道具要當構圖骨架**：球拍、啞鈴、球鞋這類道具最好指定角度、比例和位置，否則模型容易把它們畫成普通背景裝飾。
- **字型海報先鎖標題**：概念字型海報必須明確“標題必須拼寫完全正確且成為主視覺”，否則很容易變成漂亮但不可讀的字效圖。
- **影象要和字互動**：人物、物體或場景必須嵌入、遮擋、穿過或托起字形，只擺在旁邊會像裝飾素材。
- **禁止 moodboard 化**：明確要求 single poster only，避免模型生成多方案展示板、過程稿或樣張拼貼。
- **主體放大**：自然科普海報中，主體動物必須被極度放大，佔據畫面 50%-70% 的視覺面積，確保成為最強視覺中心。
- **資訊克制**：遵循“少而準”原則，底部資訊區只使用四列極簡佈局，避免資訊擁擠和視覺混亂。
- **風格統一**：嚴格遵循 Apple 式極簡風格，使用純白背景、乾淨排版和柔和棚拍光影，避免傳統資訊圖表的卡片、圓角框等元素。

<a name="tpl-product"></a>

### 商品與電商

**常規範本**

```text
生成[商品名]電商主圖，賣點為[賣點1]、[賣點2]。
場景：[純色棚拍/生活方式場景]，鏡頭：[特寫/半身/全景]。
材質細節：[材質關鍵詞]，燈光：[柔光/側光/輪廓光]。
附加元素：[價格角標/賣點icon/促銷文案]。
輸出：電商平台可直接使用的商品展示圖。
```

**個人化美妝推薦報告範本**

```text
你是一個專業美妝顧問 + 人臉分析系統 + 品牌視覺設計系統。
目標：基於[使用者自拍]與[口紅品牌]，生成一張具有“分析 + 推薦 + 試色 + 場景建議”的豎版口紅推薦報告資訊圖表。

輸入引數：
使用者影象：[使用者自拍]
品牌：[Dior / YSL / Armani / Chanel / TF / 其他品牌]
風格偏好（可選）：[通勤 / 溫柔 / 氣場 / 氛圍感 / 顯白優先]
推薦數量：[3-5]

分析層：
- 判斷膚色：冷 / 暖 / 中性（含明度）
- 判斷氣質：清冷 / 溫柔 / 明豔 / 乾淨 / 成熟
- 判斷唇部基礎：唇色深淺、唇形、適合濃淡
- 輸出一句總結：「更適合 [色系] + [飽和度] + [質地] 的口紅方向」

推薦層：
從[品牌]中篩選[3-5]個差異化色號，每個色號包含：
- 色號名稱
- 色系標籤
- 上臉效果
- 推薦場景

品牌視覺層：
根據[品牌]自動生成視覺調性，只用少量品牌強調色做標題、細線、小 icon 和局部點綴。
示例：YSL 黑金強對比，Dior 法式柔光灰白，Armani 低飽和霧面，Chanel 極簡黑白，TF 深色電影感。

版式結構：
左上：使用者輸入圖 + 膚色分析
右上：一句分析結論
中部：3-5 個同一張臉的唇色試色矩陣，每列一個色號
底部：有判斷力的個人建議

視覺要求：
高階美妝編輯視覺，結構化資訊視覺化排版，真實皮膚質感，唇色精準，統一光影，9:16 豎版，8K。
```

**JSON 進階範本（推薦給 Agent 呼叫）**

```json
{
  "type": "E-commerce Hero Image",
  "product": {
    "name": "Noise Cancelling Headphones",
    "material": "Matte black finish with metallic accents",
    "angle": "3/4 profile, floating slightly"
  },
  "setting": {
    "background": "Minimalist studio setup, soft gray gradient",
    "lighting": "Softbox overhead, sharp rim light on edges"
  },
  "copywriting": {
    "badges": ["NEW", "$299"],
    "slogan": "Silence the World"
  },
  "constraints": "Commercial photography quality, hyper-realistic textures"
}
```

**避坑指南**

- **材質和光影是靈魂**：一定要堆疊材質（如“磨砂質感”）和燈光（如“輪廓光”）的關鍵詞，商品圖一旦沒有光影，立刻變成地攤貨。
- **別把促銷貼滿全屏**：文案只給核心的 1-2 句（如“新品上市”），字多了畫面就毀了。
- **先分析再出圖**：美妝推薦類不要直接讓模型擺色號，先要求它分析膚色、氣質、唇部基礎，再把結論對映到色號推薦。
- **品牌只做點綴**：品牌調性應該體現在細線、強調色、字型氣質和光影裡，不要把 logo 或大色塊鋪滿畫面。
- **試色矩陣要鎖定同一張臉**：明確“同一張臉，僅唇色變化”，否則模型容易把每個色號都畫成不同的人。

<a name="tpl-brand"></a>

### 品牌與標誌

**常規範本**

```text
為[品牌名]設計品牌視覺方案。
品牌關鍵詞：[關鍵詞1]、[關鍵詞2]、[關鍵詞3]。
包含：Logo方向[幾何/字標/圖形]、輔助圖形、主輔色、應用示意。
風格：[現代/高階/親和]，行業：[行業]，受眾：[受眾]。
輸出：統一風格的品牌識別視覺圖。
```

**完整品牌身份包範本**

```text
你是頂級品牌代理創意總監，目標是為[業務/產品]交付一套覆蓋 Logo、配色、字型、語調和應用觸點的完整品牌身份系統。

輸入資訊：
業務名稱：[業務名]
業務描述：[一句話說明]
行業：[行業]
目標受眾：[詳細描述]
競爭對手：[3-5個]
品牌個性：[5個關鍵詞]
希望觸發的感受：[信任 / 興奮 / 奢華 / 親近 / 力量 / 其他]
喜歡的視覺身份：[3個參考]
討厭的視覺身份：[3個反例]
設計預算：[免費 / 付費]

請輸出：
1. 品牌戰略基礎：品牌原型、核心承諾、定位、差異化和唯一關鍵詞。
2. Logo 概念：生成 3-5 個完全不同的 Logo 方向，每個方向說明核心視覺理念、形狀語言、象徵意義、字型方向、第一眼情緒和適用觸點。
3. 配色系統：主色、輔助色、強調色、中性色、HEX 程式碼、心理學解釋、使用規則和禁用搭配。
4. 字型系統：標題字型、正文字型、強調字型、字號層級、字距、行高和免費替代方案。
5. 應用觸點：名片、App 圖示、網站首頁、社群媒體範本、廣告牌或包裝上的應用效果。
6. 品牌規則：3 條永遠不要打破的核心品牌規則。

輸出形式：
結構化品牌手冊，任何設計師、開發者或 AI 工具都能在 10 分鐘內理解並複用。
```

**品牌觸點系統視覺板範本**

```text
為[品牌名]生成一張高階品牌觸點系統視覺板，不是單張海報，而是一套完整品牌應用展示。

品牌定位：[行業/生活方式/產品品類]
核心氣質：[關鍵詞1]、[關鍵詞2]、[關鍵詞3]
主視覺場景：[核心產品/服務/體驗]，放在[材質表面/空間場景]中，使用[光線]和[鏡頭]呈現。

觸點系統必須包含：
- 主產品 hero shot
- 包裝盒 / 手提袋 / 杯子 / 標籤 / 貼紙 / 封籤等品牌物料
- 選單卡 / 價目表 / 小型排版樣張
- 生活方式場景或使用者使用片段
- 配色、字型、圖形語言在不同觸點上的統一應用

設計語言：
[現代極簡/日式留白/奢華編輯/科技品牌]，主色[顏色]，輔助色[顏色]，大量留白，細膩材質，真實陰影，微小文字清晰可讀。

構圖要求：
像頂級設計機構提案頁，所有觸點整齊但不死板，主視覺最突出，輔助物料層級清楚，整體有品牌系統感和可落地感。

約束：
不要只生成一個 logo；不要把所有物料擠成雜亂拼貼；不要使用隨機亂碼文字；不要讓包裝、選單、貼紙彼此風格割裂。
```

**品牌包絡產品廣告範本**

```text
輸入：[產品圖]、[品牌身份]、[輸出格式]

PHASE 1 / ANCHOR：用 2 行描述[品牌身份]，包括調色盤、材質、光影和情緒。
PHASE 2 / INJECT：把[產品]放入這個品牌世界中，產品要服從品牌氣質和環境語言。
PHASE 3 / FORMAT：指定[輸出格式]，例如 hero 圖、方形廣告、豎版 story 或電商頭圖。
PHASE 4 / SIGNATURE：加入[品牌元素]，例如顆粒、陰影、疊加紋理、包裝符號或圖形邊框。

變數：
[品牌身份] / [產品] / [輸出格式] / [品牌元素]

目標：同一品牌下替換不同產品時，視覺世界保持一致，廣告圖仍然有明確主角和商業質感。
```

**品牌人格漫畫資訊圖表範本**

```text
基於上傳的[Logo/品牌視覺]，生成一張 4:5 豎版漫畫資訊圖表：“What This Brand Feels Like”。
目標：把品牌變成一個可感知的人格角色，並解釋它如何說話、行動、銷售、回應競爭和處理批評。
核心規則：所有顏色、服裝、姿態、語氣和圖形元素都來自 Logo 與品牌關鍵詞。
主視覺：一個品牌人格化角色，服裝、表情和姿態體現[品牌氣質]。
周圍結構：6-8 個漫畫小分鏡，每格包含短標題、動作、氣泡或內心獨白。
輔助模組：Voice tone、Energy level、Social behavior、Communication style、DO / DON'T。
風格：漫畫 + 編輯資訊圖表，表達強但保持高階，文字短而有力，畫面層級豐富。
約束：不要通用營銷詞，不要空白區域，不要把品牌人格畫成隨機角色。
```

**JSON 進階範本（推薦給 Agent 呼叫）**

```json
{
  "type": "Brand Identity Design",
  "brand": {
    "name": "Nova Dynamics",
    "industry": "AI Technology",
    "keywords": ["Innovative", "Minimalist", "Trustworthy"]
  },
  "deliverables": [
    "Logo mark (geometric fusion of a neural network node and a star)",
    "Color palette (Electric Blue and Pure White)",
    "Business card mockup"
  ],
  "style": "Modern corporate, flat vector, high contrast",
  "constraints": "No gradients, scalable vector style, clean white background for logo"
}
```

**避坑指南**

- **做減法**：先定義品牌關鍵詞，再要求視覺輸出，結果更統一。別讓它畫“一條噴火的龍纏繞在長城的柱子上還帶著閃電”，那不叫 Logo，那叫插畫。
- **強制背景**：必須強調“純白背景（Pure White Background）”，方便後期摳圖。
- **先做品牌戰略再畫 Logo**：如果缺少目標受眾、競爭對手和情緒目標，Logo 很容易只是漂亮圖形，無法解釋為什麼適合這個品牌。
- **Logo 必須看應用場景**：要求同時展示名片、App 圖示、網站、廣告牌等觸點，能快速發現縮小後不可讀、橫豎比例不適配等問題。
- **品牌手冊要寫禁用規則**：除了給顏色和字型，也要寫“不要怎麼用”，否則後續延展很容易把統一性弄丟。

<a name="tpl-architecture"></a>

### 建築與空間

**常規範本**

```text
生成[空間型別]設計效果圖，功能定位為[用途]。
風格：[現代簡約/工業/新中式]，材質：[木/石/金屬/玻璃]。
空間結構：[開敞/分區]，動線：[主通道說明]。
光線：[自然採光/人工照明方案]，時間：[白天/夜景]。
輸出：寫實建築空間渲染圖。
```

**JSON 進階範本（推薦給 Agent 呼叫）**

```json
{
  "type": "Architectural Visualization",
  "space": {
    "type": "Modern Cabin Interior",
    "function": "Living room",
    "materials": "Exposed concrete, large floor-to-ceiling glass, warm timber accents"
  },
  "environment": "Nestled in a dense, snowy pine forest visible through the glass",
  "camera": {
    "angle": "Eye-level perspective, wide-angle lens",
    "lighting": "Golden hour, warm interior lights glowing, cool blue ambient light outside"
  },
  "render_quality": "Unreal Engine 5 style, hyper-realistic, 8k resolution, ray tracing"
}
```

**避坑指南**

- **控制視角**：建築圖最容易翻車的就是透視變形。用“Eye-level perspective（人眼視角）”能壓住它。
- **冷暖對比**：室外的冷光（藍/灰）和室內的暖光（黃/橙）搭配，是提升空間高階感的作弊碼。

<a name="tpl-photo"></a>

### 攝影與寫實

**常規範本**

```text
拍攝主題：[人物/物品/街景]，場景為[地點]。
攝影引數風格：[35mm/85mm]，[淺景深/深景深]，[紀實/電影感]。
光線：[自然光/夜景霓虹/逆光]，情緒：[情緒詞]。
細節要求：[膚質/材質/顆粒感]。
輸出：高寫實攝影風格影象。
```

**JSON 進階範本（推薦給 Agent 呼叫）**

```json
{
  "type": "Hyper-realistic Photography",
  "subject": {
    "description": "A weary 30-year-old barista wiping a coffee cup",
    "details": "Subtle sweat on forehead, detailed skin pores, wearing a denim apron"
  },
  "setting": "Dimly lit vintage cafe, rain visible through the window behind",
  "camera_specs": {
    "gear": "Shot on Sony A7R IV, 50mm lens",
    "aperture": "f/1.4 (shallow depth of field, background completely blurred)",
    "lighting": "Cinematic lighting, neon sign reflecting on wet window, soft rim light on subject's hair"
  },
  "film_aesthetic": "Kodak Portra 400 emulation, subtle film grain"
}
```

**街頭意外瞬間寫實攝影範本**

```text
生成一張豎版手機紀實照片，主題是[意外事件/日常瞬間]發生在[街頭/室外地點]。
主體：[物品/人物動作/現場痕跡]，必須呈現真實的材質狀態，例如[液體擴散/冰塊散落/紙張褶皺/灰塵顆粒]。
環境：[地面材質/牆面/街景元素]，保留自然雜亂和生活痕跡。
光線：[正午強光/陰天散射光/夜間路燈]，陰影要符合真實方向，可加入[人物影子/路牌影子/樹影]。
鏡頭：手持手機視角，略微俯拍或低角度，構圖自然，像隨手拍到的現場。
畫面質感：raw unedited photo look，自然色彩，真實紋理，高細節。
負面約束：不要插畫、動漫、CGI、棚拍光、過度乾淨、過度構圖、假液體、漂浮物、品牌文字、水印、海報設計感。
輸出：一張可信的日常紀實攝影圖。
```

**避坑指南**

- **加點瑕疵**：AI 畫的人太完美了，反而像假人。加入“皮膚紋理（skin pores）”、“雀斑”、“輕微膠片顆粒（film grain）”，真實感瞬間拉滿。
- **用引數說話**：用 `f/1.4` 代替“淺景深”，用 `50mm` 代替“半身照”，大模型吃這套。
- **把“不完美”寫具體**：寫“粗糙石磚、散落冰塊、自然陰影、輕微手持感”，比只寫“真實”更穩定。

<a name="tpl-illustration"></a>

### 插畫與藝術

**常規範本**

```text
創作[題材]插畫，主角為[角色/主體]。
畫風：[日漫/水彩/扁平/厚塗]，線條：[細膩/粗獷]。
配色：[配色方案]，背景：[簡潔/複雜場景]。
構圖：[近景/中景/遠景]，重點表現[細節]。
輸出：可用於封面或社群媒體發布的高品質插畫。
```

**JSON 進階範本（推薦給 Agent 呼叫）**

```json
{
  "type": "Artistic Illustration",
  "art_style": "Studio Ghibli inspired anime style",
  "scene": {
    "description": "A giant flying whale carrying a small cozy village on its back",
    "details": "Windmills turning, tiny people looking over the edge, fluffy white clouds"
  },
  "palette": "Vibrant sky blue, lush greens, soft pastel accents",
  "technique": "Cel shading, detailed background art, soft glowing magical aura",
  "mood": "Whimsical, adventurous, nostalgic"
}
```

**避坑指南**

- **鎖定筆觸**：插畫如果不限制筆觸（如“厚塗”、“水彩暈染”），它通常會給你一種毫無靈魂的 AI 預設塑膠風。
- **慎用大師名**：提大師名字很爽，但容易被模型原樣照搬其代表作的構圖。建議提取大師的特徵（如“梵高的旋轉星空筆觸”），而不是直接寫大師名。

<a name="tpl-character"></a>

### 人物與角色

**常規範本**

```text
設計[角色身份]角色設定圖。
外觀：[年齡/髮型/服飾/配件]，性格：[關鍵詞]。
姿態：[站姿/動態動作]，表情：[情緒]。
世界觀：[時代/陣營/職業]，標誌性元素：[元素]。
輸出：角色主檢視 + 風格統一的人設圖。
```

**動作分解參考表範本**

```text
生成一張[角色/人物]動作分解參考表。
風格：[黑白線稿/3D 灰階/漫畫分鏡/教學圖]，背景純淨，技術參考圖氣質。
版式：4×4 網格，共 16 個等尺寸面板，細線分隔，每格左上角編號 1-16。
角色一致性：所有面板使用同一角色，保持臉型、服裝、比例和髮型一致。
每格結構：
- 頂部：動作標題
- 中央：完整身體動作姿態
- 底部：3-4 行動作說明
- 疊加：方向箭頭、旋轉箭頭或運動軌跡線
動作序列：[從基礎站姿到結束動作的完整步驟]
約束：不要複雜背景，不要新增角色，不要彩色干擾，不要改變角色身份。
輸出：清晰可讀、可用於動畫/舞蹈/遊戲動作參考的角色動作表。
```

**參考圖轉 3D 收藏玩具範本**

```text
將輸入照片轉換為高階 3D 收藏玩具形象。
身份保持：保留原始人物/角色的臉部身份、主要髮型、表情氣質和服裝識別點。
造型比例：大頭設計，五官輕微誇張，身體比例玩具化，但整體仍保持高階設計感。
材質：啞光 vinyl / resin / collectible figure finish，皮膚和服飾材質要有細節。
燈光與背景：柔和棚拍光，乾淨背景，[黑色/白色/品牌色]，主體居中，輪廓清晰。
質感：超清銳度，真實材質反射，8K render，premium designer toy aesthetic。
約束：不要改變身份，不要廉價塑膠感，不要多角色，不要複雜背景，不要文字水印。
輸出：一張完整的高階收藏玩具渲染圖。
```

**JSON 進階範本（推薦給 Agent 呼叫）**

```json
{
  "type": "Character Concept Art",
  "character": {
    "identity": "Cybernetic Bounty Hunter",
    "appearance": "Short silver hair, glowing red synthetic left eye, athletic build",
    "attire": "Tactical trench coat with neon piping, holding a plasma rifle"
  },
  "pose": "Dynamic action stance, looking over shoulder with a smirk",
  "environment": "Rainy neon-lit alleyway background (blurred)",
  "style": "Concept art, sharp linework, vibrant cyberpunk palette"
}
```

**避坑指南**

- **拆解五官**：不要只寫“很美的女孩”，大模型不知道你的審美標準。拆解成“桃花眼、高鼻樑、野生眉”。
- **服裝材質**：寫清衣服的材質（如“絲綢”、“機能防風面料”），能讓角色立刻變得立體。
- **動作表要鎖網格**：動作分解圖必須明確面板數量、編號、每格結構，否則模型會把步驟擠成一張雜亂說明圖。
- **玩具化要保留身份錨點**：先鎖臉型、髮型、服裝識別點，再寫大頭比例和材質，能減少“變成另一個人”的機率。
- **角色一致性前置**：動作序列越長越容易換臉換衣服，要把“同一角色、同一服裝、同比例”寫在動作列表之前。

<a name="tpl-scene"></a>

### 場景與敘事

**常規範本**

```text
生成[故事主題]場景圖，發生在[時間+地點]。
主事件：[事件描述]，主角：[角色]，衝突點：[衝突]。
鏡頭語言：[廣角建立鏡頭/中景敘事/特寫]。
氛圍：[緊張/溫暖/懸疑]，色調：[冷/暖/高反差]。
輸出：具備敘事張力的場景概念圖。
```

**JSON 進階範本（推薦給 Agent 呼叫）**

```json
{
  "type": "Narrative Scene",
  "story_context": "The exact moment an ancient seal breaks",
  "environment": "Crumbling stone temple overgrown with glowing blue vines",
  "action": "A young explorer dropping their torch as a massive beam of light shoots into the sky",
  "atmosphere": {
    "mood": "Awe-inspiring, terrifying",
    "lighting": "Blinding central light casting long dramatic shadows"
  },
  "camera": "Low angle shot, emphasizing the scale of the light beam"
}
```

**避坑指南**

- **要有“動詞”**：敘事圖最怕畫成風景明信片。一定要寫“事件”（如“正在崩塌”、“剛點燃火把”），讓畫面動起來。
- **鏡頭語言**：使用“Low angle shot（低角度仰拍）”或“Dutch angle（傾斜鏡頭）”來增加戲劇衝突。

<a name="tpl-history"></a>

### 歷史與古風題材

**常規範本**

```text
生成[朝代/古風設定]題材畫面，主題為[主題]。
人物：[身份/服飾/器物]，場景：[宮廷/市井/山水]。
美術風格：[工筆/寫意/影視寫實]，色調：[色調]。
文化細節：[紋樣/禮制/建築要素]。
輸出：歷史氛圍準確的古風題材圖。
```

**JSON 進階範本（推薦給 Agent 呼叫）**

```json
{
  "type": "Historical/Oriental Scene",
  "setting": "Tang Dynasty Capital City at Night",
  "subject": {
    "identity": "Noblewoman",
    "clothing": "Traditional Ruqun (襦裙) with elaborate floral embroidery",
    "action": "Holding a glowing silk lantern, looking at fireworks"
  },
  "style": "Cinematic realism combined with subtle traditional ink wash (水墨) textures",
  "details": "Accurate Tang architecture, bustling crowd in background",
  "constraints": "No modern elements, historically accurate clothing structure"
}
```

**避坑指南**

- **拒絕大雜燴**：明確朝代（唐/宋/明），否則大模型會給你畫出一個穿著和服、拿著清朝摺扇在唐朝宮殿裡的人。
- **強制排雷**：一定要加上“禁用現代元素（No modern elements）”，防止古風美女手裡突然多出一杯星巴克。

<a name="tpl-document"></a>

### 檔案與出版物

**常規範本**

```text
製作[檔案型別，如選單/雜誌內頁/報紙版式]。
版面結構：[欄數/頁邊距/標題層級]。
內容模組：[封面區/正文區/圖表區/腳註]。
字型風格：[襯線/無襯線]，配色：[配色方案]。
輸出：可讀性強、版式規範的出版物視覺稿。
```

**JSON 進階範本（推薦給 Agent 呼叫）**

```json
{
  "type": "Editorial Layout",
  "document": "Fashion Magazine Double-page Spread",
  "grid": "3-column grid, wide margins",
  "content": {
    "left_page": "Full-bleed high-fashion photograph of a model in a red dress",
    "right_page": {
      "headline": "THE RED RENAISSANCE",
      "body_text": "(Simulated text blocks)",
      "pull_quote": "\"Color is power.\""
    }
  },
  "typography": "Elegant serif for headlines, clean sans-serif for body",
  "palette": "Monochrome with stark red accents"
}
```

**企業畫冊系統範本**

> 來源參考：[@MrLarus](https://x.com/MrLarus/status/2056974720893939950)

```text
請生成一套企業級商用畫冊視覺方案，主題為【品牌名稱】的【行業 / 產品 / 解決方案】宣傳畫冊。

整體風格：高階、專業、具有強視覺衝擊力；避免傳統 Word 排版感和普通 PPT 感。採用【深色科技美學 / 白色極簡商務 / 高階工業風 / 藝術化品牌畫冊】風格。

畫冊內容包括：
1、封面與封底
2、企業介紹與品牌理念
3、核心產品與技術優勢
4、應用場景與解決方案
5、客戶案例與合作方式
6、全冊系統預覽圖

要求：
版式要有設計感，圖片、標題、資料、圖示、留白和層級關係清晰；保持整套畫冊統一的品牌視覺系統；重點體現真實商業物料的完成度，避免簡單文字排版。
```

**避坑指南**

- **結構優先**：明確“欄數（columns）”和“留白（margins）”比堆砌風格詞更重要。
- **放棄全文**：不要指望大模型能排出一整頁毫無錯字的正文，讓它用“模擬文字（Simulated text blocks）”填充正文，只寫死大標題。
- **系統預覽**：企業畫冊類任務最好補一張全冊預覽圖，用於驗證封面、內頁、案例頁和聯絡方式頁面的統一性。

<a name="tpl-other"></a>

### 其他應用場景

**常規範本**

```text
任務目標：[你要生成的內容型別]。
輸入約束：主體[主體]，場景[場景]，風格[風格]，色彩[配色]。
品質約束：清晰度[高畫質/4K]，比例[比例]，構圖[構圖方式]。
輸出約束：用於[用途]，需突出[核心資訊]。
請輸出一版主方案 + 一版備選方案。
```

**概念產品研發拆解板範本**

```text
為[產品/傢俱/裝置]生成一張完整的概念產品研發拆解板，而不是單張成品渲染圖。

核心概念：
把[靈感來源，如揉皺紙團/貝殼/摺紙/機械結構]轉譯成[產品型別]。
設計哲學：[一句話說明功能與情緒，例如“把受控混亂轉化為高舒適度座椅”]。

畫面結構：
中心：高品質 hero render，展示最終產品的主要形態、材質和比例。
左側：觀察與形態分析，包含靈感圖、輪廓提取、結構線、摺痕/紋理/受力方向標註。
中部：形態迭代過程，展示從原始形態到產品外殼的 3-5 個演化步驟。
下方：人體工學或使用場景驗證，包含尺寸、角度、使用姿態和關鍵功能說明。
右側：結構整合與材料方案，展示內部骨架、外殼、軟墊/面料/連線件等分層拆解。
底部：最終材質、表面紋理、顏色方案和關鍵規格表。

視覺風格：
工業設計提案板，乾淨白底或淺灰背景，技術圖紙 + 產品攝影混合風格，細線標註，清晰標題，真實陰影，材質細節可見。

約束：
不要只畫一個漂亮產品；必須展示分析、迭代、人體工學、結構、材料和規格。
不要讓文字擠滿畫面；每個階段只保留短標題和關鍵標籤。
產品外形應保留[靈感來源]的識別特徵，但必須看起來可製造、可使用。
```

**JSON 進階範本（推薦給 Agent 呼叫）**

```json
{
  "type": "Custom Generation",
  "objective": "Generate [Specific content]",
  "inputs": {
    "subject": "[Main subject details]",
    "scene": "[Background and context]",
    "style": "[Artistic/Visual style]",
    "palette": "[Color scheme]"
  },
  "quality_constraints": {
    "resolution": "8k, hyper-detailed",
    "aspect_ratio": "[e.g., 16:9]",
    "composition": "[e.g., Rule of thirds]"
  },
  "output_requirements": {
    "usage": "[Intended use case]",
    "focus": "[Key element to highlight]"
  }
}
```

**避坑指南**

- **先說幹嘛的**：一上來先寫“任務目標和用途”，讓模型建立全域性上下文，再寫視覺細節。
- **A/B 測試**：通用場景建議在 prompt 裡要求“一次生成主方案 + 備選方案”，方便你直接挑好的。

***
