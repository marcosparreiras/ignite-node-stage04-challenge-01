import { UniqueEntityId } from "../../src/domain/core/entities/unique-entity-id";
import {
  DeliveryMan,
  DeliveryManProps,
} from "../../src/domain/shipping/enterprise/entities/deliveryMan";
import { faker } from "@faker-js/faker";

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
