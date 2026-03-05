import Redis from "ioredis";
import { ComponentManager, EComName } from "../common/BaseComponent";

let redisClient: Redis | null = null;

function getRedis(): Redis {
  if (redisClient) {
    return redisClient;
  }

  const sysCfg = ComponentManager.instance.getComponent(
    EComName.SysCfgComponent,
  );
  const cfg = sysCfg.redis_global;
  if (!cfg) {
    throw new Error("redis_global config is missing");
  }

  redisClient = new Redis({
    host: cfg.host,
    port: cfg.port,
    db: cfg.db ?? 0,
    username: cfg.user,
    password: cfg.password,
  });

  return redisClient;
}

// 默认 token 过期时间：7 天（可后续从 server_auth_config 读取）
const DEFAULT_TOKEN_TTL_SEC = 7 * 24 * 60 * 60;

export async function saveTokenUserId(
  token: string,
  userId: string,
  ttlSec: number = DEFAULT_TOKEN_TTL_SEC,
): Promise<void> {
  const client = getRedis();
  const key = `auth:token:${token}`;
  await client.set(key, userId, "EX", ttlSec);
}

export async function loadUserIdByToken(
  token: string,
): Promise<string | null> {
  const client = getRedis();
  const key = `auth:token:${token}`;
  return client.get(key);
}

export async function revokeToken(token: string): Promise<void> {
  const client = getRedis();
  const key = `auth:token:${token}`;
  await client.del(key);
}

