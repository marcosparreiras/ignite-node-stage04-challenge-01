import { makeNotification } from "../../../../../test/factories/make-notification";
import { InMemoryNotificationRepository } from "../../../../../test/repositories/in-memory-notification-repository";
import { NotAllowedError } from "../../../core/errors/not-allowed-error";
import { ResourceNotFoundError } from "../../../core/errors/resource-not-found-error";
import { ReadNotificationUseCase } from "./read-notification";

describe("ReadNotificationUseCase [Use-Case]", () => {
  let inMemoryNotificationRepository: InMemoryNotificationRepository;
  let sut: ReadNotificationUseCase;
  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationRepository();
    sut = new ReadNotificationUseCase(inMemoryNotificationRepository);
  });

  it("Should be able to read a notification", async () => {
    const notification = makeNotification();
    inMemoryNotificationRepository.items.push(notification);

    const response = await sut.execute({
      notificationId: notification.id.toString(),
      recipientId: notification.recipientId.toString(),
    });

    expect(response.notification.readAt).toBeTruthy();
    expect(notification.readAt).toBeTruthy();
  });

  it("Should not be able to read an unexistent notification", async () => {
    await expect(() =>
      sut.execute({
        notificationId: "",
        recipientId: "notification.recipientId.toString()",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("Should not be able to read a notification from another recipient", async () => {
    const notification = makeNotification();
    inMemoryNotificationRepository.items.push(notification);

    await expect(() =>
      sut.execute({
        notificationId: notification.id.toString(),
        recipientId: "some-id",
      })
    ).rejects.toBeInstanceOf(NotAllowedError);
  });
});
