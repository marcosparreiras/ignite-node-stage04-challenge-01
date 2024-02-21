import { NotAllowedError } from "../errors/not-allowed-error";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { DeliveryManRepository } from "../repositories/delivery-man-repository";
import { RemitteeRepository } from "../repositories/remittee-repository";

interface DeleteRemitteeUseCaseRequest {
  adminId: string;
  remitteeId: string;
}

interface DeleteRemitteeUseCaseResponse {
  success: boolean;
}

export class DeleteRemitteeUseCase {
  constructor(
    private deliveryManRepository: DeliveryManRepository,
    private remitteeRepository: RemitteeRepository
  ) {}

  async execute({
    adminId,
    remitteeId,
  }: DeleteRemitteeUseCaseRequest): Promise<DeleteRemitteeUseCaseResponse> {
    const admin = await this.deliveryManRepository.findById(adminId);
    if (!admin || !admin.isAdmin) {
      throw new NotAllowedError();
    }

    const remittee = await this.remitteeRepository.findById(remitteeId);
    if (!remittee) {
      throw new ResourceNotFoundError();
    }

    await this.remitteeRepository.delete(remittee);
    return { success: true };
  }
}
