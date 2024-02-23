import { NotificationRepository } from "../../src/domain/notifications/application/repositories/notification-repository";
import { Notification } from "../../src/domain/notifications/enterprise/notification";

export class InMemoryNotificationRepository implements NotificationRepository {
  public items: Notification[] = [];

  async create(notification: Notification): Promise<void> {
    this.items.push(notification);
  }

  async save(notification: Notification): Promise<void> {
    const index = this.items.findIndex((item) =>
      item.id.equals(notification.id)
    );
    this.items[index] = notification;
  }

  async findById(id: string): Promise<Notification | null> {
    const notification = this.items.find((item) => item.id.toString() === id);
    return notification ?? null;
  }
}
