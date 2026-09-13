import pilotJs from "./assets/v9-pilot-js.jpg";
import pilotWz from "./assets/v9-pilot-wz.jpg";
import pilotThu from "./assets/v9-pilot-thu.jpg";
import posterHub from "./assets/p4.jpg";
import posterIsland from "./assets/p3.jpg";
import posterHill from "./assets/p2.jpg";
import craftBadge from "./assets/p1.jpg";
import craftBand from "./assets/p5.jpg";

// 数字与规则全部取自《行远步道执行工具包》V14：
// 管理者手册「项目一图览」（三校规划总长）、教师手册「路线规格，打卡点判定」（2 km、6 个打卡点、25 分钟）、
// 学生定线手册「用好护照和印章站」（S1 至 S3）、管理者手册第四章（行远者计划四机制）。
export const RULES = {
  maxKm: 2,
  points: 6,
  stamps: 3,
  activeMinutes: 25,
  adultRatio: 5,
  touristPassport: 18,
};

// 点位名称沿用 H5 原版示例路线，标记为示例；正式点位以学校女生管理小组定线为准。
export const SCHOOLS = [
  {
    id: "jishou",
    code: "01",
    terrain: "山地",
    name: "吉首民族中学",
    place: "湖南湘西",
    plannedKm: 3.2,
    photo: pilotJs,
    poster: posterHill,
    posterTitle: "出校门就是未被看见的步道",
    headline: "学校依山而建，把地形劣势变成运动资源",
    desc: "山区试点验证条件最紧的情况：没有女体育老师、体育时间被压缩。女生管理小组自己定线，用最轻的维护把校园后山变成体育场。",
    points: [
      { w: "W1", name: "操场起点", stamp: "S1", story: "从这里出发。先在护照封面写好名字和项目编号，起点印章站盖第一个章。" },
      { w: "W2", name: "废弃花坛", story: "校园里的闲置角落，女生把它设成第一个转弯点，路标立柱就装在花坛边。" },
      { w: "W3", name: "树下急救角", stamp: "S2", story: "中途印章站。这里放急救包和成人联络卡，也是应急演练的集合点。" },
      { w: "W4", name: "半山腰平台", story: "视线最开阔的一段，带队成人在这里能同时看见前后两组。" },
      { w: "W5", name: "民族文化展板", story: "苗绣纹样做进路线视觉，学生讲自己村子的故事。" },
      { w: "W6", name: "学校后门终点", stamp: "S3", story: "终点印章站。盖满 S1 至 S3 三个章，这一次路线才算完整。" },
    ],
  },
  {
    id: "weizhou",
    code: "02",
    terrain: "海岛",
    name: "涠洲岛中学",
    place: "广西北海",
    plannedKm: 5.8,
    photo: pilotWz,
    poster: posterIsland,
    posterTitle: "我们的步道也给游客讲故事",
    headline: "学生免费走校园线，游客护照反哺维护",
    desc: "海岛试点验证双轨：校园线服务女生体育课；校园线跑满一学期、保险覆盖校外路段、村委书面同意后，再开游客延伸线，游客版护照收入进维护基金。",
    points: [
      { w: "W1", name: "校门起点", stamp: "S1", story: "起点印章站。学生线和游客线都从这里出发，游客在接待点领护照。" },
      { w: "W2", name: "盛塘天主教堂", story: "海岛最有辨识度的地标，路标立柱装在通往教堂的岔路口。" },
      { w: "W3", name: "海风村道", story: "沿途鞋带标识每 30 至 50 米一条，站在一条能看见下一条。" },
      { w: "W4", name: "火山土农业点", stamp: "S2", story: "中途印章站。火山土、农作物和生态教育做成一段步道故事。" },
      { w: "W5", name: "火山地质点", story: "旧鞋材料与火山岩肌理结合，文创工坊的取材点。" },
      { w: "W6", name: "五彩滩终点", stamp: "S3", story: "终点印章站。游客线在这里回到接待点归还或带走护照。" },
    ],
  },
  {
    id: "tsinghua",
    code: "03",
    terrain: "校园",
    name: "清华大学",
    place: "北京",
    plannedKm: 2.1,
    photo: pilotThu,
    poster: posterHub,
    posterTitle: "一条步道如何被设计出来",
    headline: "先在校园里跑通全套工具，再向乡村学校辐射",
    desc: "校园示范线是工具包的验证场：八步法、护照、印章站、巡护表都先在这里走一遍，再打包送到山地和海岛两校。",
    points: [
      { w: "W1", name: "二校门起点", stamp: "S1", story: "起点印章站。从这里理解行远步道的路线、规则和盖章方式。" },
      { w: "W2", name: "大礼堂", story: "校园文化点位，女生讲述校园如何变成步道叙事节点。" },
      { w: "W3", name: "荷塘", story: "用校园景观训练故事采集和镜头表达。" },
      { w: "W4", name: "图书馆", stamp: "S2", story: "中途印章站。把校园经验沉淀成可复制的学校上手模板。" },
      { w: "W5", name: "近春园", story: "环线最安静的一段，适合练习分组轮走和清点。" },
      { w: "W6", name: "二校门终点", stamp: "S3", story: "终点印章站。环线回到起点，三个章盖满。" },
    ],
  },
];

export const VIDEO_TYPES = [
  { type: "步道诞生记", text: "一条路线怎么从十张照片变成六个打卡点", school: "tsinghua" },
  { type: "地方风物型", text: "女生带你看她们村子里的路标和故事", school: "weizhou" },
  { type: "人物故事型", text: "出校门就是步道：女生自己讲为什么要走出去", school: "jishou" },
];

export const CRAFTS = [
  { name: "旧鞋徽章", image: craftBadge, text: "鞋底和鞋面裁成部件，压上校徽或本地纹样。文创工坊第二次课制作。" },
  { name: "鞋带方向手环", image: craftBand, text: "回收鞋带编成手环，配一枚指向标。义卖收入进步道维护基金。" },
];

export const MECHANISMS = [
  { no: "1", name: "旧鞋文创二创", text: "两个活动时段：第一次 50 分钟导入和领料，第二次 80 至 110 分钟制作和整理。作品自留、展陈或义卖。" },
  { no: "2", name: "女生短视频栏目", text: "三类短片由女生自己讲述。拍摄前家长按三级用途签影像授权，不同意拍摄的不入镜。" },
  { no: "3", name: "公开征集", text: "面向乡镇及乡村学校征集下一条步道，每年最多 3 个村（计划值），项目方提供工具箱和培训。" },
  { no: "4", name: "H5 与二维码", text: "本页。每个打卡点的溯源牌下方放二维码，扫码只看内容；打卡走纸质护照盖章，不记名。" },
  { no: "5", name: "定线评测与公开赛", text: "专业跑者评测女生定的线，评测通过的线路向公众开放赛事。校园线对学生零收费；赛事与合作收入按协议回流步道维护与学校女孩体育发展。概念方案。" },
];

export const KIT_BOOKS = [
  { code: "01", name: "教师手册", who: "体育老师、协调员", color: "#FA5400", ink: "#F5F1EA" },
  { code: "02", name: "学生定线手册", who: "女生管理小组", color: "#6BA539", ink: "#F5F1EA" },
  { code: "03", name: "施工与维护手册", who: "志愿者、校工、师生", color: "#1A1A1A", ink: "#F5F1EA" },
  { code: "04", name: "管理者手册", who: "校长、教体局", color: "#FFFFFF", ink: "#111111" },
  { code: "05", name: "测量手册", who: "评估者、班主任", color: "#FFE0CC", ink: "#111111" },
];
