import { FakeHashCompare } from "../../../../../test/cryptography/fake-hash-compare";
import { FakeHashGenerator } from "../../../../../test/cryptography/fake-hash-generator";
import { makeDeliveryMan } from "../../../../../test/factories/make-delivery-man";
import { InMemoryDeliveryManRepository } from "../../../../../test/repositories/in-memory-delivery-man-repository";
import { InvalidCredentialsError } from "../errors/invalid-credentials-error";
import { AuthenticateDeliveryManUseCase } from "./authenticate-delivery-man";

describe("AuthenticateDeliveryManUseCase [use-case]", () => {
  let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository;
  let fakeHashCompare: FakeHashCompare;
  let fakeHashGenerator: FakeHashGenerator;
  let sut: AuthenticateDeliveryManUseCase;

  beforeEach(() => {
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository();
    fakeHashCompare = new FakeHashCompare();
    fakeHashGenerator = new FakeHashGenerator();
    sut = new AuthenticateDeliveryManUseCase(
      inMemoryDeliveryManRepository,
      fakeHashCompare
    );
  });

  it("Should be able to autheticate a delivery-man", async () => {
    const cpf = "00456804755";
    const password = "123456";
    const hashedPassword = await fakeHashGenerator.hash(password);

    const deliveryMan = makeDeliveryMan({ password: hashedPassword, cpf });
    inMemoryDeliveryManRepository.items.push(deliveryMan);

    const result = await sut.execute({ cpf, password });
    expect(result.success).toEqual(true);
  });

  it("should not be able to authenticate an unexistent delivery-man", async () => {
    await expect(() => {
      return sut.execute({ cpf: "00456804755", password: "123456" });
    }).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to authenticate a delivery-man with incorrect password", async () => {
    const cpf = "00456804755";
    const password = "123456";
    const hashedPassword = await fakeHashGenerator.hash(password);

    const deliveryMan = makeDeliveryMan({ password: hashedPassword, cpf });
    inMemoryDeliveryManRepository.items.push(deliveryMan);

    await expect(() => {
      return sut.execute({ cpf, password: "654321" });
    }).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
