import { makeDeliveryMan } from "../../../../../test/factories/make-delivery-man";
import { makeRemittee } from "../../../../../test/factories/make-remittee";
import { InMemoryDeliveryManRepository } from "../../../../../test/repositories/in-memory-delivery-man-repository";
import { InMemoryOrderRepository } from "../../../../../test/repositories/in-memory-order-repository";
import { InMemoryRemitteeRepository } from "../../../../../test/repositories/in-memory-remittee-repository";
import { InvalidGeoCoordinatesError } from "../errors/invalid-geo-coordinates-error";
import { NotAllowedError } from "../errors/not-allowed-error";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { CreateOrderUseCase } from "./create-order";

describe("CreateOrderUseCase [Use-Case]", () => {
  let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository;
  let inMemoryRemitteeRepository: InMemoryRemitteeRepository;
  let inMemoryOrderRepository: InMemoryOrderRepository;
  let sut: CreateOrderUseCase;

  beforeEach(() => {
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository();
    inMemoryRemitteeRepository = new InMemoryRemitteeRepository();
    inMemoryOrderRepository = new InMemoryOrderRepository();
    sut = new CreateOrderUseCase(
      inMemoryDeliveryManRepository,
      inMemoryRemitteeRepository,
      inMemoryOrderRepository
    );
  });

  it("Should be able to create an order", async () => {
    const admin = makeDeliveryMan({ isAdmin: true });
    const deliveryMan = makeDeliveryMan();
    const remittee = makeRemittee();

    inMemoryDeliveryManRepository.items.push(admin, deliveryMan);
    inMemoryRemitteeRepository.items.push(remittee);

    const response = await sut.execute({
      adminId: admin.id.toString(),
      deliveryManId: deliveryMan.id.toString(),
      remitteeId: remittee.id.toString(),
      latitude: 44.5464,
      longitude: 46.48946,
    });

    expect(response.order).toBeTruthy();
  });

  it("Should not be able to create an order without admin", async () => {
    const deliveryMan = makeDeliveryMan();
    const remittee = makeRemittee();

    inMemoryDeliveryManRepository.items.push(deliveryMan);
    inMemoryRemitteeRepository.items.push(remittee);

    await expect(() =>
      sut.execute({
        adminId: deliveryMan.id.toString(),
        deliveryManId: deliveryMan.id.toString(),
        remitteeId: remittee.id.toString(),
        latitude: 44.5464,
        longitude: 46.48946,
      })
    ).rejects.toBeInstanceOf(NotAllowedError);
  });

  it("Should not be able to create an order without delivery-man", async () => {
    const admin = makeDeliveryMan({ isAdmin: true });
    const remittee = makeRemittee();

    inMemoryDeliveryManRepository.items.push(admin);
    inMemoryRemitteeRepository.items.push(remittee);

    await expect(() =>
      sut.execute({
        adminId: admin.id.toString(),
        deliveryManId: "",
        remitteeId: remittee.id.toString(),
        latitude: 44.5464,
        longitude: 46.48946,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("Should not be able to create an order without remittee", async () => {
    const admin = makeDeliveryMan({ isAdmin: true });
    const deliveryMan = makeDeliveryMan();

    inMemoryDeliveryManRepository.items.push(admin, deliveryMan);

    await expect(() =>
      sut.execute({
        adminId: admin.id.toString(),
        deliveryManId: deliveryMan.id.toString(),
        remitteeId: "",
        latitude: 44.5464,
        longitude: 46.48946,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("Should not be able to create an order wiht invalid geo coordinates", async () => {
    const admin = makeDeliveryMan({ isAdmin: true });
    const deliveryMan = makeDeliveryMan();
    const remittee = makeRemittee();

    inMemoryDeliveryManRepository.items.push(admin, deliveryMan);
    inMemoryRemitteeRepository.items.push(remittee);

    await expect(() =>
      sut.execute({
        adminId: admin.id.toString(),
        deliveryManId: deliveryMan.id.toString(),
        remitteeId: remittee.id.toString(),
        latitude: 91.4623,
        longitude: 46.48946,
      })
    ).rejects.toBeInstanceOf(InvalidGeoCoordinatesError);
  });
});
