import { UniqueEntityId } from "../../src/domain/core/entities/unique-entity-id";
import {
  Order,
  OrderProps,
} from "../../src/domain/shipping/enterprise/entities/order";
import { Location } from "../../src/domain/shipping/enterprise/object-values/location";

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
