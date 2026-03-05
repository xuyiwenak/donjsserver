import type { Request, Response, NextFunction } from "express";
import { sendErr } from "./response";
import { loadUserIdByToken } from "../../auth/RedisTokenStore";

export type MiniappRequest = Request & { userId?: string };

export async function authMiddleware(
  req: MiniappRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    sendErr(res, "Unauthorized", 401);
    return;
  }
  const token = auth.slice(7).trim();
  const userId = await loadUserIdByToken(token);
  if (!userId) {
    sendErr(res, "Invalid or expired token", 401);
    return;
  }
  req.userId = userId;
  next();
}
