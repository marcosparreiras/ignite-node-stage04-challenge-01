import { SendNotificationUseCase } from "../../domain/notifications/application/use-cases/send-notification";
import { PrismaNotificationRepository } from "../database/prisma/repositories/prisma-notification-repository";

export function makeSendNotificationUseCase() {
  const notificationRepository = new PrismaNotificationRepository();
  const useCase = new SendNotificationUseCase(notificationRepository);
  return useCase;
}
