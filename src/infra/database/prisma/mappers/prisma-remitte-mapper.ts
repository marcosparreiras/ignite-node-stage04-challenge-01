import { Remittee as PrismaRemittee } from "@prisma/client";
import { Remittee } from "../../../../domain/shipping/enterprise/entities/remittee";
import { UniqueEntityId } from "../../../../domain/core/entities/unique-entity-id";

export class PrismaRemitteeMapper {
  static toDomain(data: PrismaRemittee): Remittee {
    return Remittee.create(
      {
        cpf: data.cpf,
        name: data.name,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      new UniqueEntityId(data.id)
    );
  }

  static toPrisma(data: Remittee): PrismaRemittee {
    return {
      id: data.id.toString(),
      cpf: data.cpf,
      name: data.name,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt ?? null,
    };
  }
}
