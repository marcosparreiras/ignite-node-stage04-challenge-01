import { makeDeliveryMan } from "../../../../../test/factories/make-delivery-man";
import { makeRemittee } from "../../../../../test/factories/make-remittee";
import { InMemoryDeliveryManRepository } from "../../../../../test/repositories/in-memory-delivery-man-repository";
import { InMemoryRemitteeRepository } from "../../../../../test/repositories/in-memory-remittee-repository";
import { NotAllowedError } from "../../../core/errors/not-allowed-error";
import { FetchRemitteeUseCase } from "./fetch-remittee";

describe("FetchRemitteeUseCase [Use-Case]", () => {
  let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository;
  let inMemoryRemitteeRepository: InMemoryRemitteeRepository;
  let sut: FetchRemitteeUseCase;

  beforeEach(() => {
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository();
    inMemoryRemitteeRepository = new InMemoryRemitteeRepository();
    sut = new FetchRemitteeUseCase(
      inMemoryDeliveryManRepository,
      inMemoryRemitteeRepository
    );
  });

  it("Should be able to fetch remittees", async () => {
    const admin = makeDeliveryMan({ isAdmin: true });
    inMemoryDeliveryManRepository.items.push(admin);
    inMemoryRemitteeRepository.items.push(
      makeRemittee(),
      makeRemittee(),
      makeRemittee()
    );

    const result = await sut.execute({
      adminId: admin.id.toString(),
      page: 1,
    });

    expect(result.remittees).toHaveLength(3);
  });

  it("Should not be able to fecth remittees without a valid admin", async () => {
    const remittee = makeRemittee();
    inMemoryRemitteeRepository.items.push(remittee);

    await expect(() => {
      return sut.execute({
        adminId: remittee.id.toString(),
        page: 1,
      });
    }).rejects.toBeInstanceOf(NotAllowedError);
  });

  it("Should be able to paginate remittees results", async () => {
    const admin = makeDeliveryMan({ isAdmin: true });
    inMemoryDeliveryManRepository.items.push(admin);

    for (let count = 1; count <= 22; count++) {
      inMemoryRemitteeRepository.items.push(makeRemittee());
    }

    const page01 = await sut.execute({
      adminId: admin.id.toString(),
      page: 1,
    });

    const page02 = await sut.execute({
      adminId: admin.id.toString(),
      page: 2,
    });

    expect(page01.remittees).toHaveLength(20);
    expect(page02.remittees).toHaveLength(2);
  });
});
