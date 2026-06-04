import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "..", "data");
mkdirSync(dataDir, { recursive: true });

const thumb = (seed) =>
  `https://images.unsplash.com/photo-${seed}?w=400&h=600&fit=crop`;

const tokyoVideos = [
  { title: "东京3日暴走路线｜新手不踩坑", creator: "@tokyo_walker", intent: "learn", pois: ["浅草寺", "秋叶原", "新宿"], tags: ["新手友好", "步行多", "预算中等"], day: 1 },
  { title: "东京Day2｜表参道+原宿逛街攻略", creator: "@tokyo_walker", intent: "learn", pois: ["表参道", "原宿", "明治神宫"], tags: ["购物", "拍照"], day: 2 },
  { title: "东京Day3｜台场+银座完美收官", creator: "@tokyo_walker", intent: "learn", pois: ["台场", "银座", "东京塔"], tags: ["浪漫", "夜景"], day: 3 },
  { title: "第一次去东京必看10个Tips", creator: "@japan_first_timer", intent: "learn", pois: ["成田机场", "Suica卡"], tags: ["新手", "交通", "省钱"], day: 0 },
  { title: "东京5天深度游｜小众路线分享", creator: "@hidden_tokyo", intent: "learn", pois: ["谷中银座", "清澄白河", "中目黑"], tags: ["深度游", "小众"], day: 0 },
  { title: "东京预算5000元怎么玩", creator: "@budget_travel_jp", intent: "learn", pois: ["新宿", "上野", "筑地"], tags: ["穷游", "预算友好"], day: 0 },
  { title: "涩谷8家必去小众咖啡店", creator: "@cafe_hunter_tokyo", intent: "discover", pois: ["涩谷", "Fuglen", "About Life Coffee"], tags: ["咖啡", "拍照", "小众"], day: 0 },
  { title: "新宿深夜居酒屋探店", creator: "@tokyo_foodie", intent: "discover", pois: ["新宿", "思い出横丁"], tags: ["美食", "居酒屋", "深夜"], day: 0 },
  { title: "表参道最美买手店合集", creator: "@fashion_tokyo", intent: "discover", pois: ["表参道", "南青山"], tags: ["购物", "时尚", "买手店"], day: 0 },
  { title: "下北泽古着天堂vlog", creator: "@vintage_lover", intent: "discover", pois: ["下北泽"], tags: ["古着", "二手", "潮流"], day: 0 },
  { title: "东京迪士尼购票全攻略2024", creator: "@disney_japan", intent: "transact", pois: ["东京迪士尼"], tags: ["门票", "迪士尼", "攻略"], day: 0 },
  { title: "成田机场周边酒店测评", creator: "@hotel_reviewer_jp", intent: "transact", pois: ["成田机场", "希尔顿成田"], tags: ["酒店", "机场", "测评"], day: 0 },
  { title: "新宿平价酒店Top5推荐", creator: "@budget_stay", intent: "transact", pois: ["新宿", "格拉斯丽新宿"], tags: ["酒店", "平价", "推荐"], day: 0 },
  { title: "浅草寺完整游览指南", creator: "@sensoji_guide", intent: "navigate", pois: ["浅草寺"], tags: ["寺庙", "文化", "必去"], day: 0 },
  { title: "@tokyo_walker 东京合集", creator: "@tokyo_walker", intent: "navigate", pois: ["东京"], tags: ["创作者", "合集"], day: 0 },
  { title: "秋叶原动漫朝圣一日路线", creator: "@anime_pilgrim", intent: "learn", pois: ["秋叶原", "Animate", "女仆咖啡厅"], tags: ["动漫", "宅文化"], day: 1 },
  { title: "东京赏樱最佳地点TOP7", creator: "@sakura_tokyo", intent: "discover", pois: ["上野公园", "新宿御苑", "目黑川"], tags: ["赏樱", "季节限定"], day: 0 },
  { title: "筑地市场早餐攻略", creator: "@tokyo_foodie", intent: "discover", pois: ["筑地市场", "丰洲市场"], tags: ["海鲜", "早餐", "美食"], day: 0 },
  { title: "东京塔夜景最佳机位", creator: "@photo_spots_jp", intent: "discover", pois: ["东京塔", "六本木"], tags: ["拍照", "夜景", "机位"], day: 0 },
  { title: "东京地铁通票怎么买最划算", creator: "@japan_first_timer", intent: "learn", pois: ["东京站"], tags: ["交通", "省钱", "通票"], day: 0 },
];

