import { makeDeliveryMan } from "../../../../../test/factories/make-delivery-man";
import { makeOrder } from "../../../../../test/factories/make-order";
import { InMemoryDeliveryManRepository } from "../../../../../test/repositories/in-memory-delivery-man-repository";
import { InMemoryOrderRepository } from "../../../../../test/repositories/in-memory-order-repository";
import { NotAllowedError } from "../errors/not-allowed-error";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { DeleteOrderUseCase } from "./delete-order";

describe("DeleteOrderUseCase [Use-Case]", () => {
  let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository;
  let inMemoryOrderRepository: InMemoryOrderRepository;
  let sut: DeleteOrderUseCase;

  beforeEach(() => {
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository();
    inMemoryOrderRepository = new InMemoryOrderRepository();
    sut = new DeleteOrderUseCase(
      inMemoryDeliveryManRepository,
      inMemoryOrderRepository
    );
  });

  it("Should be able to delete an order", async () => {
    const admin = makeDeliveryMan({ isAdmin: true });
    const order = makeOrder();
    inMemoryDeliveryManRepository.items.push(admin);
    inMemoryOrderRepository.items.push(order);

    const response = await sut.execute({
      adminId: admin.id.toString(),
      orderId: order.id.toString(),
    });

    expect(response.success).toEqual(true);
    expect(inMemoryOrderRepository.items).toHaveLength(0);
  });

  it("Should not be able to delete an order without admin", async () => {
    const deliveryMan = makeDeliveryMan();
    const order = makeOrder();
    inMemoryDeliveryManRepository.items.push(deliveryMan);
    inMemoryOrderRepository.items.push(order);

    await expect(() =>
      sut.execute({
        adminId: deliveryMan.id.toString(),
        orderId: order.id.toString(),
      })
    ).rejects.toBeInstanceOf(NotAllowedError);
  });

  it("Should not be able to delete an unexistent order", async () => {
    const admin = makeDeliveryMan({ isAdmin: true });
    inMemoryDeliveryManRepository.items.push(admin);

    await expect(() =>
      sut.execute({
        adminId: admin.id.toString(),
        orderId: "fake-order-id",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
