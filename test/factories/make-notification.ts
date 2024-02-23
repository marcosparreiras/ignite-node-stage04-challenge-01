import { faker } from "@faker-js/faker";
import { UniqueEntityId } from "../../src/domain/core/entities/unique-entity-id";
import {
  Notification,
  NotificationProps,
} from "../../src/domain/notifications/enterprise/entities/notification";

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
