import { NotAllowedError } from "../errors/not-allowed-error";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { DeliveryManRepository } from "../repositories/delivery-man-repository";

interface DeleteDeliveryManUseCaseRequest {
  adminId: string;
  deliveryManId: string;
}

interface DeleteDeliveryManUseCaseResponse {
  success: boolean;
}

export class DeleteDeliveryManUseCase {
  constructor(private deliveryManRepository: DeliveryManRepository) {}

  async execute({
    adminId,
    deliveryManId,
  }: DeleteDeliveryManUseCaseRequest): Promise<DeleteDeliveryManUseCaseResponse> {
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

    await this.deliveryManRepository.delete(deliveryMan);
    return { success: true };
  }
}
