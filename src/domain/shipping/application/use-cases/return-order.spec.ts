import { makeDeliveryMan } from "../../../../../test/factories/make-delivery-man";
import { makeOrder } from "../../../../../test/factories/make-order";
import { InMemoryDeliveryManRepository } from "../../../../../test/repositories/in-memory-delivery-man-repository";
import { InMemoryOrderRepository } from "../../../../../test/repositories/in-memory-order-repository";
import { NotAllowedError } from "../../../core/errors/not-allowed-error";
import { ResourceNotFoundError } from "../../../core/errors/resource-not-found-error";
import { ReturnOrderUseCase } from "./return-order";

describe("ReturnOrderUseCase [Use-Case]", () => {
  let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository;
  let inMemoryOrderRepository: InMemoryOrderRepository;
  let sut: ReturnOrderUseCase;

  beforeEach(() => {
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository();
    inMemoryOrderRepository = new InMemoryOrderRepository();
    sut = new ReturnOrderUseCase(
      inMemoryDeliveryManRepository,
      inMemoryOrderRepository
    );
  });

  it("Should be able to return an order", async () => {
    const deliveryMan = makeDeliveryMan();
    const order = makeOrder({ deliveryManId: deliveryMan.id });

    inMemoryDeliveryManRepository.items.push(deliveryMan);
    inMemoryOrderRepository.items.push(order);

    const result = await sut.execute({
      deliveryManId: deliveryMan.id.toString(),
      orderId: order.id.toString(),
    });

    expect(result.order.deliveryStage.isReturned).toEqual(true);
  });

  it("Should be able to return any order with admin", async () => {
    const admin = makeDeliveryMan({ isAdmin: true });
    const deliveryMan = makeDeliveryMan();
    const order = makeOrder({ deliveryManId: deliveryMan.id });

    inMemoryDeliveryManRepository.items.push(admin, deliveryMan);
    inMemoryOrderRepository.items.push(order);

    const result = await sut.execute({
      deliveryManId: admin.id.toString(),
      orderId: order.id.toString(),
    });

    expect(result.order).toBeTruthy();
  });

  it("Should not be able to return another delivery-man order", async () => {
    const deliveryMan = makeDeliveryMan();
    const otherDeliveryMan = makeDeliveryMan();
    const order = makeOrder({ deliveryManId: otherDeliveryMan.id });

    inMemoryDeliveryManRepository.items.push(deliveryMan, otherDeliveryMan);
    inMemoryOrderRepository.items.push(order);

    await expect(() =>
      sut.execute({
        deliveryManId: deliveryMan.id.toString(),
        orderId: order.id.toString(),
      })
    ).rejects.toBeInstanceOf(NotAllowedError);
  });

  it("Should not be able to return an unexistent order", async () => {
    const deliveryMan = makeDeliveryMan();
    inMemoryDeliveryManRepository.items.push(deliveryMan);

    await expect(() =>
      sut.execute({
        deliveryManId: deliveryMan.id.toString(),
        orderId: "",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
