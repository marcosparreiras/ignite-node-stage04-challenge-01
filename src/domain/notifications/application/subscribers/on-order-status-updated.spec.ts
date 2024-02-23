import { makeOrder } from "../../../../../test/factories/make-order";
import { makeRemittee } from "../../../../../test/factories/make-remittee";
import { InMemoryNotificationRepository } from "../../../../../test/repositories/in-memory-notification-repository";
import { InMemoryOrderRepository } from "../../../../../test/repositories/in-memory-order-repository";
import { InMemoryRemitteeRepository } from "../../../../../test/repositories/in-memory-remittee-repository";
import { waitFor } from "../../../../../test/utils/wait-for";
import { SendNotificationUseCase } from "../use-cases/send-notification";
import { OnOrderStatusUpdatedSubscription } from "./on-order-status-updated";

describe("OnOrderStatusUpdatedSubscription [Subscription]", () => {
  let inMemoryOrderRepository: InMemoryOrderRepository;
  let inMemoryRemitteeRepository: InMemoryRemitteeRepository;
  let inMemoryNotificationRepository: InMemoryNotificationRepository;
  let sendNotificationUseCase: SendNotificationUseCase;

  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository();
    inMemoryRemitteeRepository = new InMemoryRemitteeRepository();
    inMemoryNotificationRepository = new InMemoryNotificationRepository();
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationRepository
    );
    new OnOrderStatusUpdatedSubscription(sendNotificationUseCase);
  });

  it("Should send a notification on order status update", async () => {
    const remitte = makeRemittee();
    inMemoryRemitteeRepository.items.push(remitte);

    const order = makeOrder({ remitteeId: remitte.id });
    inMemoryOrderRepository.items.push(order);

    order.deliveryStage = order.deliveryStage.nextStage();
    await inMemoryOrderRepository.save(order);

    await waitFor(() => {
      expect(inMemoryNotificationRepository.items[0].recipientId).toEqual(
        remitte.id
      );
    });
  });
});