const bangkokVideos = [
  { title: "曼谷3天懒人包攻略", creator: "@bkk_explorer", intent: "learn", pois: ["大皇宫", "考山路", "暹罗"], tags: ["新手", "经典路线"], day: 0 },
  { title: "第一次去泰国必知10件事", creator: "@thai_tips", intent: "learn", pois: ["曼谷"], tags: ["注意事项", "文化", "安全"], day: 0 },
  { title: "曼谷夜市终极指南", creator: "@night_market_bkk", intent: "discover", pois: ["拉差达火车夜市", "Asiatique"], tags: ["夜市", "美食", "必去"], day: 0 },
  { title: "曼谷必吃街头美食TOP10", creator: "@street_food_bkk", intent: "discover", pois: ["唐人街", "暹罗"], tags: ["街头美食", "泰餐"], day: 0 },
  { title: "曼谷网红咖啡店打卡", creator: "@cafe_bkk", intent: "discover", pois: ["通罗", "Ekkamai"], tags: ["咖啡", "网红", "拍照"], day: 0 },
  { title: "大皇宫+卧佛寺一日游", creator: "@bkk_explorer", intent: "learn", pois: ["大皇宫", "卧佛寺", "郑王庙"], tags: ["寺庙", "经典"], day: 1 },
  { title: "曼谷水上市场体验", creator: "@floating_market", intent: "discover", pois: ["丹嫩沙多水上市场"], tags: ["水上市场", "体验"], day: 0 },
  { title: "曼谷按摩SPA推荐", creator: "@spa_bkk", intent: "discover", pois: ["暹罗", "素坤逸"], tags: ["SPA", "按摩", "放松"], day: 0 },
  { title: "曼谷酒店性价比之王", creator: "@hotel_bkk", intent: "transact", pois: ["暹罗", "素坤逸"], tags: ["酒店", "性价比"], day: 0 },
  { title: "曼谷机场快线+交通卡攻略", creator: "@thai_tips", intent: "transact", pois: ["素万那普机场"], tags: ["交通", "机场"], day: 0 },
  { title: "大皇宫门票怎么买", creator: "@bkk_tickets", intent: "transact", pois: ["大皇宫"], tags: ["门票", "购票"], day: 0 },
  { title: "考山路背包客天堂", creator: "@backpack_bkk", intent: "navigate", pois: ["考山路"], tags: ["背包客", "夜生活"], day: 0 },
  { title: "@bkk_explorer 曼谷合集", creator: "@bkk_explorer", intent: "navigate", pois: ["曼谷"], tags: ["创作者", "合集"], day: 0 },
  { title: "曼谷Chatuchak周末市场", creator: "@market_bkk", intent: "discover", pois: ["Chatuchak"], tags: ["市场", "购物", "周末"], day: 0 },
  { title: "曼谷 rooftop bar 推荐", creator: "@nightlife_bkk", intent: "discover", pois: ["Lebua", "Octave"], tags: ["酒吧", "夜景", "高端"], day: 0 },
  { title: "曼谷泰式烹饪课体验", creator: "@cook_thai", intent: "discover", pois: ["暹罗"], tags: ["体验", "烹饪", "文化"], day: 0 },
  { title: "曼谷4天深度文化之旅", creator: "@culture_bkk", intent: "learn", pois: ["大皇宫", "国家博物馆", "金山寺"], tags: ["文化", "深度游"], day: 0 },
  { title: "曼谷BTS地铁沿线美食", creator: "@street_food_bkk", intent: "discover", pois: ["暹罗", "Asok"], tags: ["地铁", "美食", "沿线"], day: 0 },
  { title: "曼谷亲子游攻略", creator: "@family_bkk", intent: "learn", pois: ["暹罗海洋世界", "Safari World"], tags: ["亲子", "家庭"], day: 0 },
  { title: "曼谷退税全攻略", creator: "@shop_bkk", intent: "learn", pois: ["暹罗", "Central World"], tags: ["购物", "退税", "省钱"], day: 0 },
];

