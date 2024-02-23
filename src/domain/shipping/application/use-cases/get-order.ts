import { Order } from "../../enterprise/entities/order";
import { NotAllowedError } from "../../../core/errors/not-allowed-error";
import { ResourceNotFoundError } from "../../../core/errors/resource-not-found-error";
import { DeliveryManRepository } from "../repositories/delivery-man-repository";
import { OrderRepository } from "../repositories/order-repository";

interface GetOrderUseCaseRequest {
  adminId: string;
  orderId: string;
}

interface GetOrderUseCaseResponse {
  order: Order;
}

export class GetOrderUseCase {
  constructor(
    private deliveryManRepository: DeliveryManRepository,
    private orderRepository: OrderRepository
  ) {}

  async execute({
    adminId,
    orderId,
  }: GetOrderUseCaseRequest): Promise<GetOrderUseCaseResponse> {
    const admin = await this.deliveryManRepository.findById(adminId);
    if (!admin || !admin.isAdmin) {
      throw new NotAllowedError();
    }

    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new ResourceNotFoundError();
    }

    return { order };
  }
}
