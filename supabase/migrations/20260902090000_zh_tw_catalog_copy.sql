-- 只替換上游預設中文文案；保留自訂文案、價格與權限。
begin;

update public.membership_plans as plan
set name_zh = copy.translated
from (values
  ('入门会员', '入門會員'),
  ('创作者会员', '創作者會員'),
  ('工作室会员', '工作室會員')
) as copy(original, translated)
where plan.name_zh = copy.original;

update public.membership_plans as plan
set description_zh = copy.translated
from (values
  ('适合轻量测试提示词和日常找灵感。', '適合少量測試提示詞與尋找日常靈感。'),
  ('适合高频复用案例并做内容生产。', '適合經常運用案例進行內容創作。'),
  ('适合团队和高频 GPT-Image2 实验。', '適合團隊及經常進行 GPT-Image2 實驗的使用者。'),
  ('每月 700 积分，适合轻量测试提示词和日常生图实验。', '每月 700 點數，適合少量提示詞測試與日常圖片生成實驗。'),
  ('每月 1,800 积分，适合高频复用案例、内容生产和提示词测试。', '每月 1,800 點數，適合經常運用案例、創作內容與測試提示詞。'),
  ('每月 5,200 积分，适合高频 GPT-Image2 工作流和小团队使用。', '每月 5,200 點數，適合經常執行 GPT-Image2 工作流程及小型團隊使用。')
) as copy(original, translated)
where plan.description_zh = copy.original;

update public.credit_packs as pack
set name_zh = copy.translated
from (values
  ('30 积分包', '30 點數包'),
  ('120 积分包', '120 點數包'),
  ('360 积分包', '360 點數包'),
  ('300 积分包', '300 點數包'),
  ('1,000 积分包', '1,000 點數包'),
  ('3,000 积分包', '3,000 點數包')
) as copy(original, translated)
where pack.name_zh = copy.original;

update public.credit_packs as pack
set description_zh = copy.translated
from (values
  ('适合继续尝试更多案例。', '適合繼續嘗試更多案例。'),
  ('适合稳定进行提示词测试。', '適合持續測試提示詞。'),
  ('适合批量内容生产和小团队使用。', '適合批次內容製作及小型團隊使用。'),
  ('入门测试包，适合继续尝试更多 GPT-Image2 案例。', '入門測試包，適合繼續嘗試更多 GPT-Image2 案例。'),
  ('常用创作包，适合稳定进行提示词测试和视觉迭代。', '日常創作包，適合持續測試提示詞與調整視覺設計。'),
  ('高频创作包，适合批量内容生产和小团队使用。', '大量創作包，適合批次內容製作及小型團隊使用。')
) as copy(original, translated)
where pack.description_zh = copy.original;

commit;
