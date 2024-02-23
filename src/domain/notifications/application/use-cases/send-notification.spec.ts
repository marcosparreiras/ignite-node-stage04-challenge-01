import { InMemoryNotificationRepository } from "../../../../../test/repositories/in-memory-notification-repository";
import { UniqueEntityId } from "../../../core/entities/unique-entity-id";
import { SendNotificationUseCase } from "./send-notification";

describe("SendNotificationUseCase [Use-Case]", () => {
  let inMemoryNotificationRepository: InMemoryNotificationRepository;
  let sut: SendNotificationUseCase;

  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationRepository();
    sut = new SendNotificationUseCase(inMemoryNotificationRepository);
  });

  it("Should be able to send a notification", async () => {
    const response = await sut.execute({
      recipientId: "some-fake-id",
      title: "some-fake-title",
      content: "some-fake-content",
    });

    expect(response.notification).toEqual(
      expect.objectContaining({
        recipientId: new UniqueEntityId("some-fake-id"),
        title: "some-fake-title",
        content: "some-fake-content",
      })
    );
    expect(inMemoryNotificationRepository.items).toHaveLength(1);
  });
});