const kyotoVideos = [
  { title: "京都2日经典路线", creator: "@kyoto_guide", intent: "learn", pois: ["伏见稻荷", "清水寺", "祇园"], tags: ["经典", "必去"], day: 0 },
  { title: "京都和服体验完整攻略", creator: "@kimono_kyoto", intent: "learn", pois: ["祇园", "清水寺"], tags: ["和服", "体验", "拍照"], day: 0 },
  { title: "伏见稻荷千本鸟居拍照指南", creator: "@photo_kyoto", intent: "discover", pois: ["伏见稻荷大社"], tags: ["拍照", "鸟居", "网红"], day: 0 },
  { title: "京都最美咖啡店5家", creator: "@cafe_kyoto", intent: "discover", pois: ["哲学之道", "岚山"], tags: ["咖啡", "文艺", "小众"], day: 0 },
  { title: "祇园花见小路探店", creator: "@geisha_kyoto", intent: "discover", pois: ["祇园", "花见小路"], tags: ["传统", "艺伎", "文化"], day: 0 },
  { title: "岚山竹林+渡月桥一日游", creator: "@kyoto_guide", intent: "learn", pois: ["岚山", "竹林小径", "渡月桥"], tags: ["自然", "经典"], day: 1 },
  { title: "京都怀石料理推荐", creator: "@fine_dining_kyoto", intent: "discover", pois: ["祇园", "先斗町"], tags: ["美食", "怀石", "高端"], day: 0 },
  { title: "金阁寺最佳游览时间", creator: "@temple_kyoto", intent: "navigate", pois: ["金阁寺"], tags: ["寺庙", "必去"], day: 0 },
  { title: "@kyoto_guide 京都vlog合集", creator: "@kyoto_guide", intent: "navigate", pois: ["京都"], tags: ["创作者", "合集"], day: 0 },
  { title: "清水寺周边漫步路线", creator: "@walk_kyoto", intent: "discover", pois: ["清水寺", "二年坂", "三年坂"], tags: ["漫步", "老街", "拍照"], day: 0 },
  { title: "京都传统町屋住宿推荐", creator: "@stay_kyoto", intent: "transact", pois: ["祇园", "东山区"], tags: ["住宿", "町屋", "传统"], day: 0 },
  { title: "岚山小火车购票攻略", creator: "@kyoto_tickets", intent: "transact", pois: ["岚山"], tags: ["门票", "小火车"], day: 0 },
  { title: "京都赏枫最佳地点", creator: "@autumn_kyoto", intent: "discover", pois: ["东福寺", "永观堂", "岚山"], tags: ["赏枫", "季节限定"], day: 0 },
  { title: "京都3日深度文化游", creator: "@culture_kyoto", intent: "learn", pois: ["二条城", "龙安寺", "银阁寺"], tags: ["文化", "深度游"], day: 0 },
  { title: "锦市场美食扫街", creator: "@market_kyoto", intent: "discover", pois: ["锦市场"], tags: ["市场", "美食", "扫街"], day: 0 },
  { title: "京都寺庙晨间参拜体验", creator: "@zen_kyoto", intent: "discover", pois: ["南禅寺", "建仁寺"], tags: ["禅", "晨间", "体验"], day: 0 },
  { title: "宇治抹茶半日游", creator: "@matcha_kyoto", intent: "learn", pois: ["宇治", "平等院"], tags: ["抹茶", "半日游"], day: 0 },
  { title: "京都交通巴士一日券攻略", creator: "@transit_kyoto", intent: "learn", pois: ["京都站"], tags: ["交通", "省钱"], day: 0 },
  { title: "先斗町居酒屋之夜", creator: "@night_kyoto", intent: "discover", pois: ["先斗町", "鸭川"], tags: ["居酒屋", "夜生活"], day: 0 },
  { title: "哲学之道樱花季漫步", creator: "@sakura_kyoto", intent: "discover", pois: ["哲学之道"], tags: ["赏樱", "漫步", "季节"], day: 0 },
];

const baliVideos = [
  { title: "巴厘岛5天完整攻略｜新手必看", creator: "@bali_explorer", intent: "learn", pois: ["库塔", "乌布", "乌鲁瓦图"], tags: ["新手", "经典路线"], day: 0 },
  { title: "巴厘岛Day1｜库塔海滩初体验", creator: "@bali_explorer", intent: "learn", pois: ["库塔海滩", "塞米亚克"], tags: ["海滩", "日落"], day: 1 },
  { title: "巴厘岛Day2｜乌布梯田+猴森林", creator: "@bali_explorer", intent: "learn", pois: ["德格拉朗梯田", "猴森林", "乌布皇宫"], tags: ["文化", "自然"], day: 2 },
  { title: "第一次去巴厘岛必知10件事", creator: "@bali_tips", intent: "learn", pois: ["登巴萨机场"], tags: ["注意事项", "签证", "换汇"], day: 0 },
  { title: "巴厘岛预算3000怎么玩", creator: "@budget_bali", intent: "learn", pois: ["库塔", "乌布"], tags: ["穷游", "预算友好"], day: 0 },
  { title: "乌布8家必去网红餐厅", creator: "@bali_foodie", intent: "discover", pois: ["乌布", "Locavore", "Mozaic"], tags: ["美食", "网红", "fine dining"], day: 0 },
  { title: "水明漾最好看的5家 beach club", creator: "@beach_bali", intent: "discover", pois: ["水明漾", "Potato Head", "Mrs Sippy"], tags: ["beach club", "派对", "拍照"], day: 0 },
  { title: "乌鲁瓦图悬崖最佳机位", creator: "@photo_bali", intent: "discover", pois: ["乌鲁瓦图寺", "情人崖"], tags: ["悬崖", "拍照", "日落"], day: 0 },
  { title: "金巴兰海鲜烧烤攻略", creator: "@bali_foodie", intent: "discover", pois: ["金巴兰海滩"], tags: ["海鲜", "烧烤", "日落晚餐"], day: 0 },
  { title: "乌布瑜伽 retreat 推荐", creator: "@wellness_bali", intent: "discover", pois: ["乌布"], tags: ["瑜伽", "SPA", "疗愈"], day: 0 },
  { title: "巴厘岛网红秋千全攻略", creator: "@instagram_bali", intent: "discover", pois: ["乌布"], tags: ["网红", "拍照", "秋千"], day: 0 },
  { title: "库塔冲浪新手体验", creator: "@surf_bali", intent: "discover", pois: ["库塔海滩"], tags: ["冲浪", "体验", "运动"], day: 0 },
  { title: "巴厘岛 villa 预订攻略", creator: "@stay_bali", intent: "transact", pois: ["水明漾", "乌布"], tags: ["villa", "住宿", "预订"], day: 0 },
  { title: "登巴萨机场周边酒店推荐", creator: "@hotel_bali", intent: "transact", pois: ["登巴萨机场"], tags: ["酒店", "机场", "转机"], day: 0 },
  { title: "乌鲁瓦图Kecak火舞门票", creator: "@bali_tickets", intent: "transact", pois: ["乌鲁瓦图寺"], tags: ["门票", "表演", "文化"], day: 0 },
  { title: "乌鲁瓦图寺完整游览指南", creator: "@temple_bali", intent: "navigate", pois: ["乌鲁瓦图寺"], tags: ["寺庙", "悬崖", "必去"], day: 0 },
  { title: "@bali_explorer 巴厘岛合集", creator: "@bali_explorer", intent: "navigate", pois: ["巴厘岛"], tags: ["创作者", "合集"], day: 0 },
  { title: "圣泉寺净化仪式体验", creator: "@culture_bali", intent: "discover", pois: ["圣泉寺"], tags: ["文化", "体验", "净化"], day: 0 },
  { title: "京打马尼火山一日游", creator: "@volcano_bali", intent: "learn", pois: ["京打马尼", "巴图尔火山"], tags: ["火山", "一日游", "自然"], day: 0 },
  { title: "巴厘岛包车 vs 租摩托怎么选", creator: "@bali_tips", intent: "learn", pois: ["巴厘岛"], tags: ["交通", "省钱", "攻略"], day: 0 },
];

