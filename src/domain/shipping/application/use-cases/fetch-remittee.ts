import { Remittee } from "../../enterprise/entities/remittee";
import { NotAllowedError } from "../errors/not-allowed-error";
import { DeliveryManRepository } from "../repositories/delivery-man-repository";
import { RemitteeRepository } from "../repositories/remittee-repository";

interface FetchRemitteeUseCaseRequest {
  adminId: string;
  page: number;
}

interface FetchRemitteeUseCaseResponse {
  remittees: Remittee[];
}

export class FetchRemitteeUseCase {
  constructor(
    private deliveryManRepository: DeliveryManRepository,
    private remitteeRepository: RemitteeRepository
  ) {}

  async execute({
    adminId,
    page,
  }: FetchRemitteeUseCaseRequest): Promise<FetchRemitteeUseCaseResponse> {
    const admin = await this.deliveryManRepository.findById(adminId);
    if (!admin || !admin.isAdmin) {
      throw new NotAllowedError();
    }

    const remittees = await this.remitteeRepository.findMany(page);

    return { remittees };
  }
}
