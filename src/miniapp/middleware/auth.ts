import type { Request, Response, NextFunction } from "express";
import { sendErr } from "./response";

export type MiniappRequest = Request & { userId?: string };

const tokenToUserId = new Map<string, string>();

export function setTokenUserId(token: string, userId: string): void {
  tokenToUserId.set(token, userId);
}

export function getUserIdByToken(token: string): string | undefined {
  return tokenToUserId.get(token);
}

export function authMiddleware(
  req: MiniappRequest,
  res: Response,
  next: NextFunction
): void {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    sendErr(res, "Unauthorized", 401);
    return;
  }
  const token = auth.slice(7).trim();
  const userId = getUserIdByToken(token);
  if (!userId) {
    sendErr(res, "Invalid or expired token", 401);
    return;
  }
  req.userId = userId;
  next();
}