const singaporeVideos = [
  { title: "新加坡3天懒人包攻略", creator: "@sg_explorer", intent: "learn", pois: ["滨海湾", "牛车水", "圣淘沙"], tags: ["新手", "经典路线"], day: 0 },
  { title: "新加坡Day1｜滨海湾天际线", creator: "@sg_explorer", intent: "learn", pois: ["滨海湾金沙", "滨海湾花园", "鱼尾狮"], tags: ["地标", "夜景"], day: 1 },
  { title: "新加坡Day2｜多元文化之旅", creator: "@sg_explorer", intent: "learn", pois: ["牛车水", "小印度", "哈芝巷"], tags: ["文化", "美食"], day: 2 },
  { title: "第一次去新加坡必看Tips", creator: "@sg_tips", intent: "learn", pois: ["樟宜机场"], tags: ["注意事项", "交通卡", "省钱"], day: 0 },
  { title: "新加坡美食终极指南", creator: "@sg_foodie", intent: "discover", pois: ["Maxwell", "老巴刹", "纽顿"], tags: ["美食", "hawker", "必吃"], day: 0 },
  { title: "牛车水必吃10家", creator: "@sg_foodie", intent: "discover", pois: ["牛车水", "麦士威熟食中心"], tags: ["中餐", "街头美食"], day: 0 },
  { title: "哈芝巷+甘榜格南拍照指南", creator: "@photo_sg", intent: "discover", pois: ["哈芝巷", "苏丹回教堂"], tags: ["拍照", "网红", "彩色房子"], day: 0 },
  { title: "新加坡最美5家咖啡馆", creator: "@cafe_sg", intent: "discover", pois: ["Tiong Bahru", "如切路"], tags: ["咖啡", "文艺", "小众"], day: 0 },
  { title: "圣淘沙怎么玩最划算", creator: "@sentosa_sg", intent: "learn", pois: ["圣淘沙", "环球影城"], tags: ["圣淘沙", "攻略", "省钱"], day: 0 },
  { title: "滨海湾花园拍照机位", creator: "@photo_sg", intent: "discover", pois: ["滨海湾花园", "超级树"], tags: ["拍照", "花园", "夜景"], day: 0 },
  { title: "环球影城新加坡购票攻略", creator: "@sg_tickets", intent: "transact", pois: ["环球影城"], tags: ["门票", "环球影城", "亲子"], day: 0 },
  { title: "滨海湾金沙酒店预订Tips", creator: "@hotel_sg", intent: "transact", pois: ["滨海湾金沙"], tags: ["酒店", "无边泳池", "预订"], day: 0 },
  { title: "樟宜机场附近酒店推荐", creator: "@hotel_sg", intent: "transact", pois: ["樟宜机场", "Jewel"], tags: ["酒店", "机场", "转机"], day: 0 },
  { title: "滨海湾金沙 SkyPark 直达", creator: "@marina_bay", intent: "navigate", pois: ["滨海湾金沙"], tags: ["地标", "必去", "SkyPark"], day: 0 },
  { title: "@sg_explorer 新加坡合集", creator: "@sg_explorer", intent: "navigate", pois: ["新加坡"], tags: ["创作者", "合集"], day: 0 },
  { title: "小印度彩色街景vlog", creator: "@culture_sg", intent: "discover", pois: ["小印度", "竹脚中心"], tags: ["印度文化", "市场", "美食"], day: 0 },
  { title: "东海岸公园骑行+海鲜", creator: "@outdoor_sg", intent: "discover", pois: ["东海岸公园"], tags: ["骑行", "海鲜", "本地生活"], day: 0 },
  { title: "新加坡5天深度游路线", creator: "@deep_sg", intent: "learn", pois: ["植物园", "国家美术馆", "河川生态园"], tags: ["深度游", "文化", "自然"], day: 0 },
  { title: "如切路娘惹文化探店", creator: "@culture_sg", intent: "discover", pois: ["如切路", "娘惹博物馆"], tags: ["娘惹", "文化", "探店"], day: 0 },
  { title: "新加坡地铁+巴士交通攻略", creator: "@sg_tips", intent: "learn", pois: ["樟宜机场"], tags: ["交通", "Ez-link", "省钱"], day: 0 },
];

