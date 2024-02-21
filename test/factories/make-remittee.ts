import { faker } from "@faker-js/faker";
import { UniqueEntityId } from "../../src/domain/core/entities/unique-entity-id";
import {
  RemitteProps,
  Remittee,
} from "../../src/domain/shipping/enterprise/entities/remittee";

export function MakeRemittee(
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
