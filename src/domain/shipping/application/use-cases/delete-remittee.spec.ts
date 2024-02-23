import { makeDeliveryMan } from "../../../../../test/factories/make-delivery-man";
import { makeRemittee } from "../../../../../test/factories/make-remittee";
import { InMemoryDeliveryManRepository } from "../../../../../test/repositories/in-memory-delivery-man-repository";
import { InMemoryRemitteeRepository } from "../../../../../test/repositories/in-memory-remittee-repository";
import { NotAllowedError } from "../../../core/errors/not-allowed-error";
import { ResourceNotFoundError } from "../../../core/errors/resource-not-found-error";
import { DeleteDeliveryManUseCase } from "./delete-delivery-man";
import { DeleteRemitteeUseCase } from "./delete-remittee";

describe("DeleteRemitteeUseCase [Use-Case]", () => {
  let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository;
  let inMemoryRemitteeRepository: InMemoryRemitteeRepository;
  let sut: DeleteRemitteeUseCase;

  beforeEach(() => {
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository();
    inMemoryRemitteeRepository = new InMemoryRemitteeRepository();
    sut = new DeleteRemitteeUseCase(
      inMemoryDeliveryManRepository,
      inMemoryRemitteeRepository
    );
  });

  it("Should be able to delete a remittee", async () => {
    const admin = makeDeliveryMan({ isAdmin: true });
    const remittee = makeRemittee();
    inMemoryDeliveryManRepository.items.push(admin);
    inMemoryRemitteeRepository.items.push(remittee);

    const result = await sut.execute({
      adminId: admin.id.toString(),
      remitteeId: remittee.id.toString(),
    });

    expect(result.success).toEqual(true);
  });

  it("Should not be able to delete a remittee without a valid admin", async () => {
    const remittee = makeRemittee();
    inMemoryRemitteeRepository.items.push(remittee);

    await expect(() => {
      return sut.execute({
        adminId: remittee.id.toString(),
        remitteeId: remittee.id.toString(),
      });
    }).rejects.toBeInstanceOf(NotAllowedError);
  });

  it("Should not be able to delete an unexistent remittee", async () => {
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
