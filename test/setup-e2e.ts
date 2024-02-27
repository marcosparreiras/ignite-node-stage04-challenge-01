import "dotenv/config";
import { randomUUID } from "node:crypto";
import { execSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import { DomainEvents } from "../src/domain/core/events/domain-events";
import { envSchema } from "../src/infra/env";

const env = envSchema.parse(process.env);

const prisma = new PrismaClient();

function generateUniqueDataBaseUrl(schemaId: string) {
  if (!env.DATABASE_URL) {
    throw new Error("Please provide a DATABASE_URL environment variable.");
  }
  const url = new URL(env.DATABASE_URL);
  url.searchParams.set("schema", schemaId);
  return url.toString();
}

const schemaId = randomUUID();
beforeAll(async () => {
  const databaseUrl = generateUniqueDataBaseUrl(schemaId);
  process.env.DATABASE_URL = databaseUrl;
  DomainEvents.shouldRun = false;
  execSync("npx prisma migrate deploy");
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await prisma.$disconnect();
});
