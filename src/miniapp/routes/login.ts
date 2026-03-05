import { Router, Request, Response } from "express";
import { ComponentManager } from "../../common/BaseComponent";
import type { PlayerComponent } from "../../component/PlayerComponent";
import { sendSucc, sendErr } from "../middleware/response";
import { issueToken } from "../tokenStore";

const router = Router();

router.post("/postPasswordLogin", async (req: Request, res: Response) => {
  const payload = req.body?.data ?? req.body;
  const account = payload?.account;
  const password = payload?.password;
  if (!account || !password) {
    sendErr(res, "Missing account or password", 400);
    return;
  }

  const playerComp =
    ComponentManager.instance.getComponentByKey<PlayerComponent>("PlayerComponent");
  if (!playerComp) {
    sendErr(res, "Server not ready", 503);
    return;
  }

  const ret = await playerComp.login(account, password);
  if (!ret.ok) {
    sendErr(res, ret.error, 401);
    return;
  }

  const token = issueToken(ret.data.userId);
  sendSucc(res, { token });
});

router.get("/getSendMessage", (_req: Request, res: Response) => {
  // 前端未传手机号，按会话发码可后续扩展；当前直接返回成功，前端跳验证码页
  sendSucc(res, { success: true });
});

// 验证码校验：简单实现为任意 6 位数字即通过（与发码逻辑对应，可后续接真实短信）
const CODE_VERIFY_ACCEPT = "123456";

router.get("/postCodeVerify", (req: Request, res: Response) => {
  const code = (req.query?.code as string) ?? (req.body?.code as string) ?? "";
  if (!code) {
    sendErr(res, "Missing code", 400);
    return;
  }
  // 演示：接受固定码或任意 6 位；生产应校验与 getSendMessage 发出的码一致
  if (code !== CODE_VERIFY_ACCEPT && !/^\d{6}$/.test(code)) {
    sendErr(res, "Invalid code", 401);
    return;
  }
  // 验证码登录时无 userId，生成匿名 token；若发码时绑定了手机号可这里查用户再 issue
  const anonymousId = `phone_${code}_${Date.now()}`;
  const token = issueToken(anonymousId);
  sendSucc(res, { token });
});

export default router;
