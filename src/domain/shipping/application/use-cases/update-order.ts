import { Order } from "../../enterprise/entities/order";
import { Location } from "../../enterprise/object-values/location";
import { InvalidGeoCoordinatesError } from "../../../core/errors/invalid-geo-coordinates-error";
import { NotAllowedError } from "../../../core/errors/not-allowed-error";
import { ResourceNotFoundError } from "../../../core/errors/resource-not-found-error";
import { DeliveryManRepository } from "../repositories/delivery-man-repository";
import { OrderRepository } from "../repositories/order-repository";
import { RemitteeRepository } from "../repositories/remittee-repository";

interface UpdateOrderUseCaseRequest {
  adminId: string;
  orderId: string;
  remitteeId: string;
  deliveryManId: string;
  latitude: number;
  longitude: number;
}

interface UpdateOrderUseCaseResponse {
  order: Order;
}

export class UpdateOrderUseCase {
  constructor(
    private deliveryManRepository: DeliveryManRepository,
    private remitteeRepository: RemitteeRepository,
    private orderRepostory: OrderRepository
  ) {}

  async execute({
    adminId,
    orderId,
    deliveryManId,
    remitteeId,
    latitude,
    longitude,
  }: UpdateOrderUseCaseRequest): Promise<UpdateOrderUseCaseResponse> {
    const admin = await this.deliveryManRepository.findById(adminId);
    if (!admin || !admin.isAdmin) {
      throw new NotAllowedError();
    }

    const order = await this.orderRepostory.findById(orderId);
    const deliveryMan = await this.deliveryManRepository.findById(
      deliveryManId
    );
    const remittee = await this.remitteeRepository.findById(remitteeId);

    if (!order || !deliveryMan || !remittee) {
      throw new ResourceNotFoundError();
    }

    if (
      latitude > 90 ||
      latitude < -90 ||
      longitude > 180 ||
      longitude < -180
    ) {
      throw new InvalidGeoCoordinatesError();
    }

    order.deliveryManId = deliveryMan.id;
    order.remitteId = remittee.id;
    order.deliveryLocation = new Location(latitude, longitude);

    await this.orderRepostory.save(order);

    return { order };
  }
}
