import { Order } from "../../enterprise/entities/order";
import { Location } from "../../enterprise/object-values/location";
import { InvalidGeoCoordinatesError } from "../../../core/errors/invalid-geo-coordinates-error";
import { NotAllowedError } from "../../../core/errors/not-allowed-error";
import { ResourceNotFoundError } from "../../../core/errors/resource-not-found-error";
import { DeliveryManRepository } from "../repositories/delivery-man-repository";
import { OrderRepository } from "../repositories/order-repository";
import { RemitteeRepository } from "../repositories/remittee-repository";

interface CreateOrderUseCaseRequest {
  adminId: string;
  remitteeId: string;
  deliveryManId: string;
  latitude: number;
  longitude: number;
}

interface CreateOrderUseCaseResponse {
  order: Order;
}

export class CreateOrderUseCase {
  constructor(
    private deliveryManRepository: DeliveryManRepository,
    private remitteeRepository: RemitteeRepository,
    private orderRepository: OrderRepository
  ) {}

  async execute({
    adminId,
    remitteeId,
    deliveryManId,
    latitude,
    longitude,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    const admin = await this.deliveryManRepository.findById(adminId);
    if (!admin || !admin.isAdmin) {
      throw new NotAllowedError();
    }

    const remittee = await this.remitteeRepository.findById(remitteeId);
    const deliveryMan = await this.deliveryManRepository.findById(
      deliveryManId
    );
    if (!remittee || !deliveryMan) {
      throw new ResourceNotFoundError();
    }

    if (latitude > 90 || latitude < 0 || longitude > 180 || longitude < 0) {
      throw new InvalidGeoCoordinatesError();
    }

    const order = Order.create({
      remitteeId: remittee.id,
      deliveryManId: deliveryMan.id,
      deliveryLocation: new Location(latitude, longitude),
    });
    await this.orderRepository.create(order);

    return { order };
  }
}
