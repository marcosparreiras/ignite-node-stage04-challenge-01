import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

function generateUniqueDataBaseUrl(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error("Please provide a DATABASE_URL environment variable.");
  }
  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.set("schema", schemaId);
  return url.toString();
}

export const databaseSchemaId = randomUUID();
if (process.env.NODE_ENV === "test") {
  const databaseUrl = generateUniqueDataBaseUrl(databaseSchemaId);
  process.env.DATABASE_URL = databaseUrl;
}

export const prisma = new PrismaClient();