const thumbs = {
  tokyo: ["1540959737352-9a0b0c69812a", "1493976060935-0f9a369e6087", "1528162054280-147b0e2768a9", "1503899037464-26b0bc64a3d4", "1536098010691-81d0d4a59a90"],
  bangkok: ["1552465011-b4ef21a79d7e", "1508009603885-50cf7c579365", "1528181304800-2592c0df9920", "1563492065593-61f49c0a832d", "1559592413-7c0a0c0b0b0b"],
  kyoto: ["1491888946425-aa0ced6532f0", "1545569341-9dbca384fa12", "1524413306007-f56e967dc903", "1578478389160-e3c929d5992e", "1528365851839-021875d310a7"],
  bali: ["1537996195441-565783c4df4b", "1518548419970-58e640b2790e", "1555409288-cdc736c5939d", "1512453979798-5ea266f9340b", "1507525428034-b723cf961d3e"],
  singapore: ["1525621042936-feaa9a022b7a", "1529655683827-abb9c99c4d1a", "1565967511843-21a8c516fa8a", "1567365689960-8e4f3a2a0a0a", "1540959737352-9a0b0c69812a"],
};

const CITY_PREFIX = {
  tokyo: "t",
  bangkok: "b",
  kyoto: "k",
  bali: "l",
  singapore: "s",
};

function buildVideos(cityVideos, city) {
  const prefix = CITY_PREFIX[city];
  return cityVideos.map((v, i) => ({
    id: `${prefix}${String(i + 1).padStart(3, "0")}`,
    title: v.title,
    creator: v.creator,
    city,
    intent_tags: [v.intent],
    transcript: `${v.title}。今天带大家探索${v.pois.join("、")}。${v.tags.join("，")}。强烈推荐！`,
    pois: v.pois,
    tags: v.tags,
    thumbnail: thumb(thumbs[city][i % thumbs[city].length]),
    views: `${(Math.random() * 2 + 0.1).toFixed(1)}M`,
    ...(v.day !== undefined && v.day > 0 ? { day: v.day } : {}),
  }));
}

const videos = [
  ...buildVideos(tokyoVideos, "tokyo"),
  ...buildVideos(bangkokVideos, "bangkok"),
  ...buildVideos(kyotoVideos, "kyoto"),
  ...buildVideos(baliVideos, "bali"),
  ...buildVideos(singaporeVideos, "singapore"),
];

