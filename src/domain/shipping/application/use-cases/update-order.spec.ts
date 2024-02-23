import { makeDeliveryMan } from "../../../../../test/factories/make-delivery-man";
import { makeOrder } from "../../../../../test/factories/make-order";
import { makeRemittee } from "../../../../../test/factories/make-remittee";
import { InMemoryDeliveryManRepository } from "../../../../../test/repositories/in-memory-delivery-man-repository";
import { InMemoryOrderRepository } from "../../../../../test/repositories/in-memory-order-repository";
import { InMemoryRemitteeRepository } from "../../../../../test/repositories/in-memory-remittee-repository";
import { Location } from "../../enterprise/object-values/location";
import { InvalidGeoCoordinatesError } from "../../../core/errors/invalid-geo-coordinates-error";
import { NotAllowedError } from "../../../core/errors/not-allowed-error";
import { ResourceNotFoundError } from "../../../core/errors/resource-not-found-error";
import { UpdateOrderUseCase } from "./update-order";

describe("UpdateOrderUseCase [Use-Case]", () => {
  let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository;
  let inMemoryRemitteeRepository: InMemoryRemitteeRepository;
  let inMemoryOrderRepository: InMemoryOrderRepository;
  let sut: UpdateOrderUseCase;

  beforeEach(() => {
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository();
    inMemoryRemitteeRepository = new InMemoryRemitteeRepository();
    inMemoryOrderRepository = new InMemoryOrderRepository();
    sut = new UpdateOrderUseCase(
      inMemoryDeliveryManRepository,
      inMemoryRemitteeRepository,
      inMemoryOrderRepository
    );
  });

  it("Should be able to update an order", async () => {
    const admin = makeDeliveryMan({ isAdmin: true });
    const deliveryMan = makeDeliveryMan();
    const remittee = makeRemittee();
    const order = makeOrder();

    inMemoryDeliveryManRepository.items.push(admin, deliveryMan);
    inMemoryRemitteeRepository.items.push(remittee);
    inMemoryOrderRepository.items.push(order);

    const response = await sut.execute({
      adminId: admin.id.toString(),
      orderId: order.id.toString(),
      deliveryManId: deliveryMan.id.toString(),
      remitteeId: remittee.id.toString(),
      latitude: 44.5464,
      longitude: 46.48946,
    });

    expect(response.order).toEqual(
      expect.objectContaining({
        props: expect.objectContaining({
          deliveryManId: deliveryMan.id,
          remitteeId: remittee.id,
          deliveryLocation: new Location(44.5464, 46.48946),
        }),
      })
    );
  });

  it("Should not be able to update an order without admin", async () => {
    const deliveryMan = makeDeliveryMan();
    const remittee = makeRemittee();
    const order = makeOrder();

    inMemoryDeliveryManRepository.items.push(deliveryMan);
    inMemoryRemitteeRepository.items.push(remittee);
    inMemoryOrderRepository.items.push(order);

    await expect(() =>
      sut.execute({
        adminId: deliveryMan.id.toString(),
        orderId: order.id.toString(),
        deliveryManId: deliveryMan.id.toString(),
        remitteeId: remittee.id.toString(),
        latitude: 44.5464,
        longitude: 46.48946,
      })
    ).rejects.toBeInstanceOf(NotAllowedError);
  });

  it("Should not be able to update an unexistent order", async () => {
    const admin = makeDeliveryMan({ isAdmin: true });
    const deliveryMan = makeDeliveryMan();
    const remittee = makeRemittee();

    inMemoryDeliveryManRepository.items.push(admin, deliveryMan);
    inMemoryRemitteeRepository.items.push(remittee);

    await expect(() =>
      sut.execute({
        adminId: admin.id.toString(),
        orderId: "",
        deliveryManId: deliveryMan.id.toString(),
        remitteeId: remittee.id.toString(),
        latitude: 44.5464,
        longitude: 46.48946,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("Should not be able to update an order with an invalid delivery-man", async () => {
    const admin = makeDeliveryMan({ isAdmin: true });
    const remittee = makeRemittee();
    const order = makeOrder();

    inMemoryDeliveryManRepository.items.push(admin);
    inMemoryRemitteeRepository.items.push(remittee);
    inMemoryOrderRepository.items.push(order);

    await expect(() =>
      sut.execute({
        adminId: admin.id.toString(),
        orderId: order.id.toString(),
        deliveryManId: "",
        remitteeId: remittee.id.toString(),
        latitude: 44.5464,
        longitude: 46.48946,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("Should not be able to update an order with an invalid remittee", async () => {
    const admin = makeDeliveryMan({ isAdmin: true });
    const deliveryMan = makeDeliveryMan();
    const order = makeOrder();

    inMemoryDeliveryManRepository.items.push(admin, deliveryMan);
    inMemoryOrderRepository.items.push(order);

    await expect(() =>
      sut.execute({
        adminId: admin.id.toString(),
        orderId: order.id.toString(),
        deliveryManId: deliveryMan.id.toString(),
        remitteeId: "",
        latitude: 44.5464,
        longitude: 46.48946,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("Should not be able to update an order with invalid geo coordinates", async () => {
    const admin = makeDeliveryMan({ isAdmin: true });
    const deliveryMan = makeDeliveryMan();
    const remittee = makeRemittee();
    const order = makeOrder();

    inMemoryDeliveryManRepository.items.push(admin, deliveryMan);
    inMemoryRemitteeRepository.items.push(remittee);
    inMemoryOrderRepository.items.push(order);

    await expect(() =>
      sut.execute({
        adminId: admin.id.toString(),
        orderId: order.id.toString(),
        deliveryManId: deliveryMan.id.toString(),
        remitteeId: remittee.id.toString(),
        latitude: 91.4623,
        longitude: 46.48946,
      })
    ).rejects.toBeInstanceOf(InvalidGeoCoordinatesError);
  });
});
