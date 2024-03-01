import { UniqueEntityId } from "../../../src/domain/core/entities/unique-entity-id";
import { OrderProps } from "../../../src/domain/shipping/enterprise/entities/order";
import { PrismaOrderMapper } from "../../../src/infra/database/prisma/mappers/prisma-order-mapper";
import { prisma } from "../../../src/infra/database/prisma/prisma";
import { makeOrder } from "../make-order";

export async function makePrismaOrder(
  overide: Partial<OrderProps> = {},
  id?: UniqueEntityId
) {
  const order = makeOrder(overide, id);
  const data = PrismaOrderMapper.toPrisma(order);
  await prisma.order.create({ data });
  return order;
}
