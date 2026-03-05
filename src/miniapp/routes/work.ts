import { Router, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { sendSucc, sendErr } from "../middleware/response";
import type { MiniappRequest } from "../middleware/auth";
import { getWorkModel } from "../../dbservice/model/GlobalInfoDBModel";

const router = Router();

router.post("/publish", async (req: MiniappRequest, res: Response) => {
  const payload = (req.body?.data ?? req.body) as {
    desc?: string;
    tags?: string[];
    images?: { url: string; name: string; type: string }[];
    location?: string;
    status?: "draft" | "published";
  };

  const desc = payload?.desc?.trim() ?? "";
  const images = Array.isArray(payload?.images) ? payload.images : [];
  const tags = Array.isArray(payload?.tags) ? payload.tags : [];
  const status = payload?.status ?? "published";

  if (!desc && images.length === 0) {
    sendErr(res, "desc or images is required", 400);
    return;
  }

  if (status !== "draft" && status !== "published") {
    sendErr(res, "Invalid status", 400);
    return;
  }

  // 依赖上层 authMiddleware 已经校验并挂载 userId
  const authorId = req.userId;
  if (!authorId) {
    sendErr(res, "Unauthorized", 401);
    return;
  }

  try {
    const Work = getWorkModel();
    const workId = uuidv4();
    const doc = await Work.create({
      workId,
      authorId,
      desc,
      images,
      tags,
      location: payload.location,
      status,
    });

    sendSucc(res, { workId: doc.workId });
  } catch (err) {
    sendErr(res, "Publish work failed", 500);
  }
});

export default router;

