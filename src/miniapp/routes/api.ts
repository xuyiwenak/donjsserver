import { Router, Request, Response } from "express";
import { sendSucc, sendErr } from "../middleware/response";
import { authMiddleware, type MiniappRequest } from "../middleware/auth";

const router = Router();

const HISTORY_WORDS = ["AI绘画", "Stable Diffusion", "版权素材", "星空", "illustration", "原创"];
const POPULAR_WORDS = [
  "考研和靠边同时上岸应该怎么选？有哪些参考建议",
  "日常饮食中，如何选择优质蛋白",
  "你有没有网购维权成功的经历？求分享经验",
  "夏季带孩子旅游，你的必备物品有哪些",
  "在海外越卖越贵，中国汽车做对了什么",
  "当HR问你离职原因，怎么回答最能被接受",
];

const SERVICE_LIST = [
  { image: "/static/icon_wx.png", name: "微信", type: "weixin", url: "" },
  { image: "/static/icon_qq.png", name: "QQ", type: "QQ", url: "" },
  { image: "/static/icon_doc.png", name: "腾讯文档", type: "document", url: "" },
  { image: "/static/icon_map.png", name: "腾讯地图", type: "map", url: "" },
  { image: "/static/icon_td.png", name: "数据中心", type: "data", url: "/pages/dataCenter/index" },
  { image: "/static/icon_td.png", name: "数据中心", type: "data", url: "/pages/dataCenter/index" },
  { image: "/static/icon_td.png", name: "数据中心", type: "data", url: "/pages/dataCenter/index" },
  { image: "/static/icon_td.png", name: "数据中心", type: "data", url: "/pages/dataCenter/index" },
];

// 内存存储：userId -> 个人信息（可后续改为 Mongo）
const personalInfoStore = new Map<
  string,
  {
    image: string;
    name: string;
    star: string;
    gender: number;
    birth: string;
    address: string[];
    brief: string;
    photos: { url: string; name: string; type: string }[];
  }
>();

const DEFAULT_PERSONAL = {
  image: "/static/avatar1.png",
  name: "小小轩",
  star: "天枰座",
  gender: 0,
  birth: "1994-09-27",
  address: ["440000", "440300"],
  brief: "在你身边，为你设计",
  photos: [
    { url: "/static/img_td.png", name: "uploaded1.png", type: "image" },
    { url: "/static/img_td.png", name: "uploaded2.png", type: "image" },
  ],
};

router.get("/searchHistory", (_req: Request, res: Response) => {
  sendSucc(res, { historyWords: HISTORY_WORDS });
});

router.get("/searchPopular", (_req: Request, res: Response) => {
  sendSucc(res, { popularWords: POPULAR_WORDS });
});

router.get("/genPersonalInfo", authMiddleware, (req: MiniappRequest, res: Response) => {
  const userId = req.userId!;
  const info = personalInfoStore.get(userId) ?? { ...DEFAULT_PERSONAL };
  sendSucc(res, { data: info });
});

router.get("/getServiceList", (_req: Request, res: Response) => {
  sendSucc(res, { data: { service: SERVICE_LIST } });
});

router.post("/savePersonalInfo", authMiddleware, (req: MiniappRequest, res: Response) => {
  const userId = req.userId!;
  const body = req.body?.data ?? req.body;
  if (!body || typeof body !== "object") {
    sendErr(res, "Invalid body", 400);
    return;
  }
  const info = {
    image: body.image ?? DEFAULT_PERSONAL.image,
    name: body.name ?? DEFAULT_PERSONAL.name,
    star: body.star ?? DEFAULT_PERSONAL.star,
    gender: body.gender ?? DEFAULT_PERSONAL.gender,
    birth: body.birth ?? DEFAULT_PERSONAL.birth,
    address: Array.isArray(body.address) ? body.address : DEFAULT_PERSONAL.address,
    brief: body.brief ?? DEFAULT_PERSONAL.brief,
    photos: Array.isArray(body.photos) ? body.photos : DEFAULT_PERSONAL.photos,
  };
  personalInfoStore.set(userId, info);
  sendSucc(res, { data: info });
});

export default router;
