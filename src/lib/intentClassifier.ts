import type { IntentResult, SearchIntent } from "@/types";

const INTENT_RULES: {
  intent: SearchIntent;
  keywords: string[];
  weight: number;
}[] = [
  {
    intent: "learn",
    keywords: [
      "攻略", "怎么玩", "几日游", "路线", "行程", "规划", "注意事项",
      "第一次", "必看", "tips", "懒人包", "深度游", "预算", "交通",
      "通票", "退税", "亲子游", "文化之旅",
    ],
    weight: 1,
  },
  {
    intent: "discover",
    keywords: [
      "推荐", "探店", "咖啡店", "咖啡", "美食", "夜市", "小众",
      "网红", "拍照", "机位", "市场", "居酒屋", "SPA", "按摩",
      "酒吧", "古着", "买手店", "赏樱", "赏枫", "必吃", "最好",
    ],
    weight: 1,
  },
  {
    intent: "transact",
    keywords: [
      "门票", "酒店", "预订", "订票", "购票", "住宿", "机票",
      "价格", "便宜", "性价比", "民宿", "订购", "买",
    ],
    weight: 1.2,
  },
  {
    intent: "navigate",
    keywords: [
      "@", "vlog", "合集", "直达",
    ],
    weight: 1.5,
  },
];

const POI_NAMES = [
  "浅草寺", "大皇宫", "伏见稻荷", "金阁寺", "清水寺", "考山路",
  "东京塔", "迪士尼", "岚山", "祇园", "涩谷", "新宿", "曼谷", "京都", "东京",
  "乌鲁瓦图", "乌布", "水明漾", "库塔", "金巴兰", "巴厘岛",
  "滨海湾", "牛车水", "圣淘沙", "樟宜机场", "新加坡", "哈芝巷",
];

const CITY_KEYWORDS: Record<string, string> = {
  东京: "tokyo",
  曼谷: "bangkok",
  京都: "kyoto",
  巴厘岛: "bali",
  巴厘: "bali",
  新加坡: "singapore",
  泰国: "bangkok",
  日本: "tokyo",
  印尼: "bali",
  印度尼西亚: "bali",
};

export function extractCity(query: string): string | null {
  for (const [keyword, city] of Object.entries(CITY_KEYWORDS)) {
    if (query.includes(keyword)) return city;
  }
  return null;
}

export function extractConstraints(query: string): string[] {
  const constraints: string[] = [];
  const budgetMatch = query.match(/预算\s*(\d+)/);
  if (budgetMatch) constraints.push(`预算约 ${budgetMatch[1]} 元`);
  const dayMatch = query.match(/(\d+)\s*[天日]/);
  if (dayMatch) constraints.push(`${dayMatch[1]} 天行程`);
  if (query.includes("亲子")) constraints.push("亲子友好");
  if (query.includes("穷游") || query.includes("省钱")) constraints.push("预算有限");
  return constraints;
}

function scoreIntent(query: string, intent: SearchIntent): number {
  const rule = INTENT_RULES.find((r) => r.intent === intent)!;
  let score = 0;
  const lower = query.toLowerCase();

  for (const kw of rule.keywords) {
    if (lower.includes(kw.toLowerCase()) || query.includes(kw)) {
      score += rule.weight;
    }
  }

  if (intent === "navigate") {
    for (const poi of POI_NAMES) {
      if (query.includes(poi) && !query.includes("攻略") && !query.includes("推荐")) {
        score += 2;
      }
    }
    if (query.startsWith("@")) score += 3;
  }

  if (intent === "learn" && /\d+\s*[天日]/.test(query)) score += 1.5;
  if (intent === "transact" && (query.includes("附近") || query.includes("机场"))) score += 1;

  return score;
}

const REASONING_TEMPLATES: Record<SearchIntent, string> = {
  learn: "用户在寻求可执行的行程规划或旅行建议，需要 AI 合成攻略",
  discover: "用户想发现具体地点或店铺，适合展示 POI 卡片和创作者实拍",
  transact: "用户有明确的预订/购买意图，应优先展示交易选项",
  navigate: "用户已有明确目标，需要快速直达 POI 或创作者主页",
};

export function classifyIntent(query: string): IntentResult {
  const scores: Record<SearchIntent, number> = {
    learn: scoreIntent(query, "learn"),
    discover: scoreIntent(query, "discover"),
    transact: scoreIntent(query, "transact"),
    navigate: scoreIntent(query, "navigate"),
  };

  const sorted = (Object.entries(scores) as [SearchIntent, number][]).sort(
    (a, b) => b[1] - a[1]
  );

  const [topIntent, topScore] = sorted[0];
  const [, secondScore] = sorted[1];

  const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
  const confidence = Math.min(0.98, Math.max(0.55, topScore / total + (topScore - secondScore) * 0.1));

  const constraints = extractConstraints(query);

  return {
    intent: topScore > 0 ? topIntent : "discover",
    confidence: Math.round(confidence * 100) / 100,
    reasoning: REASONING_TEMPLATES[topScore > 0 ? topIntent : "discover"],
    ...(constraints.length > 0 ? { constraints } : {}),
  };
}

export async function classifyIntentWithLLM(query: string): Promise<IntentResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return classifyIntent(query);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You classify travel search queries into one of: learn, discover, transact, navigate.
Return JSON only: {"intent":"...","confidence":0.0-1.0,"reasoning":"..."}`,
          },
          { role: "user", content: query },
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) return classifyIntent(query);

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? "";
    const parsed = JSON.parse(content.replace(/```json\n?|\n?```/g, ""));
    const constraints = extractConstraints(query);

    return {
      intent: parsed.intent as SearchIntent,
      confidence: parsed.confidence,
      reasoning: parsed.reasoning,
      ...(constraints.length > 0 ? { constraints } : {}),
    };
  } catch {
    return classifyIntent(query);
  }
}
