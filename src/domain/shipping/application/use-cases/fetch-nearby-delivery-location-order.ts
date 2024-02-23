import { Order } from "../../enterprise/entities/order";
import { ResourceNotFoundError } from "../../../core/errors/resource-not-found-error";
import { DeliveryManRepository } from "../repositories/delivery-man-repository";
import { OrderRepository } from "../repositories/order-repository";

interface FetchNearbyDeliveryLocationOrderUseCaseRequest {
  deliveryManId: string;
  latitude: number;
  longitude: number;
  page: number;
}

interface FetchNearbyDeliveryLocationOrderUseCaseResponse {
  orders: Order[];
}

export class FetchNearbyDeliveryLocationOrderUseCase {
  constructor(
    private deliveryManRepository: DeliveryManRepository,
    private orderRepository: OrderRepository
  ) {}

  async execute({
    deliveryManId,
    latitude,
    longitude,
    page,
  }: FetchNearbyDeliveryLocationOrderUseCaseRequest): Promise<FetchNearbyDeliveryLocationOrderUseCaseResponse> {
    const deliveryMan = await this.deliveryManRepository.findById(
      deliveryManId
    );
    if (!deliveryMan) {
      throw new ResourceNotFoundError();
    }
    const orders = await this.orderRepository.findManyNearbyDeliveryMan(
      deliveryManId,
      latitude,
      longitude,
      page
    );
    return { orders };
  }
}
