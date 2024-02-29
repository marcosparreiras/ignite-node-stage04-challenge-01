import { ReadNotificationUseCase } from "../../domain/notifications/application/use-cases/read-notification";
import { PrismaNotificationRepository } from "../database/prisma/repositories/prisma-notification-repository";

export function makeReadNotificationUseCase() {
  const notificationRepository = new PrismaNotificationRepository();
  const useCase = new ReadNotificationUseCase(notificationRepository);
  return useCase;
}
