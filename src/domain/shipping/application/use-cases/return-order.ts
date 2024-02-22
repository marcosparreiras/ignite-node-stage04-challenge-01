import { Order } from "../../enterprise/entities/order";
import { NotAllowedError } from "../errors/not-allowed-error";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { DeliveryManRepository } from "../repositories/delivery-man-repository";
import { OrderRepository } from "../repositories/order-repository";

interface ReturnOrderUseCaseRequest {
  deliveryManId: string;
  orderId: string;
}

interface ReturnOrderUseCaseResponse {
  order: Order;
}

export class ReturnOrderUseCase {
  constructor(
    private deliveryManRepository: DeliveryManRepository,
    private orderRepositroy: OrderRepository
  ) {}

  async execute({
    deliveryManId,
    orderId,
  }: ReturnOrderUseCaseRequest): Promise<ReturnOrderUseCaseResponse> {
    const order = await this.orderRepositroy.findById(orderId);
    const deliveryMan = await this.deliveryManRepository.findById(
      deliveryManId
    );

    if (!order || !deliveryMan) {
      throw new ResourceNotFoundError();
    }

    if (!deliveryMan.isAdmin && !deliveryMan.id.isEqual(order.deliveryManId)) {
      throw new NotAllowedError();
    }

    order.deliveryStage = order.deliveryStage.returnDelivery();
    await this.orderRepositroy.save(order);

    return { order };
  }
}
