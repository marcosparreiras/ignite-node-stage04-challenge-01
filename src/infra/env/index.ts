import "dotenv/config";
import { z } from "zod";

export const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string().url(),
  JWT_TOKEN: z.string(),
  NODE_ENV: z.string().default("development"),
});

export const env = envSchema.parse(process.env);
