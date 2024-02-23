import { FakeHashGenerator } from "../../../../../test/cryptography/fake-hash-generator";
import { makeDeliveryMan } from "../../../../../test/factories/make-delivery-man";
import { InMemoryDeliveryManRepository } from "../../../../../test/repositories/in-memory-delivery-man-repository";
import { DeliveryManAlreadyExistsError } from "../../../core/errors/delivery-man-already-exists-error";
import { NotAllowedError } from "../../../core/errors/not-allowed-error";
import { CreateDeliveryManUseCase } from "./create-delivery-man";

describe("CreateDeliveryManUseCase [Use-Case]", () => {
  let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository;
  let fakeHashGenerator: FakeHashGenerator;
  let sut: CreateDeliveryManUseCase;

  beforeEach(() => {
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository();
    fakeHashGenerator = new FakeHashGenerator();
    sut = new CreateDeliveryManUseCase(
      inMemoryDeliveryManRepository,
      fakeHashGenerator
    );
  });

  it("Should be able to create a delivery-man", async () => {
    const admin = makeDeliveryMan({ isAdmin: true });
    inMemoryDeliveryManRepository.items.push(admin);

    const result = await sut.execute({
      adminId: admin.id.toString(),
      cpf: "00325607248",
      name: "john doe",
      password: "123456",
    });

    expect(result.deliveryMan).toEqual(
      expect.objectContaining({
        cpf: "00325607248",
        name: "john doe",
        password: await fakeHashGenerator.hash("123456"),
      })
    );
  });

  it("Should not be able to create duplicate delivery-man", async () => {
    const admin = makeDeliveryMan({ isAdmin: true });
    const deliveryMan = makeDeliveryMan();
    inMemoryDeliveryManRepository.items.push(admin, deliveryMan);

    await expect(() => {
      return sut.execute({
        adminId: admin.id.toString(),
        cpf: deliveryMan.cpf,
        password: "123456",
        name: "john  doe",
      });
    }).rejects.toBeInstanceOf(DeliveryManAlreadyExistsError);
  });

  it("Should not be able to create delivery-man without a valid admin", async () => {
    await expect(() => {
      return sut.execute({
        adminId: "fake-admin-id",
        cpf: "00325607248",
        password: "123456",
        name: "john  doe",
      });
    }).rejects.toBeInstanceOf(NotAllowedError);
  });
});
