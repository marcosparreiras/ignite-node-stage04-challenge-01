import { FakeHashGenerator } from "../../../../../test/cryptography/fake-hash-generator";
import { makeDeliveryMan } from "../../../../../test/factories/make-delivery-man";
import { InMemoryDeliveryManRepository } from "../../../../../test/repositories/in-memory-delivery-man-repository";
import { NotAllowedError } from "../errors/not-allowed-error";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { UpdateDeliveryManUseCase } from "./update-delivery-man";

describe("UpdateDeliveryManUseCase [Use-Case]", () => {
  let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository;
  let fakeHashGenerator: FakeHashGenerator;
  let sut: UpdateDeliveryManUseCase;

  beforeEach(() => {
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository();
    fakeHashGenerator = new FakeHashGenerator();
    sut = new UpdateDeliveryManUseCase(
      inMemoryDeliveryManRepository,
      fakeHashGenerator
    );
  });

  it("Should be able to update a delivery-man", async () => {
    const admin = makeDeliveryMan({ isAdmin: true });
    const deliveryMan = makeDeliveryMan();
    inMemoryDeliveryManRepository.items.push(admin, deliveryMan);

    const result = await sut.execute({
      adminId: admin.id.toString(),
      deliveryManId: deliveryMan.id.toString(),
      isAdmin: true,
      name: "john doe",
      password: "123456",
    });

    expect(result.deliveryMan).toEqual(
      expect.objectContaining({
        cpf: deliveryMan.cpf,
        name: "john doe",
        password: await fakeHashGenerator.hash("123456"),
        isAdmin: true,
      })
    );
  });

  it("Should not be able to update a delivery-man without a valid admin", async () => {
    const deliveryMan = makeDeliveryMan();
    inMemoryDeliveryManRepository.items.push(deliveryMan);

    await expect(() => {
      return sut.execute({
        adminId: deliveryMan.id.toString(),
        deliveryManId: deliveryMan.id.toString(),
        isAdmin: true,
        name: "john doe",
        password: "123456",
      });
    }).rejects.toBeInstanceOf(NotAllowedError);
  });

  it("Should not be able to update an unexistent delivery-man", async () => {
    const admin = makeDeliveryMan({ isAdmin: true });
    inMemoryDeliveryManRepository.items.push(admin);

    await expect(() => {
      return sut.execute({
        adminId: admin.id.toString(),
        deliveryManId: "fake-id",
        isAdmin: true,
        name: "john doe",
        password: "123456",
      });
    }).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
