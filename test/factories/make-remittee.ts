import { faker } from "@faker-js/faker";
import { UniqueEntityId } from "../../src/domain/core/entities/unique-entity-id";
import {
  RemitteProps,
  Remittee,
} from "../../src/domain/shipping/enterprise/entities/remittee";
import { prisma } from "../../src/infra/database/prisma/prisma";
import { PrismaRemitteeMapper } from "../../src/infra/database/prisma/mappers/prisma-remitte-mapper";

export function makeRemittee(
  overide: Partial<RemitteProps> = {},
  id?: UniqueEntityId
) {
  return Remittee.create(
    {
      cpf: faker.number.int({ min: 1000000000, max: 10000000000 }).toString(),
      name: faker.internet.userName(),
      ...overide,
    },
    id
  );
}

export async function makePrismaRemittee(
  overide: Partial<RemitteProps> = {},
  id?: UniqueEntityId
) {
  const remittee = makeRemittee(overide, id);
  const data = PrismaRemitteeMapper.toPrisma(remittee);
  await prisma.remittee.create({ data });
  return remittee;
}
