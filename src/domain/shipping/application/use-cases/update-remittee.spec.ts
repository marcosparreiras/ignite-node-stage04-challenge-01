import { makeDeliveryMan } from "../../../../../test/factories/make-delivery-man";
import { makeRemittee } from "../../../../../test/factories/make-remittee";
import { InMemoryDeliveryManRepository } from "../../../../../test/repositories/in-memory-delivery-man-repository";
import { InMemoryRemitteeRepository } from "../../../../../test/repositories/in-memory-remittee-repository";
import { NotAllowedError } from "../../../core/errors/not-allowed-error";
import { ResourceNotFoundError } from "../../../core/errors/resource-not-found-error";
import { UpdateRemitteeUseCase } from "./update-remittee";

describe("UpdateRemitteeUseCase [Use-Case]", () => {
  let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository;
  let inMemoryRemitteeRepository: InMemoryRemitteeRepository;
  let sut: UpdateRemitteeUseCase;

  beforeEach(() => {
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository();
    inMemoryRemitteeRepository = new InMemoryRemitteeRepository();

    sut = new UpdateRemitteeUseCase(
      inMemoryDeliveryManRepository,
      inMemoryRemitteeRepository
    );
  });

  it("Should be able to update a remittee", async () => {
    const admin = makeDeliveryMan({ isAdmin: true });
    const remitte = makeRemittee();
    inMemoryDeliveryManRepository.items.push(admin);
    inMemoryRemitteeRepository.items.push(remitte);

    const result = await sut.execute({
      adminId: admin.id.toString(),
      remitteeId: remitte.id.toString(),
      name: "john doe",
    });

    expect(result.remitte).toEqual(
      expect.objectContaining({
        name: "john doe",
      })
    );
  });

  it("Should not be able to update a remittee without a valid admin", async () => {
    const remitte = makeRemittee();
    inMemoryRemitteeRepository.items.push(remitte);

    await expect(() => {
      return sut.execute({
        adminId: remitte.id.toString(),
        remitteeId: remitte.id.toString(),
        name: "john doe",
      });
    }).rejects.toBeInstanceOf(NotAllowedError);
  });

  it("Should not be able to update an unexistent remitte", async () => {
    const admin = makeDeliveryMan({ isAdmin: true });
    inMemoryDeliveryManRepository.items.push(admin);

    await expect(() => {
      return sut.execute({
        adminId: admin.id.toString(),
        remitteeId: "fake-id",
        name: "john doe",
      });
    }).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
