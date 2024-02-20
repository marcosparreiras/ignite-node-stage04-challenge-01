import { DeliveryMan } from "../../enterprise/entities/deliveryMan";
import { NotAllowedError } from "../errors/not-allowed-error";
import { DeliveryManRepository } from "../repositories/delivery-man-repository";

interface FetchDeliveryManUseCaseRequest {
  adminId: string;
  page: number;
}

interface FetchDeliveryManUseCaseResponse {
  deliveryMan: DeliveryMan[];
}

export class FetchDeliveryManUseCase {
  constructor(private deliveryManRepository: DeliveryManRepository) {}

  async execute({
    adminId,
    page,
  }: FetchDeliveryManUseCaseRequest): Promise<FetchDeliveryManUseCaseResponse> {
    const admin = await this.deliveryManRepository.findById(adminId);
    if (!admin || !admin.isAdmin) {
      throw new NotAllowedError();
    }
    const deliveryMan = await this.deliveryManRepository.findMany(page);
    return { deliveryMan };
  }
}
