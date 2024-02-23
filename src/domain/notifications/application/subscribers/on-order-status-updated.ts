import { DomainEvents } from "../../../core/events/domain-events";
import { EventHandler } from "../../../core/events/event-handler";
import { OrderStatusUpdatedEvent } from "../../../shipping/enterprise/events/order-status-updated";
import { SendNotificationUseCase } from "../use-cases/send-notification";

export class OnOrderStatusUpdatedSubscription implements EventHandler {
  constructor(private sendNotification: SendNotificationUseCase) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendOrderStatusNotification.bind(this),
      OrderStatusUpdatedEvent.name
    );
  }

  async sendOrderStatusNotification({ order }: OrderStatusUpdatedEvent) {
    const content = order.deliveryStage.isReturned
      ? `Your order "${order.id.toString()}" is returned`
      : `Your order "${order.id.toString()}" has a new status: ${
          order.deliveryStage.stage
        }.`;

    await this.sendNotification.execute({
      recipientId: order.remitteId.toString(),
      title: `Order "${order.id.toString()}" was updeted`,
      content,
    });
  }
}
