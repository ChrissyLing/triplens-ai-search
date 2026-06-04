import type { Video, POI, Listing, SearchIntent, SynthesizedItinerary } from "@/types";
import { videos, pois, listings } from "./data";
import { extractCity } from "./intentClassifier";

function tokenize(text: string): string[] {
  return text.toLowerCase().split(/[\s,，、。！？]+/).filter(Boolean);
}

function scoreMatch(query: string, item: { title?: string; name?: string; tags: string[]; pois?: string[]; transcript?: string; city: string }): number {
  const q = query.toLowerCase();
  let score = 0;

  const fields = [
    item.title,
    item.name,
    ...(item.tags ?? []),
    ...(item.pois ?? []),
    item.transcript,
  ].filter(Boolean) as string[];

  for (const field of fields) {
    if (q.includes(field.toLowerCase()) || field.includes(query)) score += 3;
    for (const token of tokenize(field)) {
      if (token.length > 1 && q.includes(token)) score += 1;
    }
  }

  const city = extractCity(query);
  if (city && item.city === city) score += 2;

  return score;
}

export function retrieveVideos(query: string, intent: SearchIntent, limit = 8): Video[] {
  const city = extractCity(query);

  let scored = videos
    .map((v) => ({
      video: v,
      score:
        scoreMatch(query, { ...v, name: v.title }) +
        (v.intent_tags.includes(intent) ? 2 : 0) +
        (city && v.city === city ? 3 : 0),
    }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  if (city) {
    const cityScored = scored.filter((s) => s.video.city === city);
    if (cityScored.length >= 1) scored = cityScored;
  }

  if (scored.length >= 3) return scored.slice(0, limit).map((s) => s.video);

  const fallback = videos
    .filter((v) => !city || v.city === city)
    .filter((v) => v.intent_tags.includes(intent))
    .slice(0, limit);

  return fallback.length > 0 ? fallback : videos.filter((v) => !city || v.city === city).slice(0, limit);
}

export function retrievePOIs(query: string, limit = 6): POI[] {
  const city = extractCity(query);

  let scored = pois
    .map((p) => ({
      poi: p,
      score: scoreMatch(query, { ...p, title: p.name, pois: [p.name] }),
    }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  if (city) {
    const cityScored = scored.filter((s) => s.poi.city === city);
    if (cityScored.length >= 1) scored = cityScored;
  }

  if (scored.length >= 2) return scored.slice(0, limit).map((s) => s.poi);

  return pois
    .filter((p) => !city || p.city === city)
    .slice(0, limit);
}

export function retrieveListings(query: string, limit = 4): Listing[] {
  const city = extractCity(query);

  let scored = listings
    .map((l) => ({
      listing: l,
      score: scoreMatch(query, { ...l, title: l.name, pois: [], transcript: l.tags.join(" ") }),
    }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  if (city) {
    const cityScored = scored.filter((s) => s.listing.city === city);
    if (cityScored.length >= 1) scored = cityScored;
  }

  if (scored.length >= 1) return scored.slice(0, limit).map((s) => s.listing);

  return listings
    .filter((l) => !city || l.city === city)
    .slice(0, limit);
}

export function findNavigateTarget(query: string): {
  type: "poi" | "creator";
  name: string;
  description: string;
  thumbnail: string;
  relatedVideos: Video[];
} | null {
  const creatorMatch = query.match(/@(\w+)/);
  if (creatorMatch) {
    const handle = `@${creatorMatch[1]}`;
    const related = videos.filter((v) => v.creator.toLowerCase() === handle.toLowerCase());
    if (related.length > 0) {
      return {
        type: "creator",
        name: handle,
        description: `${handle} 的旅行视频合集，${related.length} 个相关视频`,
        thumbnail: related[0].thumbnail,
        relatedVideos: related,
      };
    }
  }

  for (const poi of pois) {
    if (query.includes(poi.name)) {
      const related = videos.filter(
        (v) => v.pois.includes(poi.name) || poi.relatedVideoIds.includes(v.id)
      );
      return {
        type: "poi",
        name: poi.name,
        description: poi.description,
        thumbnail: poi.thumbnail,
        relatedVideos: related.length > 0 ? related : retrieveVideos(poi.name, "navigate", 4),
      };
    }
  }

  return null;
}

const CITY_DISPLAY_NAMES: Record<string, string> = {
  tokyo: "东京",
  bangkok: "曼谷",
  kyoto: "京都",
  bali: "巴厘岛",
  singapore: "新加坡",
};

const ITINERARY_TEMPLATES: Record<string, SynthesizedItinerary> = {
  tokyo: {
    title: "东京 3 日经典路线",
    summary: "结合多位创作者经验，覆盖浅草、秋叶原、表参道、台场等经典区域，适合第一次去东京的旅行者。",
    days: [
      {
        day: 1,
        title: "传统与现代 · 浅草 & 秋叶原",
        activities: ["浅草寺参拜 & 雷门打卡", "仲见世通逛街买小吃", "秋叶原动漫街探索", "女仆咖啡厅体验（可选）"],
        pois: ["浅草寺", "秋叶原"],
        tips: "建议早上8点前到浅草寺，避开人流高峰",
      },
      {
        day: 2,
        title: "时尚购物 · 表参道 & 原宿",
        activities: ["表参道买手店逛街", "明治神宫散步", "原宿竹下通 & 猫街", "涩谷十字路口夜景"],
        pois: ["表参道", "原宿", "涩谷"],
        tips: "表参道适合下午，原宿适合傍晚",
      },
      {
        day: 3,
        title: "浪漫收尾 · 台场 & 银座",
        activities: ["台场海滨公园", "teamLab 或购物 mall", "银座高端逛街", "东京塔夜景"],
        pois: ["台场", "银座", "东京塔"],
        tips: "台场建议预留半天，傍晚去东京塔看夜景",
      },
    ],
    sourceVideos: [],
  },
  bangkok: {
    title: "曼谷 3 日经典路线",
    summary: "大皇宫、夜市、街头美食，体验泰国文化与现代曼谷的碰撞。",
    days: [
      {
        day: 1,
        title: "皇室文化 · 大皇宫 & 卧佛寺",
        activities: ["大皇宫参观", "卧佛寺", "郑王庙（可选）", "考山路晚餐"],
        pois: ["大皇宫", "卧佛寺", "考山路"],
        tips: "大皇宫需穿长裤，建议早上去",
      },
      {
        day: 2,
        title: "现代曼谷 · 暹罗 & 购物",
        activities: ["暹罗商圈购物", "Central World", "曼谷艺术文化中心", " rooftop bar 夜景"],
        pois: ["暹罗", "Central World"],
        tips: "BTS 沿线最方便",
      },
      {
        day: 3,
        title: "本地体验 · 市场 & 夜市",
        activities: ["Chatuchak 周末市场", "水上市场半日游", "拉差达火车夜市"],
        pois: ["Chatuchak", "拉差达火车夜市"],
        tips: "Chatuchak 仅周末开放",
      },
    ],
    sourceVideos: [],
  },
  kyoto: {
    title: "京都 2 日经典路线",
    summary: "伏见稻荷、清水寺、岚山，感受千年古都的禅意与美学。",
    days: [
      {
        day: 1,
        title: "东线经典 · 伏见稻荷 & 清水寺",
        activities: ["伏见稻荷千本鸟居", "和服体验（可选）", "清水寺 & 三年坂", "祇园花见小路"],
        pois: ["伏见稻荷", "清水寺", "祇园"],
        tips: "伏见稻荷建议7点前到",
      },
      {
        day: 2,
        title: "西线自然 · 岚山 & 金阁寺",
        activities: ["岚山竹林小径", "渡月桥", "金阁寺", "锦市场美食"],
        pois: ["岚山", "金阁寺", "锦市场"],
        tips: "岚山小火车需提前预约",
      },
    ],
    sourceVideos: [],
  },
  bali: {
    title: "巴厘岛 5 日经典路线",
    summary: "乌布文化、南部海滩、乌鲁瓦图悬崖，感受巴厘岛「众神之岛」的多元魅力。",
    days: [
      {
        day: 1,
        title: "抵达 & 库塔初探",
        activities: ["抵达登巴萨机场", "库塔海滩日落", "库塔夜市觅食", "印尼传统按摩"],
        pois: ["库塔海滩", "登巴萨"],
        tips: "机场到库塔约20分钟，建议提前换印尼盾",
      },
      {
        day: 2,
        title: "乌布文化之旅",
        activities: ["德格拉朗梯田", "乌布猴森林", "乌布皇宫", "传统舞表演（可选）"],
        pois: ["乌布", "德格拉朗梯田", "猴森林"],
        tips: "乌布交通较堵，建议包车或租摩托",
      },
      {
        day: 3,
        title: "南部海滩 & 悬崖",
        activities: ["水明漾海滩 Brunch", "乌鲁瓦图寺", "Kecak 火舞", "金巴兰海鲜晚餐"],
        pois: ["水明漾", "乌鲁瓦图", "金巴兰"],
        tips: "乌鲁瓦图猴子会抢东西，保管好随身物品",
      },
      {
        day: 4,
        title: "北部探索 · 瀑布 & 火山",
        activities: ["圣泉寺净化仪式", "Tegenungan 瀑布", "京打马尼火山观景", "咖啡园 Luwak 体验"],
        pois: ["圣泉寺", "京打马尼"],
        tips: "北部路程较远，建议全天包车",
      },
      {
        day: 5,
        title: "休闲收尾 & 返程",
        activities: ["网红秋千/鸟巢拍照", "乌布手工市场买伴手礼", "SPA 放松", "前往机场"],
        pois: ["乌布市场"],
        tips: "返程建议预留3小时到机场",
      },
    ],
    sourceVideos: [],
  },
  singapore: {
    title: "新加坡 3 日经典路线",
    summary: "滨海湾天际线、多元美食、圣淘沙娱乐，高效玩转花园城市。",
    days: [
      {
        day: 1,
        title: "地标打卡 · 滨海湾",
        activities: ["滨海湾金沙 SkyPark", "滨海湾花园 Cloud Forest", "超级树灯光秀", "克拉码头晚餐"],
        pois: ["滨海湾金沙", "滨海湾花园", "克拉码头"],
        tips: "超级树灯光秀 19:45 / 20:45 各一场",
      },
      {
        day: 2,
        title: "文化街区 & 美食",
        activities: ["牛车水 Buddha Tooth Relic Temple", "哈芝巷拍照", "小印度", "Maxwell 熟食中心"],
        pois: ["牛车水", "哈芝巷", "小印度"],
        tips: "熟食中心只收现金，提前准备新币",
      },
      {
        day: 3,
        title: "圣淘沙 & 返程",
        activities: ["环球影城或 S.E.A. 水族馆", "巴拉湾海滩", "樟宜机场 Jewel 瀑布", "返程"],
        pois: ["圣淘沙", "樟宜机场"],
        tips: "环球影城建议买 Express Pass，圣淘沙捷运免费",
      },
    ],
    sourceVideos: [],
  },
};

export function synthesizeItinerary(query: string, sourceVideos: Video[]): SynthesizedItinerary {
  const city = extractCity(query) ?? sourceVideos[0]?.city ?? "tokyo";
  const template = ITINERARY_TEMPLATES[city] ?? ITINERARY_TEMPLATES.tokyo;

  const dayMatch = query.match(/(\d+)\s*[天日]/);
  const days = dayMatch ? Math.min(parseInt(dayMatch[1]), template.days.length) : template.days.length;

  const budgetMatch = query.match(/预算\s*(\d+)/);

  return {
    ...template,
    title: dayMatch
      ? `${CITY_DISPLAY_NAMES[city] ?? city} ${dayMatch[1]} 日路线`
      : template.title,
    days: template.days.slice(0, days),
    ...(budgetMatch ? { budget: `约 ¥${budgetMatch[1]} / 人（不含机票）` } : {}),
    sourceVideos: sourceVideos.slice(0, 4),
    summary: template.summary + (sourceVideos.length > 0
      ? ` 综合了 ${sourceVideos.length} 位创作者的视频经验。`
      : ""),
  };
}

export async function synthesizeItineraryWithLLM(
  query: string,
  sourceVideos: Video[]
): Promise<SynthesizedItinerary> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return synthesizeItinerary(query, sourceVideos);

  try {
    const context = sourceVideos
      .map((v) => `[${v.creator}] ${v.title}: ${v.transcript}`)
      .join("\n");

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
            content: `你是旅游攻略助手。根据创作者视频内容，为用户生成结构化行程。
返回 JSON: {"title":"...","summary":"...","days":[{"day":1,"title":"...","activities":["..."],"pois":["..."],"tips":"..."}]}`,
          },
          {
            role: "user",
            content: `Query: ${query}\n\nVideo content:\n${context}`,
          },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) return synthesizeItinerary(query, sourceVideos);

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? "";
    const parsed = JSON.parse(content.replace(/```json\n?|\n?```/g, ""));

    return {
      ...parsed,
      sourceVideos: sourceVideos.slice(0, 4),
    };
  } catch {
    return synthesizeItinerary(query, sourceVideos);
  }
}
