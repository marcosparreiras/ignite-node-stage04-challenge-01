import { UniqueEntityId } from "../../../src/domain/core/entities/unique-entity-id";
import { RemitteProps } from "../../../src/domain/shipping/enterprise/entities/remittee";
import { PrismaRemitteeMapper } from "../../../src/infra/database/prisma/mappers/prisma-remitte-mapper";
import { prisma } from "../../../src/infra/database/prisma/prisma";
import { makeRemittee } from "../make-remittee";

export async function makePrismaRemittee(
  overide: Partial<RemitteProps> = {},
  id?: UniqueEntityId
) {
  const remittee = makeRemittee(overide, id);
  const data = PrismaRemitteeMapper.toPrisma(remittee);
  await prisma.remittee.create({ data });
  return remittee;
}
