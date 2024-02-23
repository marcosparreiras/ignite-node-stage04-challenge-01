import { Order } from "../../enterprise/entities/order";
import {
  DeliveryStage,
  DeliveryStageEnum,
} from "../../enterprise/object-values/delivery-stage";
import { InvalidDeliveryStageError } from "../../../core/errors/invalid-delivery-stage-error";
import { MissingDeliveryPhotoUrlError } from "../../../core/errors/missing-delivery-photo-error";
import { NotAllowedError } from "../../../core/errors/not-allowed-error";
import { ResourceNotFoundError } from "../../../core/errors/resource-not-found-error";
import { DeliveryManRepository } from "../repositories/delivery-man-repository";
import { OrderRepository } from "../repositories/order-repository";

interface UpdateOrderDeliveryStageUseCaseRequest {
  deliveryManId: string;
  orderId: string;
  deliveryStage: string;
}

interface UpdateOrderDeliveryStageUseCaseResponse {
  order: Order;
}

export class UpdateOrderDeliveryStageUseCase {
  constructor(
    private deliveryManRepository: DeliveryManRepository,
    private orderRepository: OrderRepository
  ) {}

  async execute({
    deliveryManId,
    orderId,
    deliveryStage,
  }: UpdateOrderDeliveryStageUseCaseRequest): Promise<UpdateOrderDeliveryStageUseCaseResponse> {
    const deliveryMan = await this.deliveryManRepository.findById(
      deliveryManId
    );
    const order = await this.orderRepository.findById(orderId);

    if (!deliveryMan || !order) {
      throw new ResourceNotFoundError();
    }

    if (!deliveryMan.isAdmin && !deliveryMan.id.equals(order.deliveryManId)) {
      throw new NotAllowedError();
    }

    if (!Object.keys(DeliveryStageEnum).includes(deliveryStage)) {
      throw new InvalidDeliveryStageError();
    }

    if (deliveryStage === "DELIVERED" && !order.deliveryConfirmationPhotoUrl) {
      throw new MissingDeliveryPhotoUrlError();
    }

    order.deliveryStage = new DeliveryStage(
      DeliveryStageEnum[deliveryStage as keyof typeof DeliveryStageEnum]
    );
    await this.orderRepository.save(order);

    return { order };
  }
}
