import { makeDeliveryMan } from "../../../../../test/factories/make-delivery-man";
import { makeOrder } from "../../../../../test/factories/make-order";
import { InMemoryDeliveryManRepository } from "../../../../../test/repositories/in-memory-delivery-man-repository";
import { InMemoryOrderRepository } from "../../../../../test/repositories/in-memory-order-repository";
import { Location } from "../../enterprise/object-values/location";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { FetchNearbyDeliveryLocationOrderUseCase } from "./fetch-nearby-delivery-location-order";

describe("FetchNearbyDeliveryLocationOrderUseCase", () => {
  let inMemoryDeliveryManRespository: InMemoryDeliveryManRepository;
  let inMemoryOrderRepository: InMemoryOrderRepository;
  let sut: FetchNearbyDeliveryLocationOrderUseCase;

  beforeEach(() => {
    inMemoryDeliveryManRespository = new InMemoryDeliveryManRepository();
    inMemoryOrderRepository = new InMemoryOrderRepository();
    sut = new FetchNearbyDeliveryLocationOrderUseCase(
      inMemoryDeliveryManRespository,
      inMemoryOrderRepository
    );
  });

  it("Should be able to fetch near delivery location orders", async () => {
    const deliveryMan = makeDeliveryMan();
    const otherDeliveryMan = makeDeliveryMan();

    inMemoryDeliveryManRespository.items.push(deliveryMan, otherDeliveryMan);

    inMemoryOrderRepository.items.push(
      makeOrder({
        deliveryManId: deliveryMan.id,
        deliveryLocation: new Location(-19.94765332605529, -43.94034520061096),
      }),
      makeOrder({
        deliveryManId: deliveryMan.id,

        deliveryLocation: new Location(-19.94154883037107, -43.931362865244516),
      }),
      makeOrder({
        deliveryManId: deliveryMan.id,
        deliveryLocation: new Location(
          -19.953130055873686,
          -43.931484248154874
        ),
      }),
      makeOrder({
        deliveryManId: deliveryMan.id,
        deliveryLocation: new Location(-19.91612678488924, -43.97581745976151),
      }),
      makeOrder({
        deliveryManId: otherDeliveryMan.id,
        deliveryLocation: new Location(-19.94765332605529, -43.94034520061096),
      })
    );

    const result = await sut.execute({
      deliveryManId: deliveryMan.id.toString(),
      latitude: -19.944880942332365,
      longitude: -43.92969108432678,
      page: 1,
    });

    expect(result.orders).toHaveLength(3);
  });

  it("Should be able to paginate near delivery location results", async () => {
    const deliveryMan = makeDeliveryMan();
    inMemoryDeliveryManRespository.items.push(deliveryMan);

    for (let count = 1; count <= 22; count++) {
      inMemoryOrderRepository.items.push(
        makeOrder({
          deliveryManId: deliveryMan.id,
          deliveryLocation: new Location(
            -19.94765332605529,
            -43.94034520061096
          ),
        })
      );
    }

    const page01 = await sut.execute({
      deliveryManId: deliveryMan.id.toString(),
      latitude: -19.944880942332365,
      longitude: -43.92969108432678,
      page: 1,
    });

    const page02 = await sut.execute({
      deliveryManId: deliveryMan.id.toString(),
      latitude: -19.944880942332365,
      longitude: -43.92969108432678,
      page: 2,
    });

    expect(page01.orders).toHaveLength(20);
    expect(page02.orders).toHaveLength(2);
  });

  it("Should not be able to fecth near delivery locations with invalid delivery-man", async () => {
    await expect(() =>
      sut.execute({
        deliveryManId: "",
        latitude: -19.944880942332365,
        longitude: -43.92969108432678,
        page: 1,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
