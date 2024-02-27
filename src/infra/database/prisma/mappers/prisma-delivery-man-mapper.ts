import { DeliveryMan as PrismaDeliveryMan } from "@prisma/client";
import { DeliveryMan } from "../../../../domain/shipping/enterprise/entities/deliveryMan";
import { UniqueEntityId } from "../../../../domain/core/entities/unique-entity-id";

export class PrismaDeliveryManMapper {
  static toDomain(data: PrismaDeliveryMan): DeliveryMan {
    return DeliveryMan.create(
      {
        cpf: data.cpf,
        name: data.name,
        password: data.password,
        isAdmin: data.isAdmin,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      new UniqueEntityId(data.id)
    );
  }

  static toPrisma(data: DeliveryMan): PrismaDeliveryMan {
    return {
      id: data.id.toString(),
      cpf: data.cpf,
      name: data.name,
      password: data.password,
      isAdmin: data.isAdmin,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt ?? null,
    };
  }
}
