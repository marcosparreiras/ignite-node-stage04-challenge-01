import { makeDeliveryMan } from "../../../../../test/factories/make-delivery-man";
import { makeOrder } from "../../../../../test/factories/make-order";
import { InMemoryDeliveryManRepository } from "../../../../../test/repositories/in-memory-delivery-man-repository";
import { InMemoryOrderRepository } from "../../../../../test/repositories/in-memory-order-repository";
import { ResourceNotFoundError } from "../../../core/errors/resource-not-found-error";
import { FetchDeliveryManOrderUseCase } from "./fetch-delivery-man-order";

describe("FetchDeliveryManOrderUseCase [Use-Case]", async () => {
  let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository;
  let inMemoryOrderRepository: InMemoryOrderRepository;
  let sut: FetchDeliveryManOrderUseCase;

  beforeEach(() => {
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository();
    inMemoryOrderRepository = new InMemoryOrderRepository();
    sut = new FetchDeliveryManOrderUseCase(
      inMemoryDeliveryManRepository,
      inMemoryOrderRepository
    );
  });

  it("Should be able to fecth a delivery-man orders", async () => {
    const deliveryMan = makeDeliveryMan();
    const otherDeliveryMan = makeDeliveryMan();
    inMemoryDeliveryManRepository.items.push(deliveryMan, otherDeliveryMan);

    for (let count = 1; count <= 12; count++) {
      if (count <= 3) {
        inMemoryOrderRepository.items.push(
          makeOrder({ deliveryManId: otherDeliveryMan.id })
        );
      }
      inMemoryOrderRepository.items.push(
        makeOrder({ deliveryManId: deliveryMan.id })
      );
    }

    const result = await sut.execute({
      deliveryManId: deliveryMan.id.toString(),
      page: 1,
    });

    expect(result.orders).toHaveLength(12);
  });

  it("Should be able to paginate a delivery-man orders", async () => {
    const deliveryMan = makeDeliveryMan();
    inMemoryDeliveryManRepository.items.push(deliveryMan);

    for (let count = 1; count <= 22; count++) {
      inMemoryOrderRepository.items.push(
        makeOrder({ deliveryManId: deliveryMan.id })
      );
    }

    const page01 = await sut.execute({
      deliveryManId: deliveryMan.id.toString(),
      page: 1,
    });

    const page02 = await sut.execute({
      deliveryManId: deliveryMan.id.toString(),
      page: 2,
    });

    expect(page01.orders).toHaveLength(20);
    expect(page02.orders).toHaveLength(2);
  });

  it("Should not be able to fetch an unexistent delivery-man orders", async () => {
    await expect(() => {
      return sut.execute({
        deliveryManId: "",
        page: 1,
      });
    }).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
