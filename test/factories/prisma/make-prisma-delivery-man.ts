import { UniqueEntityId } from "../../../src/domain/core/entities/unique-entity-id";
import { DeliveryManProps } from "../../../src/domain/shipping/enterprise/entities/deliveryMan";
import { PrismaDeliveryManMapper } from "../../../src/infra/database/prisma/mappers/prisma-delivery-man-mapper";
import { prisma } from "../../../src/infra/database/prisma/prisma";
import { makeDeliveryMan } from "../make-delivery-man";

export async function makePrismaDeliveryMan(
  overide: Partial<DeliveryManProps> = {},
  id?: UniqueEntityId
) {
  const deliveryMan = makeDeliveryMan(overide, id);
  const data = PrismaDeliveryManMapper.toPrisma(deliveryMan);
  await prisma.deliveryMan.create({ data });
  return deliveryMan;
}
