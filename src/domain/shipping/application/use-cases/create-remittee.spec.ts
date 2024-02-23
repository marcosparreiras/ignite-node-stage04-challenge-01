import { makeDeliveryMan } from "../../../../../test/factories/make-delivery-man";
import { makeRemittee } from "../../../../../test/factories/make-remittee";
import { InMemoryDeliveryManRepository } from "../../../../../test/repositories/in-memory-delivery-man-repository";
import { InMemoryRemitteeRepository } from "../../../../../test/repositories/in-memory-remittee-repository";
import { NotAllowedError } from "../../../core/errors/not-allowed-error";
import { RemitteeAlreadyExistsError } from "../../../core/errors/remittee-already-exists-error";
import { CreateRemitteeUseCase } from "./create-remittee";

describe("CreateRemitteeUseCase [Use-Case]", () => {
  let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository;
  let inMemoryRemitteeRepository: InMemoryRemitteeRepository;
  let sut: CreateRemitteeUseCase;

  beforeEach(() => {
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository();
    inMemoryRemitteeRepository = new InMemoryRemitteeRepository();
    sut = new CreateRemitteeUseCase(
      inMemoryDeliveryManRepository,
      inMemoryRemitteeRepository
    );
  });

  it("Should be able to create a remittee", async () => {
    const admin = makeDeliveryMan({ isAdmin: true });
    inMemoryDeliveryManRepository.items.push(admin);

    const result = await sut.execute({
      adminId: admin.id.toString(),
      cpf: "00325607248",
      name: "john doe",
    });

    expect(result.remittee).toEqual(
      expect.objectContaining({
        cpf: "00325607248",
        name: "john doe",
      })
    );
  });

  it("Should not be able to create duplicate remittee", async () => {
    const admin = makeDeliveryMan({ isAdmin: true });
    const remittee = makeRemittee();
    inMemoryDeliveryManRepository.items.push(admin);
    inMemoryRemitteeRepository.items.push(remittee);

    await expect(() => {
      return sut.execute({
        adminId: admin.id.toString(),
        cpf: remittee.cpf,
        name: "john  doe",
      });
    }).rejects.toBeInstanceOf(RemitteeAlreadyExistsError);
  });

  it("Should not be able to create remittee without a valid admin", async () => {
    await expect(() => {
      return sut.execute({
        adminId: "fake-admin-id",
        cpf: "00325607248",
        name: "john  doe",
      });
    }).rejects.toBeInstanceOf(NotAllowedError);
  });
});
