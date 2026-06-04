# TripLens — Intent-aware AI 旅游搜索

面向 Gen Z 的 AI 旅游搜索 Demo，根据搜索意图自动切换「攻略 / 探店 / 预订 / 直达」四种结果页。

> 面试作品集项目，用于展示 TikTok AI Search PM 产品思维

## 快速开始

```bash
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)

### 可选：启用 LLM 增强

复制 `.env.example` 为 `.env.local`，填入 OpenAI API Key：

```bash
cp .env.example .env.local
```

不配置 API Key 也可完整运行 — 使用规则引擎做意图分类，模板化行程合成。

## Demo 演示流程（3 分钟）

1. 搜索「东京三日游攻略」→ Learn 模式，展示 AI 合成行程卡
2. 搜索「涩谷小众咖啡店」→ Discover 模式，展示地点卡片
3. 搜索「东京迪士尼门票」→ Transact 模式，展示预订选项
4. 搜索「浅草寺」→ Navigate 模式，直达 POI
5. 切换「传统搜索 / Intent-aware」对比同一 query 的结果差异

## 项目结构

```
search/
├── data/                  # Mock 数据（100 视频 + 24 POI + 18 listings，5 城市）
├── docs/                  # PRD + 面试脚本
├── scripts/               # 数据生成脚本
├── src/
│   ├── app/               # Next.js App Router
│   ├── components/        # UI 组件
│   ├── lib/               # 意图分类、检索、合成逻辑
│   └── types/             # TypeScript 类型
```

## 核心功能

- **意图分类**：Learn / Discover / Transact / Navigate 四类
- **差异化结果页**：每种意图独立 UI 布局
- **AI 行程合成**：Learn 模式下 RAG + 模板合成可执行攻略
- **A/B 对比**：传统视频列表 vs Intent-aware 搜索

## 技术栈

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS 4
- 规则引擎意图分类（可选 OpenAI API 增强）

## 重新生成 Mock 数据

```bash
node scripts/generate-mock-data.mjs
```
