import { z } from "zod";

export const schema = z.object({
  db_global: z.object({ host: z.string(), port: z.number(), db: z.string() }),
  db_server: z.object({
    front_1: z.object({ host: z.string(), port: z.number(), db: z.string() }),
    front_2: z.object({ host: z.string(), port: z.number(), db: z.string() }),
  }),
  db_zones: z.object({
    zone1: z.object({ host: z.string(), port: z.number(), db: z.string() }),
    zone2: z.object({ host: z.string(), port: z.number(), db: z.string() }),
  }),
  redis_global: z.object({
    host: z.string(),
    port: z.number(),
    db: z.number(),
  }),
});
