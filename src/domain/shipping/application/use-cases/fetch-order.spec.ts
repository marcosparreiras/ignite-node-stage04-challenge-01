import { makeDeliveryMan } from "../../../../../test/factories/make-delivery-man";
import { makeOrder } from "../../../../../test/factories/make-order";
import { InMemoryDeliveryManRepository } from "../../../../../test/repositories/in-memory-delivery-man-repository";
import { InMemoryOrderRepository } from "../../../../../test/repositories/in-memory-order-repository";
import { NotAllowedError } from "../errors/not-allowed-error";
import { FetchOrderUseCase } from "./fetch-order";

describe("FetchOrderUseCase [Use-Case]", () => {
  let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository;
  let inMemoryOrderRepository: InMemoryOrderRepository;
  let sut: FetchOrderUseCase;

  beforeEach(() => {
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository();
    inMemoryOrderRepository = new InMemoryOrderRepository();
    sut = new FetchOrderUseCase(
      inMemoryDeliveryManRepository,
      inMemoryOrderRepository
    );
  });

  it("Should be able to fetch orders", async () => {
    const admin = makeDeliveryMan({ isAdmin: true });
    inMemoryDeliveryManRepository.items.push(admin);
    inMemoryOrderRepository.items.push(makeOrder(), makeOrder(), makeOrder());

    const response = await sut.execute({
      adminId: admin.id.toString(),
      page: 1,
    });

    expect(response.orders).toHaveLength(3);
  });

  it("Should not be able to fetch orders without admin", async () => {
    inMemoryOrderRepository.items.push(makeOrder(), makeOrder(), makeOrder());
    await expect(() =>
      sut.execute({
        adminId: "",
        page: 1,
      })
    ).rejects.toBeInstanceOf(NotAllowedError);
  });

  it("Should be able to paginate the orders result", async () => {
    const admin = makeDeliveryMan({ isAdmin: true });
    inMemoryDeliveryManRepository.items.push(admin);

    for (let count = 1; count <= 22; count++) {
      inMemoryOrderRepository.items.push(makeOrder());
    }

    const page01 = await sut.execute({
      adminId: admin.id.toString(),
      page: 1,
    });

    const page02 = await sut.execute({
      adminId: admin.id.toString(),
      page: 2,
    });

    expect(page01.orders).toHaveLength(20);
    expect(page02.orders).toHaveLength(2);
  });
});
