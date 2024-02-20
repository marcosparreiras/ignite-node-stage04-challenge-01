import { makeDeliveryMan } from "../../../../../test/factories/make-delivery-man";
import { InMemoryDeliveryManRepository } from "../../../../../test/repositories/in-memory-delivery-man-repository";
import { NotAllowedError } from "../errors/not-allowed-error";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { DeleteDeliveryManUseCase } from "./delete-delivery-man";

describe("DeleteDeliveryManUseCase [Use-Case]", () => {
  let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository;
  let sut: DeleteDeliveryManUseCase;

  beforeEach(() => {
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository();
    sut = new DeleteDeliveryManUseCase(inMemoryDeliveryManRepository);
  });

  it("Should be able to delete a delivery-man", async () => {
    const admin = makeDeliveryMan({ isAdmin: true });
    const deliveryMan = makeDeliveryMan();
    inMemoryDeliveryManRepository.items.push(admin, deliveryMan);

    const result = await sut.execute({
      adminId: admin.id.toString(),
      deliveryManId: deliveryMan.id.toString(),
    });

    expect(result.success).toEqual(true);
  });

  it("Should not be able to delete a delivery-man without a valid admin", async () => {
    const deliveryMan = makeDeliveryMan();
    inMemoryDeliveryManRepository.items.push(deliveryMan);

    await expect(() => {
      return sut.execute({
        adminId: deliveryMan.id.toString(),
        deliveryManId: deliveryMan.id.toString(),
      });
    }).rejects.toBeInstanceOf(NotAllowedError);
  });

  it("Should not be able to delete an unexistent delivery-man", async () => {
    const admin = makeDeliveryMan({ isAdmin: true });
    inMemoryDeliveryManRepository.items.push(admin);

    await expect(() => {
      return sut.execute({
        adminId: admin.id.toString(),
        deliveryManId: "fake-id",
      });
    }).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
