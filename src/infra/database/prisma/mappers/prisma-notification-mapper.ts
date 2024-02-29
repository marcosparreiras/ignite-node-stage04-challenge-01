import { Notification as PrismaNotification } from "@prisma/client";
import { Notification } from "../../../../domain/notifications/enterprise/entities/notification";
import { UniqueEntityId } from "../../../../domain/core/entities/unique-entity-id";

export class PrismaNotificationMapper {
  static toDomain(data: PrismaNotification): Notification {
    return Notification.create(
      {
        content: data.content,
        recipientId: new UniqueEntityId(data.recipientId),
        title: data.title,
        createdAt: data.createdAt,
        readAt: data.readAt,
      },
      new UniqueEntityId(data.id)
    );
  }

  static toPrisma(data: Notification): PrismaNotification {
    return {
      id: data.id.toString(),
      recipientId: data.recipientId.toString(),
      title: data.title,
      content: data.content,
      createdAt: data.createdAt,
      readAt: data.readAt ?? null,
    };
  }
}
