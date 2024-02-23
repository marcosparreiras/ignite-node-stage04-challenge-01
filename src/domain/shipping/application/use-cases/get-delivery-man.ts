import { DeliveryMan } from "../../enterprise/entities/deliveryMan";
import { NotAllowedError } from "../../../core/errors/not-allowed-error";
import { ResourceNotFoundError } from "../../../core/errors/resource-not-found-error";
import { DeliveryManRepository } from "../repositories/delivery-man-repository";

interface GetDeliveryManUseCaseRequest {
  adminId: string;
  deliveryManId: string;
}

interface GetDeliveryManUseCaseResponse {
  deliveryMan: DeliveryMan;
}

export class GetDeliveryManUseCase {
  constructor(private deliveryManRepository: DeliveryManRepository) {}

  async execute({
    adminId,
    deliveryManId,
  }: GetDeliveryManUseCaseRequest): Promise<GetDeliveryManUseCaseResponse> {
    const admin = await this.deliveryManRepository.findById(adminId);
    if (!admin || !admin.isAdmin) {
      throw new NotAllowedError();
    }

    const deliveryMan = await this.deliveryManRepository.findById(
      deliveryManId
    );
    if (!deliveryMan) {
      throw new ResourceNotFoundError();
    }

    return { deliveryMan };
  }
}
