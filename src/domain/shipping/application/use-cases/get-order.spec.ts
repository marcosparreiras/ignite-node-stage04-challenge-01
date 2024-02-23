import { makeDeliveryMan } from "../../../../../test/factories/make-delivery-man";
import { makeOrder } from "../../../../../test/factories/make-order";
import { InMemoryDeliveryManRepository } from "../../../../../test/repositories/in-memory-delivery-man-repository";
import { InMemoryOrderRepository } from "../../../../../test/repositories/in-memory-order-repository";
import { NotAllowedError } from "../../../core/errors/not-allowed-error";
import { ResourceNotFoundError } from "../../../core/errors/resource-not-found-error";
import { GetOrderUseCase } from "./get-order";

describe("GetOrderUseCase [Use-Case]", () => {
  let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository;
  let inMemoryOrderRepository: InMemoryOrderRepository;
  let sut: GetOrderUseCase;

  beforeEach(() => {
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository();
    inMemoryOrderRepository = new InMemoryOrderRepository();
    sut = new GetOrderUseCase(
      inMemoryDeliveryManRepository,
      inMemoryOrderRepository
    );
  });

  it("Should be able to get an order", async () => {
    const admin = makeDeliveryMan({ isAdmin: true });
    const order = makeOrder();
    inMemoryDeliveryManRepository.items.push(admin);
    inMemoryOrderRepository.items.push(order);

    const response = await sut.execute({
      adminId: admin.id.toString(),
      orderId: order.id.toString(),
    });

    expect(response.order).toBeTruthy();
  });

  it("Should not be able to get an order without admin", async () => {
    const order = makeOrder();
    inMemoryOrderRepository.items.push(order);

    await expect(() => {
      return sut.execute({
        adminId: "",
        orderId: order.id.toString(),
      });
    }).rejects.toBeInstanceOf(NotAllowedError);
  });

  it("Should not be able to get an unexistent order", async () => {
    const admin = makeDeliveryMan({ isAdmin: true });
    inMemoryDeliveryManRepository.items.push(admin);

    await expect(() => {
      return sut.execute({
        adminId: admin.id.toString(),
        orderId: "",
      });
    }).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
