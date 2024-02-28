import { UniqueEntityId } from "../../src/domain/core/entities/unique-entity-id";
import {
  DeliveryMan,
  DeliveryManProps,
} from "../../src/domain/shipping/enterprise/entities/deliveryMan";
import { faker } from "@faker-js/faker";
import { prisma } from "../../src/infra/database/prisma/prisma";
import { PrismaDeliveryManMapper } from "../../src/infra/database/prisma/mappers/prisma-delivery-man-mapper";

export function makeDeliveryMan(
  overide: Partial<DeliveryManProps> = {},
  id?: UniqueEntityId
) {
  return DeliveryMan.create(
    {
      cpf: faker.number.int({ min: 1000000000, max: 10000000000 }).toString(),
      name: faker.internet.userName(),
      password: faker.internet.password(),
      ...overide,
    },
    id
  );
}

export async function makePrismaDeliveryMan(
  overide: Partial<DeliveryManProps> = {},
  id?: UniqueEntityId
) {
  const deliveryMan = makeDeliveryMan(overide, id);
  const data = PrismaDeliveryManMapper.toPrisma(deliveryMan);
  await prisma.deliveryMan.create({ data });
  return deliveryMan;
}
