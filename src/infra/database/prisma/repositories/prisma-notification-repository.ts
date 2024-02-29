import { NotificationRepository } from "../../../../domain/notifications/application/repositories/notification-repository";
import { Notification } from "../../../../domain/notifications/enterprise/entities/notification";
import { PrismaNotificationMapper } from "../mappers/prisma-notification-mapper";
import { prisma } from "../prisma";

export class PrismaNotificationRepository implements NotificationRepository {
  async create(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toPrisma(notification);
    await prisma.notification.create({ data });
  }
  async save(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toPrisma(notification);
    await prisma.notification.update({ where: { id: data.id }, data });
  }
  async findById(id: string): Promise<Notification | null> {
    const data = await prisma.notification.findUnique({ where: { id } });
    if (!data) {
      return null;
    }
    return PrismaNotificationMapper.toDomain(data);
  }
}
