import { Prisma, Order as PrismaOrder } from "@prisma/client";
import { Order } from "../../../../domain/shipping/enterprise/entities/order";
import { UniqueEntityId } from "../../../../domain/core/entities/unique-entity-id";
import { Location } from "../../../../domain/shipping/enterprise/object-values/location";
import {
  DeliveryStage,
  DeliveryStageEnum,
} from "../../../../domain/shipping/enterprise/object-values/delivery-stage";

export class PrismaOrderMapper {
  static toDomain(data: PrismaOrder): Order {
    if (!Object.keys(DeliveryStageEnum).includes(data.stage)) {
      throw new Error(`${data.stage} is not of type DeliveryStageEnum`);
    }
    return Order.create(
      {
        remitteeId: new UniqueEntityId(data.remitteeId),
        deliveryManId: new UniqueEntityId(data.deliveryManId),
        deliveryLocation: new Location(
          data.longitude.toNumber(),
          data.longitude.toNumber()
        ),
        deliveryConfirmationPhotoUrl: data.deliveryConfirmationPhotoUrl,
        deliveryStage: new DeliveryStage(DeliveryStageEnum[data.stage]),
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      new UniqueEntityId(data.id)
    );
  }

  static toPrisma(data: Order): PrismaOrder {
    return {
      id: data.id.toString(),
      remitteeId: data.remitteId.toString(),
      deliveryManId: data.deliveryManId.toString(),
      stage: data.deliveryStage.stage,
      isReturned: data.deliveryStage.isReturned,
      latitude: new Prisma.Decimal(data.deliveryLocation.latitude),
      longitude: new Prisma.Decimal(data.deliveryLocation.longitude),
      deliveryConfirmationPhotoUrl: data.deliveryConfirmationPhotoUrl ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt ?? null,
    };
  }
}
