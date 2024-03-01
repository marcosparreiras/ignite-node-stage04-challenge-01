import "dotenv/config";
import { z } from "zod";

export const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string().url(),
  JWT_TOKEN: z.string(),
  NODE_ENV: z.string().default("development"),
  AWS_BUCKET_NAME: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_KEY_ID: z.string(),
  REDIS_PORT: z.coerce.number(),
  REDIS_HOST: z.string(),
  REDIS_DB: z.coerce.number(),
});

export const env = envSchema.parse(process.env);
