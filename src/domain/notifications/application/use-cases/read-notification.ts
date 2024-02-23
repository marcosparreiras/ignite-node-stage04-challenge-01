import { NotAllowedError } from "../../../core/errors/not-allowed-error";
import { ResourceNotFoundError } from "../../../core/errors/resource-not-found-error";
import { Notification } from "../../enterprise/entities/notification";
import { NotificationRepository } from "../repositories/notification-repository";

interface ReadNotificationUseCaseRequest {
  notificationId: string;
  recipientId: string;
}

interface ReadNotificationUseCaseResponse {
  notification: Notification;
}

export class ReadNotificationUseCase {
  constructor(private notificationRepository: NotificationRepository) {}

  async execute({
    notificationId,
    recipientId,
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const notification = await this.notificationRepository.findById(
      notificationId
    );
    if (!notification) {
      throw new ResourceNotFoundError();
    }
    if (!(notification.recipientId.toString() === recipientId)) {
      throw new NotAllowedError();
    }
    notification.readAt = new Date();

    await this.notificationRepository.save(notification);
    return { notification };
  }
}
