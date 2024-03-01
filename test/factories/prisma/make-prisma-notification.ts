import { UniqueEntityId } from "../../../src/domain/core/entities/unique-entity-id";
import { NotificationProps } from "../../../src/domain/notifications/enterprise/entities/notification";
import { PrismaNotificationMapper } from "../../../src/infra/database/prisma/mappers/prisma-notification-mapper";
import { prisma } from "../../../src/infra/database/prisma/prisma";
import { makeNotification } from "../make-notification";

export async function makePrismaNotification(
  overide: Partial<NotificationProps> = {},
  id?: UniqueEntityId
) {
  const notification = makeNotification(overide, id);
  const data = PrismaNotificationMapper.toPrisma(notification);
  await prisma.notification.create({ data });
  return notification;
}
