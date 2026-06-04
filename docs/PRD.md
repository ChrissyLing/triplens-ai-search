# TripLens PRD-lite

## 1. Problem Statement

### 背景

Gen Z  increasingly 使用 TikTok 作为旅游决策入口。据内部数据估算，旅游类搜索 query 年增长率超过 200%，其中「东京三日游」「曼谷必吃」等高频 query 的搜索结果满意度显著低于娱乐类搜索。

### 核心问题

**同一搜索框，不同意图，却返回相同的结果页。**

| Query | 用户真实需求 | 当前体验问题 |
|-------|-------------|-------------|
| 东京3天怎么玩 | 要可执行行程 | 返回散乱的视频列表，需自己拼凑 |
| 涩谷小众咖啡店 | 找具体店铺 | 混在攻略视频里，难以对比 |
| 东京迪士尼门票 | 比价下单 | 种草视频排在预订入口前面 |
| 浅草寺 | 直达目标 | 需滚动筛选才能找到 POI 详情 |

### 机会

通过 **Intent-aware Search**，在 query 理解阶段识别用户意图，动态切换结果页布局和内容策略，提升搜索满意度和下游转化。

---

## 2. User Personas

### 计划型旅行者 — 小美，24岁，第一次去东京

- **行为**：出发前 2 周集中搜攻略，收藏行程
- **典型 Query**：「东京三日游攻略」「第一次去日本注意事项」
- **核心需求**：可执行的 Day-by-Day 行程，不要碎片化视频
- **对应意图**：Learn

### 即兴探店型 — 阿杰，22岁，已在曼谷

- **行为**：到了当地才搜「附近有什么好吃的」
- **典型 Query**：「曼谷夜市推荐」「暹罗网红咖啡」
- **核心需求**：具体地点、实拍氛围、排队/人均信息
- **对应意图**：Discover

### 省钱预订型 — 莉莉，28岁，精打细算

- **行为**：确定目的地后搜门票和酒店
- **典型 Query**：「东京迪士尼门票」「成田机场附近酒店」
- **核心需求**：快速比价、可信赖的预订入口
- **对应意图**：Transact

### 目标明确型 — 各种用户

- **行为**：已知要去哪，快速到达
- **典型 Query**：「浅草寺」「@tokyo_walker 京都vlog」
- **核心需求**：减少点击路径，直达目标
- **对应意图**：Navigate

---

## 3. Intent Taxonomy

### 四类意图定义

```
Learn     — 寻求知识/规划，需要 AI 合成答案
Discover  — 探索具体选项，需要 POI 卡片 + 实拍视频
Transact  — 交易意图，需要 listings + CTA
Navigate  — 导航意图，需要直达 + 相关合集
```

### 边界规则

| 场景 | 分类 | 规则 |
|------|------|------|
| 「东京三日游 + 预算5000」 | Learn | 含「攻略/几日游」优先 Learn，抽取 budget constraint |
| 「涩谷 星巴克」 | Navigate | 品牌+地点组合，用户已知目标 |
| 「曼谷夜市推荐」 | Discover | 含「推荐/探店」优先 Discover |
| 「东京迪士尼门票怎么买」 | Transact | 含「门票/预订/买」优先 Transact |
| 置信度 < 60% | Mixed | 展示混合结果 + 意图澄清 chips |

---

## 4. Success Metrics

### 一级指标（North Star）

| 指标 | 定义 | 目标 |
|------|------|------|
| Search Satisfaction Rate | 搜索后正向行为（收藏/点击/停留>30s）占比 | +15% vs baseline |
| Zero-result Rate by Intent | 分意图的零结果率 | < 3% per intent |

### 二级指标

| 意图 | 关键指标 | 目标 |
|------|---------|------|
| Learn | Itinerary Save Rate | > 20% |
| Discover | POI Click-through Rate | > 35% |
| Transact | Booking CTA Click Rate | > 12% |
| Navigate | Time-to-Target (< 2 clicks) | > 80% |

### 护栏指标

- Intent 误分类率 < 10%（通过人工标注集监控）
- AI 答案 hallucination 举报率 < 1%
- 搜索延迟 P95 < 800ms

---

## 5. Product Roadmap

### V1 — Intent Routing MVP（当前 Demo）

- 四类意图分类 + 差异化结果页
- Learn 模式 AI 行程合成
- 传统 vs Intent-aware A/B 对比

### V2 — Conversational Search

- 多轮追问：「预算改成 3000 呢？」
- Session context 保留
- 意图切换检测（从 Learn 追问 Discover）

### V3 — Personalization

- 基于 watch history 调整结果排序
- 已去过的城市/POI 去重
- 创作者偏好学习

---

## 6. 竞品对比

| 维度 | Google Travel | 小红书 | Perplexity | TikTok 现有搜索 | TripLens |
|------|--------------|--------|------------|----------------|----------|
| 内容形态 | 网页+地图 | 图文笔记 | 文本答案 | 视频列表 | 视频+AI+意图路由 |
| 意图理解 | 强 | 中 | 强 | 弱 | 强（垂直） |
| 视频优势 | 无 | 弱 | 无 | 强 | 强 |
| 社交证明 | 弱 | 强 | 无 | 强 | 强 |
| 交易闭环 | 强 | 中 | 弱 | 弱 | 中（V2+） |

**TripLens 差异化**：在 TikTok video-first 优势上，叠加 intent routing 和 AI 合成，解决「视频很好但决策很难」的核心痛点。

---

## 7. 风险与降级

| 风险 | 影响 | 降级方案 |
|------|------|---------|
| 意图误分类 | 用户体验断裂 | 混合结果 + 意图澄清 chips |
| AI 幻觉 | 错误行程导致投诉 | 标注「AI 合成，仅供参考」+ 来源视频链接 |
| 延迟过高 | 用户流失 | 意图分类本地化，AI 合成异步加载 |
| 冷启动 | 新城市无内容 | 回退到传统视频搜索 |
