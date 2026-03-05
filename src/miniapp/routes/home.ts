import { Router, Request, Response } from "express";
import { sendSucc } from "../middleware/response";

const router = Router();

const CARDS = [
  { url: "/static/home/card0.png", desc: "少年,星空与梦想", tags: [{ text: "AI绘画", theme: "primary" }, { text: "版权素材", theme: "success" }] },
  { url: "/static/home/card1.png", desc: "仰望星空的少女", tags: [{ text: "AI绘画", theme: "primary" }, { text: "版权素材", theme: "success" }] },
  { url: "/static/home/card3.png", desc: "仰望星空的少年", tags: [{ text: "AI绘画", theme: "primary" }, { text: "版权素材", theme: "success" }] },
  { url: "/static/home/card2.png", desc: "少年,星空与梦想", tags: [{ text: "AI绘画", theme: "primary" }, { text: "版权素材", theme: "success" }] },
  { url: "/static/home/card4.png", desc: "多彩的天空", tags: [{ text: "AI绘画", theme: "primary" }, { text: "版权素材", theme: "success" }] },
];

const SWIPERS = new Array(6).fill("/static/home/swiper0.png");

router.get("/cards", (_req: Request, res: Response) => {
  sendSucc(res, CARDS);
});

router.get("/swipers", (_req: Request, res: Response) => {
  sendSucc(res, SWIPERS);
});

export default router;
