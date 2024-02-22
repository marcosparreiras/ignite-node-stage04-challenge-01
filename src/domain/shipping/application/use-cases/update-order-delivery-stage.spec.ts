import { makeDeliveryMan } from "../../../../../test/factories/make-delivery-man";
import { makeOrder } from "../../../../../test/factories/make-order";
import { InMemoryDeliveryManRepository } from "../../../../../test/repositories/in-memory-delivery-man-repository";
import { InMemoryOrderRepository } from "../../../../../test/repositories/in-memory-order-repository";
import { InvalidDeliveryStageError } from "../errors/invalid-delivery-stage-error";
import { MissingDeliveryPhotoUrlError } from "../errors/missing-delivery-photo-error";
import { NotAllowedError } from "../errors/not-allowed-error";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { UpdateOrderDeliveryStageUseCase } from "./update-order-delivery-stage";

describe("UpdateOrderDeliveryStageUseCase [Use-Case]", () => {
  let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository;
  let inMemoryOrderRepository: InMemoryOrderRepository;
  let sut: UpdateOrderDeliveryStageUseCase;

  beforeEach(() => {
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository();
    inMemoryOrderRepository = new InMemoryOrderRepository();
    sut = new UpdateOrderDeliveryStageUseCase(
      inMemoryDeliveryManRepository,
      inMemoryOrderRepository
    );
  });

  it("Should be able to update order delivery stage", async () => {
    const deliveryMan = makeDeliveryMan();
    const order = makeOrder({ deliveryManId: deliveryMan.id });

    inMemoryDeliveryManRepository.items.push(deliveryMan);
    inMemoryOrderRepository.items.push(order);

    const result = await sut.execute({
      deliveryManId: deliveryMan.id.toString(),
      orderId: order.id.toString(),
      deliveryStage: "AVAILABE_TO_DELIVERY",
    });

    expect(result.order.deliveryStage.stage).toEqual("AVAILABE_TO_DELIVERY");
  });

  it("Should be able to update any order delivery stage with admin", async () => {
    const admin = makeDeliveryMan({ isAdmin: true });
    const deliveryMan = makeDeliveryMan();
    const order = makeOrder({ deliveryManId: deliveryMan.id });

    inMemoryDeliveryManRepository.items.push(admin, deliveryMan);
    inMemoryOrderRepository.items.push(order);

    const result = await sut.execute({
      deliveryManId: admin.id.toString(),
      orderId: order.id.toString(),
      deliveryStage: "AVAILABE_TO_DELIVERY",
    });

    expect(result.order.deliveryStage.stage).toEqual("AVAILABE_TO_DELIVERY");
  });

  it("Should not be able to update other delivery-man order delivery stage", async () => {
    const deliveryMan = makeDeliveryMan();
    const otherDeliveryMan = makeDeliveryMan();
    const order = makeOrder({ deliveryManId: otherDeliveryMan.id });

    inMemoryDeliveryManRepository.items.push(deliveryMan, otherDeliveryMan);
    inMemoryOrderRepository.items.push(order);

    await expect(() =>
      sut.execute({
        deliveryManId: deliveryMan.id.toString(),
        orderId: order.id.toString(),
        deliveryStage: "AVAILABE_TO_DELIVERY",
      })
    ).rejects.toBeInstanceOf(NotAllowedError);
  });

  it("Should not be able to update order delivery stage to an invalid value", async () => {
    const deliveryMan = makeDeliveryMan();
    const order = makeOrder({ deliveryManId: deliveryMan.id });

    inMemoryDeliveryManRepository.items.push(deliveryMan);
    inMemoryOrderRepository.items.push(order);

    await expect(() =>
      sut.execute({
        deliveryManId: deliveryMan.id.toString(),
        orderId: order.id.toString(),
        deliveryStage: "SOME_INVALID_DELIVERY_SATGE",
      })
    ).rejects.toBeInstanceOf(InvalidDeliveryStageError);
  });

  it("Should not be able to update order delivery stage to DELIVERED without confirmation photo", async () => {
    const deliveryMan = makeDeliveryMan();
    const order = makeOrder({ deliveryManId: deliveryMan.id });

    inMemoryDeliveryManRepository.items.push(deliveryMan);
    inMemoryOrderRepository.items.push(order);

    await expect(() =>
      sut.execute({
        deliveryManId: deliveryMan.id.toString(),
        orderId: order.id.toString(),
        deliveryStage: "DELIVERED",
      })
    ).rejects.toBeInstanceOf(MissingDeliveryPhotoUrlError);
  });

  it("Should be able to update order delivery stage to DELIVERED with confirmation photo", async () => {
    const deliveryMan = makeDeliveryMan();
    const order = makeOrder({
      deliveryManId: deliveryMan.id,
      deliveryConfirmationPhotoUrl: "delivery-confirmation-url",
    });

    inMemoryDeliveryManRepository.items.push(deliveryMan);
    inMemoryOrderRepository.items.push(order);

    const result = await sut.execute({
      deliveryManId: deliveryMan.id.toString(),
      orderId: order.id.toString(),
      deliveryStage: "DELIVERED",
    });

    expect(result.order.deliveryStage.stage).toEqual("DELIVERED");
  });

  it("Should not be able to update delivery stage of an unexistent order", async () => {
    const deliveryMan = makeDeliveryMan();

    inMemoryDeliveryManRepository.items.push(deliveryMan);

    await expect(() =>
      sut.execute({
        deliveryManId: deliveryMan.id.toString(),
        orderId: "",
        deliveryStage: "AVAILABE_TO_DELIVERY",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
