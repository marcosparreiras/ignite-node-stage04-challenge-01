import { makeDeliveryMan } from "../../../../../test/factories/make-delivery-man";
import { makeRemittee } from "../../../../../test/factories/make-remittee";
import { InMemoryDeliveryManRepository } from "../../../../../test/repositories/in-memory-delivery-man-repository";
import { InMemoryRemitteeRepository } from "../../../../../test/repositories/in-memory-remittee-repository";
import { NotAllowedError } from "../../../core/errors/not-allowed-error";
import { ResourceNotFoundError } from "../../../core/errors/resource-not-found-error";
import { GetDeliveryManUseCase } from "./get-delivery-man";
import { GetRemitteeUseCase } from "./get-remittee";

describe("GetRemitteeUseCase [Use-Case]", () => {
  let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository;
  let inMemoryRemitteeRepository: InMemoryRemitteeRepository;
  let sut: GetRemitteeUseCase;

  beforeEach(() => {
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository();
    inMemoryRemitteeRepository = new InMemoryRemitteeRepository();
    sut = new GetRemitteeUseCase(
      inMemoryDeliveryManRepository,
      inMemoryRemitteeRepository
    );
  });

  it("Should be able to get a remittee", async () => {
    const admin = makeDeliveryMan({ isAdmin: true });
    const remittee = makeRemittee();
    inMemoryDeliveryManRepository.items.push(admin);
    inMemoryRemitteeRepository.items.push(remittee);

    const result = await sut.execute({
      adminId: admin.id.toString(),
      remitteeId: remittee.id.toString(),
    });

    expect(result.remittee).toEqual(
      expect.objectContaining({
        cpf: remittee.cpf,
        name: remittee.name,
      })
    );
  });

  it("Should not be able to get a remittee without a valid admin", async () => {
    const remittee = makeRemittee();
    inMemoryRemitteeRepository.items.push(remittee);

    await expect(() => {
      return sut.execute({
        adminId: remittee.id.toString(),
        remitteeId: remittee.id.toString(),
      });
    }).rejects.toBeInstanceOf(NotAllowedError);
  });

  it("Should not be able to get an unexistent remittee", async () => {
    const admin = makeDeliveryMan({ isAdmin: true });
    inMemoryDeliveryManRepository.items.push(admin);

    await expect(() => {
      return sut.execute({
        adminId: admin.id.toString(),
        remitteeId: "fake-id",
      });
    }).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
