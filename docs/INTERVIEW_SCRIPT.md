# TripLens 面试 Pitch 脚本

## 5 分钟 Pitch 结构

### 开场（30秒）

> 大家好，我想分享一个产品想法叫 TripLens。
>
> 我发现 Gen Z 越来越多地用 TikTok 搜旅游 — 「东京三日游」「曼谷必吃」— 但 TikTok 的搜索体验对所有 query 返回相同的视频列表。用户得从 20 个视频里自己拼凑行程，效率很低。
>
> TripLens 的核心思路是：**先理解用户想干什么，再决定展示什么。**

### 问题（45秒）

> 同一个搜索框，四种完全不同的需求：
>
> - 「东京3天怎么玩」— 要行程，不是视频列表
> - 「涩谷小众咖啡」— 要具体店铺，不是攻略
> - 「迪士尼门票」— 要预订，不是种草
> - 「浅草寺」— 要直达，不是推荐
>
> 传统搜索用一个列表打天下，导致 Search Satisfaction Rate 低，特别是 Learn 类 query 的 Itinerary Save Rate 几乎为零。

### 解决方案 Demo（2分钟）

**[操作 Demo]**

1. **Learn 演示**
   > 搜「东京三日游攻略」— 系统识别为 Learn 意图，92% 置信度。不是返回视频列表，而是 AI 合成 Day-by-Day 行程，每个 Day 有具体活动、POI、Tips，底部关联创作者视频作为来源。

2. **Discover 演示**
   > 搜「涩谷小众咖啡店」— 切换到 Discover 意图。结果页变成地点卡片网格，有人均、排队时间、评分，加上创作者实拍视频。布局完全不同。

3. **A/B 对比**
   > 打开对比开关，同一 query 切到传统模式 — 所有意图都返回相同的视频列表。这就是 Intent-aware 搜索的价值：减少用户的认知负担，提升决策效率。

### Metrics（45秒）

> 我会用三层指标衡量：
>
> - **North Star**：Search Satisfaction Rate，目标 +15%
> - **分意图**：Learn 看 Itinerary Save Rate，Discover 看 POI CTR，Transact 看 Booking CTA Click
> - **护栏**：Intent 误分类率 < 10%，AI 幻觉举报率 < 1%
>
> 验证方式：A/B test，50% 用户看传统搜索，50% 看 Intent-aware，跑 2 周看核心指标。

### Roadmap（30秒）

> - V1：Intent Routing + AI 行程合成（当前 Demo）
> - V2：多轮对话 — 「预算改成 3000 呢？」
> - V3：基于 watch history 个性化排序

### 收尾（30秒）

> TripLens 不是要替代 TikTok 的视频优势，而是在 video-first 的基础上加一层智能 — 让用户更快从「看」到「决策」。我相信旅游是 TikTok Search 最高价值的垂直品类之一，Intent-aware 是解锁这个价值的关键。
>
> 谢谢，欢迎提问。

---

## Deep-dive 问题应答

### Q1: 为什么旅游场景适合 intent routing？

> 三个原因：
>
> 1. **Query 意图多样性高** — 同一个「东京」可以对应 Learn/Discover/Transact/Navigate 四种意图，歧义率远高于「猫 videos」等娱乐 query
> 2. **决策成本高** — 旅游决策涉及时间、金钱、体验，用户需要结构化信息而非娱乐内容
> 3. **TikTok 内容优势** — 创作者实拍视频是独特资产，intent routing 决定「什么时候展示 AI 合成 vs 什么时候展示视频」，最大化内容价值

### Q2: Learn 意图下 AI 合成答案 vs 纯视频排序，怎么决策？

> 我的框架是 **Intent × Content Sufficiency Matrix**：
>
> | | 内容充足 | 内容不足 |
> |---|---|---|
> | **Learn** | AI 合成 + 视频佐证 | AI 合成为主 |
> | **Discover** | 视频优先 + POI 卡片 | POI 卡片为主 |
>
> 对于 Learn：
> - 如果多个创作者视频覆盖了完整行程 → AI 合成 + 标注来源
> - 如果视频碎片化 → AI 合成为主，视频作为补充
> - **永远展示来源链接**，降低 hallucination 风险
> - 用户可一键切换到「只看视频」模式

### Q3: 如果 Discover 意图误分类成 Learn，怎么发现和修复？

> 三层检测 + 修复机制：
>
> **检测：**
> 1. 行为信号 — Discover 误分类为 Learn 时，用户不会 Save Itinerary，但会快速 scroll 到视频区并点击 POI
> 2. 显式反馈 — 结果页底部「这不是我想要的」按钮
> 3. 离线评估 — 500 query 人工标注集，每周跑 intent classifier 准确率
>
> **修复：**
> 1. 短期 — 低置信度（< 60%）时展示混合结果 + 意图澄清 chips
> 2. 中期 — 用 misprediction 样本 fine-tune classifier
> 3. 长期 — 用户级 intent preference learning

### Q4: 怎么和 TikTok 现有搜索团队合作，而不是另起炉灶？

> TripLens 的定位是 **Search Experience Layer**，不是重建搜索引擎：
>
> - **复用**：现有 video index、ranking model、creator graph
> - **新增**：Intent classifier（query 理解层）+ Answer synthesizer（AI 层）+ Intent-specific UI templates
> - **集成点**：在 search results page 的 rendering layer 插入 intent routing
> - **渐进 rollout**：先对旅游品类 5% 流量开启，验证 metrics 后扩类目

---

## Demo 操作 Checklist

- [ ] 首页加载正常，示例 query chips 可见
- [ ] 「东京三日游攻略」→ Learn 行程卡展示
- [ ] 「涩谷小众咖啡店」→ Discover 地点卡片
- [ ] 「东京迪士尼门票」→ Transact 预订列表
- [ ] 「浅草寺」→ Navigate 直达卡片
- [ ] A/B Toggle 切换正常，传统模式显示视频列表
- [ ] Intent Badge 显示置信度和 reasoning
- [ ] 备用录屏已准备（防 live demo 失败）
