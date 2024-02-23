import { Order } from "../../enterprise/entities/order";
import { ResourceNotFoundError } from "../../../core/errors/resource-not-found-error";
import { DeliveryManRepository } from "../repositories/delivery-man-repository";
import { OrderRepository } from "../repositories/order-repository";

interface FetchDeliveryManOrderUseCaseRequest {
  deliveryManId: string;
  page: number;
}

interface FetchDeliveryManOrderUseCaseResponse {
  orders: Order[];
}

export class FetchDeliveryManOrderUseCase {
  constructor(
    private deliveryManRepository: DeliveryManRepository,
    private orderRepository: OrderRepository
  ) {}

  async execute({
    deliveryManId,
    page,
  }: FetchDeliveryManOrderUseCaseRequest): Promise<FetchDeliveryManOrderUseCaseResponse> {
    const deliveryMan = await this.deliveryManRepository.findById(
      deliveryManId
    );
    if (!deliveryMan) {
      throw new ResourceNotFoundError();
    }

    const orders = await this.orderRepository.findManyByDeliveryManId(
      deliveryManId,
      page
    );
    return { orders };
  }
}