const pois = [
  { id: "p001", name: "浅草寺", nameEn: "Senso-ji", city: "tokyo", category: "寺庙", intent: "navigate", description: "东京最古老寺庙，雷门是标志性打卡点", tags: ["必去", "文化", "免费"], priceLevel: "免费", rating: 4.7, address: "台东区浅草2-3-1", videos: ["t014", "t001"] },
  { id: "p002", name: "Fuglen Coffee", nameEn: "Fuglen", city: "tokyo", category: "咖啡", intent: "discover", description: "来自挪威的精品咖啡，北欧复古装修", tags: ["咖啡", "拍照", "小众"], priceLevel: "¥800-1200", queueTime: "约15分钟", rating: 4.5, address: "涩谷区 Tomigaya 1-16-11", videos: ["t007"] },
  { id: "p003", name: "About Life Coffee", nameEn: "About Life", city: "tokyo", category: "咖啡", intent: "discover", description: "涩谷站旁站立式精品咖啡", tags: ["咖啡", "快速", "本地人气"], priceLevel: "¥500-800", queueTime: "约5分钟", rating: 4.4, address: "涩谷区道玄坂", videos: ["t007"] },
  { id: "p004", name: "思い出横丁", nameEn: "Omoide Yokocho", city: "tokyo", category: "居酒屋", intent: "discover", description: "新宿黄金街，窄巷里的传统居酒屋", tags: ["居酒屋", "深夜", "本地"], priceLevel: "¥2000-4000", queueTime: "周末需排队", rating: 4.6, address: "新宿区西新宿1", videos: ["t008"] },
  { id: "p005", name: "拉差达火车夜市", nameEn: "Train Night Market", city: "bangkok", category: "夜市", intent: "discover", description: "彩色帐篷夜市，美食与购物天堂", tags: ["夜市", "美食", "拍照"], priceLevel: "฿200-500", queueTime: "19:00后高峰", rating: 4.3, address: "Ratchada", videos: ["b003"] },
  { id: "p006", name: "唐人街", nameEn: "Yaowarat", city: "bangkok", category: "美食", intent: "discover", description: "曼谷最热闹的华人美食街", tags: ["街头美食", "海鲜", "夜宵"], priceLevel: "฿100-300", rating: 4.5, address: "Yaowarat Road", videos: ["b004"] },
  { id: "p007", name: "伏见稻荷大社", nameEn: "Fushimi Inari", city: "kyoto", category: "神社", intent: "navigate", description: "千本鸟居，京都最 iconic 景点", tags: ["必去", "拍照", "免费"], priceLevel: "免费", queueTime: "清晨人少", rating: 4.8, address: "伏见区深草", videos: ["k003", "k001"] },
  { id: "p008", name: "哲学之道", nameEn: "Philosopher's Path", city: "kyoto", category: "咖啡", intent: "discover", description: "樱花季最美散步道，沿途有多家文艺咖啡", tags: ["咖啡", "文艺", "赏樱"], priceLevel: "¥600-1000", rating: 4.6, address: "左京区", videos: ["k004", "k020"] },
  { id: "p009", name: "锦市场", nameEn: "Nishiki Market", city: "kyoto", category: "市场", intent: "discover", description: "京都厨房，400年历史的传统市场", tags: ["市场", "美食", "扫街"], priceLevel: "¥500-2000", rating: 4.5, address: "中京区", videos: ["k015"] },
  { id: "p010", name: "上野公园", nameEn: "Ueno Park", city: "tokyo", category: "公园", intent: "discover", description: "东京最佳赏樱地点之一", tags: ["赏樱", "免费", "博物馆"], priceLevel: "免费", rating: 4.6, address: "台东区上野", videos: ["t017"] },
  { id: "p011", name: "大皇宫", nameEn: "Grand Palace", city: "bangkok", category: "宫殿", intent: "navigate", description: "泰国王室宫殿，曼谷必去", tags: ["必去", "文化", "门票"], priceLevel: "฿500", rating: 4.4, address: "Phra Nakhon", videos: ["b006", "b011"] },
  { id: "p012", name: "金阁寺", nameEn: "Kinkaku-ji", city: "kyoto", category: "寺庙", intent: "navigate", description: "世界文化遗产，金箔覆盖的舍利殿", tags: ["必去", "世界遗产"], priceLevel: "¥500", rating: 4.7, address: "北区", videos: ["k008"] },
  { id: "p013", name: "Chatuchak周末市场", nameEn: "Chatuchak", city: "bangkok", category: "市场", intent: "discover", description: "东南亚最大周末市场，11000+摊位", tags: ["购物", "周末", "淘宝"], priceLevel: "฿100-1000", queueTime: "周末10:00后", rating: 4.4, address: "Chatuchak", videos: ["b014"] },
  { id: "p014", name: "清水寺", nameEn: "Kiyomizu-dera", city: "kyoto", category: "寺庙", intent: "navigate", description: "京都代表性寺庙，清水舞台俯瞰全城", tags: ["必去", "拍照", "文化"], priceLevel: "¥400", rating: 4.7, address: "东山区", videos: ["k001", "k010"] },
  { id: "p015", name: "筑地外市场", nameEn: "Tsukiji Outer", city: "tokyo", category: "美食", intent: "discover", description: "新鲜海鲜早餐，玉子烧和海胆饭必吃", tags: ["海鲜", "早餐", "美食"], priceLevel: "¥1000-3000", queueTime: "早上7-9点", rating: 4.5, address: "中央区筑地", videos: ["t018"] },
  { id: "p016", name: "乌鲁瓦图寺", nameEn: "Uluwatu Temple", city: "bali", category: "寺庙", intent: "navigate", description: "悬崖上的海神庙，Kecak 火舞日落必看", tags: ["悬崖", "日落", "必去"], priceLevel: "IDR 50k", queueTime: "17:00 看火舞", rating: 4.7, address: "Pecatu, Badung", videos: ["l016", "l008"] },
  { id: "p017", name: "德格拉朗梯田", nameEn: "Tegallalang Rice Terrace", city: "bali", category: "自然", intent: "discover", description: "乌布标志性梯田，Swing 网红拍照点", tags: ["梯田", "拍照", "网红"], priceLevel: "IDR 20k", queueTime: "早上人少", rating: 4.5, address: "Tegallalang, Ubud", videos: ["l002", "l011"] },
  { id: "p018", name: "Potato Head Beach Club", nameEn: "Potato Head", city: "bali", category: "Beach Club", intent: "discover", description: "水明漾最火 beach club，日落派对", tags: ["beach club", "派对", "日落"], priceLevel: "IDR 300k+", queueTime: "周末需预约", rating: 4.6, address: "Seminyak", videos: ["l007"] },
  { id: "p019", name: "乌布猴森林", nameEn: "Sacred Monkey Forest", city: "bali", category: "自然", intent: "discover", description: "乌布圣猴森林，与数百只猴子互动", tags: ["猴子", "自然", "文化"], priceLevel: "IDR 80k", rating: 4.4, address: "Ubud", videos: ["l002", "l006"] },
  { id: "p020", name: "滨海湾金沙", nameEn: "Marina Bay Sands", city: "singapore", category: "地标", intent: "navigate", description: "新加坡地标，SkyPark 无边泳池俯瞰全城", tags: ["地标", "必去", "夜景"], priceLevel: "S$20+ SkyPark", rating: 4.6, address: "10 Bayfront Ave", videos: ["s002", "s014"] },
  { id: "p021", name: "牛车水", nameEn: "Chinatown", city: "singapore", category: "文化街区", intent: "discover", description: "新加坡华人之家，麦士威熟食中心美食天堂", tags: ["中餐", "美食", "文化"], priceLevel: "S$5-15", rating: 4.5, address: "Chinatown", videos: ["s006", "s003"] },
  { id: "p022", name: "哈芝巷", nameEn: "Haji Lane", city: "singapore", category: "街区", intent: "discover", description: "彩色涂鸦墙，独立设计师店铺", tags: ["拍照", "网红", "购物"], priceLevel: "免费", rating: 4.4, address: "Kampong Glam", videos: ["s007"] },
  { id: "p023", name: "滨海湾花园", nameEn: "Gardens by the Bay", city: "singapore", category: "公园", intent: "discover", description: "超级树 + Cloud Forest，未来感花园", tags: ["花园", "夜景", "超级树"], priceLevel: "S$28", queueTime: "19:45 灯光秀", rating: 4.7, address: "18 Marina Gardens Dr", videos: ["s002", "s010"] },
  { id: "p024", name: "圣淘沙", nameEn: "Sentosa", city: "singapore", category: "娱乐", intent: "navigate", description: "环球影城、海滩、水族馆一站式度假岛", tags: ["亲子", "环球影城", "海滩"], priceLevel: "S$50+", rating: 4.5, address: "Sentosa Island", videos: ["s009", "s011"] },
];

