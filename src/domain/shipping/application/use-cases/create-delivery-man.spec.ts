import { FakeHashCompare } from "../../../../../test/cryptography/fake-hash-compare";
import { FakeHashGenerator } from "../../../../../test/cryptography/fake-hash-generator";
import { makeDeliveryMan } from "../../../../../test/factories/make-delivery-man";
import { InMemoryDeliveryManRepository } from "../../../../../test/repositories/in-memory-delivery-man-repository";
import { DeliveryManAlreadyExistsError } from "../errors/delivery-man-already-exists-error";
import { InvalidCredentialsError } from "../errors/invalid-credentials-error";
import { AuthenticateDeliveryManUseCase } from "./authenticate-delivery-man";
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
    const result = await sut.execute({
      cpf: "00325607248",
      name: "john doe",
      password: "12356",
    });

    expect(result.deliveryMan).toEqual(
      expect.objectContaining({
        cpf: "00325607248",
        name: "john doe",
      })
    );
  });

  it("Should not be able to create duplicate delivery-man", async () => {
    const deliveryMan = makeDeliveryMan();
    inMemoryDeliveryManRepository.items.push(deliveryMan);

    await expect(() => {
      return sut.execute({
        cpf: deliveryMan.cpf,
        password: "123456",
        name: "john  doe",
      });
    }).rejects.toBeInstanceOf(DeliveryManAlreadyExistsError);
  });
});
