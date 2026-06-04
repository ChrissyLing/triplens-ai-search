export type City = "tokyo" | "bangkok" | "kyoto" | "bali" | "singapore";
export type SearchIntent = "learn" | "discover" | "transact" | "navigate";

export interface IntentResult {
  intent: SearchIntent;
  confidence: number;
  reasoning: string;
  constraints?: string[];
}

export interface Video {
  id: string;
  title: string;
  creator: string;
  city: City;
  intent_tags: SearchIntent[];
  transcript: string;
  pois: string[];
  tags: string[];
  thumbnail: string;
  views: string;
  day?: number;
}

export interface POI {
  id: string;
  name: string;
  nameEn: string;
  city: City;
  category: string;
  intent_tags: SearchIntent[];
  description: string;
  tags: string[];
  priceLevel: string;
  queueTime?: string;
  rating: number;
  thumbnail: string;
  address: string;
  relatedVideoIds: string[];
}

export interface Listing {
  id: string;
  name: string;
  city: City;
  type: "hotel" | "ticket" | "tour";
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  thumbnail: string;
  provider: string;
  relatedVideoIds: string[];
  tags: string[];
}

export interface ItineraryDay {
  day: number;
  title: string;
  activities: string[];
  pois: string[];
  tips: string;
}

export interface SynthesizedItinerary {
  title: string;
  summary: string;
  days: ItineraryDay[];
  budget?: string;
  sourceVideos: Video[];
}

export interface SearchResponse {
  query: string;
  intent: IntentResult;
  videos: Video[];
  pois?: POI[];
  listings?: Listing[];
  itinerary?: SynthesizedItinerary;
  navigateTarget?: {
    type: "poi" | "creator";
    name: string;
    description: string;
    thumbnail: string;
    relatedVideos: Video[];
  };
}

export const INTENT_LABELS: Record<SearchIntent, string> = {
  learn: "攻略规划 Learn",
  discover: "探店发现 Discover",
  transact: "预订交易 Transact",
  navigate: "直达目标 Navigate",
};

export const INTENT_COLORS: Record<SearchIntent, string> = {
  learn: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  discover: "bg-purple-500/20 text-purple-300 border-purple-500/40",
  transact: "bg-green-500/20 text-green-300 border-green-500/40",
  navigate: "bg-orange-500/20 text-orange-300 border-orange-500/40",
};

export const SAMPLE_QUERIES = [
  { query: "东京三日游攻略", intent: "learn" as SearchIntent },
  { query: "巴厘岛5天怎么玩", intent: "learn" as SearchIntent },
  { query: "新加坡美食推荐", intent: "discover" as SearchIntent },
  { query: "涩谷小众咖啡店", intent: "discover" as SearchIntent },
  { query: "乌布网红餐厅", intent: "discover" as SearchIntent },
  { query: "圣淘沙门票", intent: "transact" as SearchIntent },
  { query: "东京迪士尼门票", intent: "transact" as SearchIntent },
  { query: "乌鲁瓦图悬崖", intent: "navigate" as SearchIntent },
  { query: "滨海湾金沙", intent: "navigate" as SearchIntent },
];
