import { makeDeliveryMan } from "../../../../../test/factories/make-delivery-man";
import { InMemoryDeliveryManRepository } from "../../../../../test/repositories/in-memory-delivery-man-repository";
import { NotAllowedError } from "../errors/not-allowed-error";
import { FetchDeliveryManUseCase } from "./fetch-delivery-man";

describe("FetchDeliveryManUseCase [Use-Case]", () => {
  let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository;
  let sut: FetchDeliveryManUseCase;

  beforeEach(() => {
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository();
    sut = new FetchDeliveryManUseCase(inMemoryDeliveryManRepository);
  });

  it("Should be able to fetch delivery-man", async () => {
    const admin = makeDeliveryMan({ isAdmin: true });
    inMemoryDeliveryManRepository.items.push(
      admin,
      makeDeliveryMan(),
      makeDeliveryMan(),
      makeDeliveryMan()
    );

    const result = await sut.execute({
      adminId: admin.id.toString(),
      page: 1,
    });

    expect(result.deliveryMan).toHaveLength(4);
  });

  it("Should not be able to fecth delivery-man without a valid admin", async () => {
    const deliveryMan = makeDeliveryMan();
    inMemoryDeliveryManRepository.items.push(deliveryMan);

    await expect(() => {
      return sut.execute({
        adminId: deliveryMan.id.toString(),
        page: 1,
      });
    }).rejects.toBeInstanceOf(NotAllowedError);
  });

  it("Should be able to paginate delivery-man resuts", async () => {
    const admin = makeDeliveryMan({ isAdmin: true });
    inMemoryDeliveryManRepository.items.push(admin);

    for (let count = 1; count <= 22; count++) {
      inMemoryDeliveryManRepository.items.push(makeDeliveryMan());
    }

    const page01 = await sut.execute({
      adminId: admin.id.toString(),
      page: 1,
    });

    const page02 = await sut.execute({
      adminId: admin.id.toString(),
      page: 2,
    });

    expect(page01.deliveryMan).toHaveLength(20);
    expect(page02.deliveryMan).toHaveLength(3);
  });
});
