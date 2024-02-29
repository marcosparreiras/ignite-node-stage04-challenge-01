import { UniqueEntityId } from "../../src/domain/core/entities/unique-entity-id";
import {
  Order,
  OrderProps,
} from "../../src/domain/shipping/enterprise/entities/order";
import { Location } from "../../src/domain/shipping/enterprise/object-values/location";
import { PrismaOrderMapper } from "../../src/infra/database/prisma/mappers/prisma-order-mapper";
import { prisma } from "../../src/infra/database/prisma/prisma";

export function makeOrder(
  overide: Partial<OrderProps> = {},
  id?: UniqueEntityId
) {
  return Order.create(
    {
      deliveryManId: new UniqueEntityId("fake-delivery-man-id"),
      remitteeId: new UniqueEntityId("fake-remittee-id"),
      deliveryLocation: new Location(Math.random() * 90, Math.random() * 180),
      ...overide,
    },
    id
  );
}

export async function makePrismaOrder(
  overide: Partial<OrderProps> = {},
  id?: UniqueEntityId
) {
  const order = makeOrder(overide, id);
  const data = PrismaOrderMapper.toPrisma(order);
  await prisma.order.create({ data });
  return order;
}
