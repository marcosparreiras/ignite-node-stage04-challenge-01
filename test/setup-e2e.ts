import { execSync } from "node:child_process";
import { DomainEvents } from "../src/domain/core/events/domain-events";
import { databaseSchemaId, prisma } from "../src/infra/database/prisma/prisma";

beforeAll(async () => {
  DomainEvents.shouldRun = false;
  execSync("npx prisma migrate deploy");
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(
    `DROP SCHEMA IF EXISTS "${databaseSchemaId}" CASCADE`
  );
  await prisma.$disconnect();
});