const poiData = pois.map((p) => ({
  id: p.id,
  name: p.name,
  nameEn: p.nameEn,
  city: p.city,
  category: p.category,
  intent_tags: [p.intent],
  description: p.description,
  tags: p.tags,
  priceLevel: p.priceLevel,
  ...(p.queueTime ? { queueTime: p.queueTime } : {}),
  rating: p.rating,
  thumbnail: thumb(thumbs[p.city][parseInt(p.id.slice(-1)) % 5]),
  address: p.address,
  relatedVideoIds: p.videos,
}));

const listings = [
  { id: "l001", name: "东京迪士尼乐园 1日票", city: "tokyo", type: "ticket", price: 7900, currency: "JPY", rating: 4.6, reviewCount: 12500, provider: "Klook", tags: ["迪士尼", "亲子", "热门"], videos: ["t011"], thumb: "1540959737352-9a0b0c69812a" },
  { id: "l002", name: "东京迪士尼乐园 快速通行", city: "tokyo", type: "ticket", price: 15000, currency: "JPY", rating: 4.4, reviewCount: 3200, provider: "官方", tags: ["迪士尼", "免排队"], videos: ["t011"], thumb: "1493976060935-0f9a369e6087" },
  { id: "l003", name: "希尔顿成田机场酒店", city: "tokyo", type: "hotel", price: 12000, currency: "JPY", rating: 4.3, reviewCount: 8900, provider: "Booking", tags: ["机场", "转机", "舒适"], videos: ["t012"], thumb: "1528162054280-147b0e2768a9" },
  { id: "l004", name: "格拉斯丽新宿酒店", city: "tokyo", type: "hotel", price: 8500, currency: "JPY", rating: 4.5, reviewCount: 6700, provider: "Agoda", tags: ["新宿", "哥斯拉主题", "性价比"], videos: ["t013"], thumb: "1503899037464-26b0bc64a3d4" },
  { id: "l005", name: "新宿华盛顿酒店", city: "tokyo", type: "hotel", price: 6500, currency: "JPY", rating: 4.1, reviewCount: 4500, provider: "Booking", tags: ["新宿", "平价", "交通方便"], videos: ["t013"], thumb: "1536098010691-81d0d4a59a90" },
  { id: "l006", name: "大皇宫门票+导览", city: "bangkok", type: "ticket", price: 500, currency: "THB", rating: 4.2, reviewCount: 9800, provider: "Trip.com", tags: ["大皇宫", "导览"], videos: ["b011"], thumb: "1552465011-b4ef21a79d7e" },
  { id: "l007", name: "曼谷暹罗智选假日酒店", city: "bangkok", type: "hotel", price: 2800, currency: "THB", rating: 4.4, reviewCount: 5600, provider: "Agoda", tags: ["暹罗", "BTS沿线", "性价比"], videos: ["b009"], thumb: "1508009603885-50cf7c579365" },
  { id: "l008", name: "岚山小火车 tickets", city: "kyoto", type: "ticket", price: 880, currency: "JPY", rating: 4.5, reviewCount: 4200, provider: "官方", tags: ["岚山", "小火车", "赏枫"], videos: ["k012"], thumb: "1491888946425-aa0ced6532f0" },
  { id: "l009", name: "京都祇园町屋民宿", city: "kyoto", type: "hotel", price: 15000, currency: "JPY", rating: 4.7, reviewCount: 890, provider: "Airbnb", tags: ["町屋", "传统", "体验"], videos: ["k011"], thumb: "1545569341-9dbca384fa12" },
  { id: "l010", name: "东京SKYTREE门票", city: "tokyo", type: "ticket", price: 2100, currency: "JPY", rating: 4.5, reviewCount: 7800, provider: "Klook", tags: ["晴空塔", "夜景"], videos: ["t003"], thumb: "1528162054280-147b0e2768a9" },
  { id: "l011", name: "水明漾私人 Villa 2晚", city: "bali", type: "hotel", price: 2800000, currency: "IDR", rating: 4.8, reviewCount: 1200, provider: "Airbnb", tags: ["villa", "泳池", "浪漫"], videos: ["l013"], thumb: "1537996195441-565783c4df4b" },
  { id: "l012", name: "乌鲁瓦图 Kecak 火舞门票", city: "bali", type: "ticket", price: 150000, currency: "IDR", rating: 4.6, reviewCount: 3400, provider: "Klook", tags: ["火舞", "日落", "文化"], videos: ["l015"], thumb: "1518548419970-58e640b2790e" },
  { id: "l013", name: "乌布梯田 Swing 体验", city: "bali", type: "tour", price: 350000, currency: "IDR", rating: 4.3, reviewCount: 8900, provider: "Trip.com", tags: ["网红", "Swing", "拍照"], videos: ["l011"], thumb: "1555409288-cdc736c5939d" },
  { id: "l014", name: "登巴萨机场接机+包车1日", city: "bali", type: "tour", price: 650000, currency: "IDR", rating: 4.5, reviewCount: 2100, provider: "Klook", tags: ["接机", "包车", "方便"], videos: ["l014"], thumb: "1512453979798-5ea266f9340b" },
  { id: "l015", name: "环球影城新加坡 1日票", city: "singapore", type: "ticket", price: 82, currency: "SGD", rating: 4.5, reviewCount: 15600, provider: "官方", tags: ["环球影城", "亲子", "热门"], videos: ["s011"], thumb: "1525621042936-feaa9a022b7a" },
  { id: "l016", name: "滨海湾金沙 2晚", city: "singapore", type: "hotel", price: 680, currency: "SGD", rating: 4.6, reviewCount: 9800, provider: "Booking", tags: ["无边泳池", "地标", "奢华"], videos: ["s012"], thumb: "1529655683827-abb9c99c4d1a" },
  { id: "l017", name: "樟宜机场胶囊酒店", city: "singapore", type: "hotel", price: 80, currency: "SGD", rating: 4.2, reviewCount: 3200, provider: "Agoda", tags: ["机场", "转机", "平价"], videos: ["s013"], thumb: "1565967511843-21a8c516fa8a" },
  { id: "l018", name: "滨海湾花园 双馆门票", city: "singapore", type: "ticket", price: 28, currency: "SGD", rating: 4.7, reviewCount: 11200, provider: "Klook", tags: ["超级树", "Cloud Forest"], videos: ["s010"], thumb: "1567365689960-8e4f3a2a0a0a" },
];

const listingData = listings.map((l) => ({
  id: l.id,
  name: l.name,
  city: l.city,
  type: l.type,
  price: l.price,
  currency: l.currency,
  rating: l.rating,
  reviewCount: l.reviewCount,
  thumbnail: thumb(l.thumb),
  provider: l.provider,
  relatedVideoIds: l.videos,
  tags: l.tags,
}));

writeFileSync(join(dataDir, "videos.json"), JSON.stringify(videos, null, 2));
writeFileSync(join(dataDir, "pois.json"), JSON.stringify(poiData, null, 2));
writeFileSync(join(dataDir, "listings.json"), JSON.stringify(listingData, null, 2));

console.log(`Generated ${videos.length} videos, ${poiData.length} POIs, ${listingData.length} listings`);
