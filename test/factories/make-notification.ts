import { faker } from "@faker-js/faker";
import { UniqueEntityId } from "../../src/domain/core/entities/unique-entity-id";
import {
  Notification,
  NotificationProps,
} from "../../src/domain/notifications/enterprise/entities/notification";
import { PrismaNotificationMapper } from "../../src/infra/database/prisma/mappers/prisma-notification-mapper";
import { prisma } from "../../src/infra/database/prisma/prisma";

export function makeNotification(
  overide: Partial<NotificationProps> = {},
  id?: UniqueEntityId
) {
  return Notification.create(
    {
      recipientId: new UniqueEntityId(),
      title: faker.lorem.sentence(5),
      content: faker.lorem.paragraph(),
      ...overide,
    },
    id
  );
}

export async function makePrismaNotification(
  overide: Partial<NotificationProps> = {},
  id?: UniqueEntityId
) {
  const notification = makeNotification(overide, id);
  const data = PrismaNotificationMapper.toPrisma(notification);
  await prisma.notification.create({ data });
  return notification;
}
