import { OnOrderStatusUpdatedSubscription } from "../../domain/notifications/application/subscribers/on-order-status-updated";
import { SendNotificationUseCase } from "../../domain/notifications/application/use-cases/send-notification";
import { PrismaNotificationRepository } from "../database/prisma/repositories/prisma-notification-repository";

const notificationRepository = new PrismaNotificationRepository();
const sendNotification = new SendNotificationUseCase(notificationRepository);
new OnOrderStatusUpdatedSubscription(sendNotification);
