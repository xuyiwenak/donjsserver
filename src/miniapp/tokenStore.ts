import { randomBytes } from "crypto";
import { setTokenUserId } from "./middleware/auth";

export function createToken(): string {
  return randomBytes(24).toString("hex");
}

export function issueToken(userId: string): string {
  const token = createToken();
  setTokenUserId(token, userId);
  return token;
}
