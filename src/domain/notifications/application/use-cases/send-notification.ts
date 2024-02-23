import { UniqueEntityId } from "../../../core/entities/unique-entity-id";
import { Notification } from "../../enterprise/notification";
import { NotificationRepository } from "../repositories/notification-repository";

interface SendNotificationUseCaseRequest {
  recipientId: string;
  title: string;
  content: string;
}

interface SendNotificationUseCaseResponse {
  notification: Notification;
}

export class SendNotificationUseCase {
  constructor(private notificationRepository: NotificationRepository) {}

  async execute({
    recipientId,
    title,
    content,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      recipientId: new UniqueEntityId(recipientId),
      title,
      content,
    });
    await this.notificationRepository.create(notification);
    return { notification };
  }
}
