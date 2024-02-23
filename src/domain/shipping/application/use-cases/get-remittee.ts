import { Remittee } from "../../enterprise/entities/remittee";
import { NotAllowedError } from "../../../core/errors/not-allowed-error";
import { ResourceNotFoundError } from "../../../core/errors/resource-not-found-error";
import { DeliveryManRepository } from "../repositories/delivery-man-repository";
import { RemitteeRepository } from "../repositories/remittee-repository";

interface GetRemitteeUseCaseRequest {
  adminId: string;
  remitteeId: string;
}

interface GetRemitteeUseCaseResponse {
  remittee: Remittee;
}

export class GetRemitteeUseCase {
  constructor(
    private deliveryManRepository: DeliveryManRepository,
    private remitteeRepository: RemitteeRepository
  ) {}

  async execute({
    adminId,
    remitteeId,
  }: GetRemitteeUseCaseRequest): Promise<GetRemitteeUseCaseResponse> {
    const admin = await this.deliveryManRepository.findById(adminId);
    if (!admin || !admin.isAdmin) {
      throw new NotAllowedError();
    }

    const remittee = await this.remitteeRepository.findById(remitteeId);
    if (!remittee) {
      throw new ResourceNotFoundError();
    }

    return { remittee };
  }
}
