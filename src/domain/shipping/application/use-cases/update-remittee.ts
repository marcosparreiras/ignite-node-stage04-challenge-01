import { Remittee } from "../../enterprise/entities/remittee";
import { NotAllowedError } from "../errors/not-allowed-error";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { DeliveryManRepository } from "../repositories/delivery-man-repository";
import { RemitteeRepository } from "../repositories/remittee-repository";

interface UpdateRemitteeUseCaseRequest {
  adminId: string;
  remitteeId: string;
  name: string;
}

interface UpdateRemitteeUseCaseResponse {
  remitte: Remittee;
}

export class UpdateRemitteeUseCase {
  constructor(
    private deliveryManRepository: DeliveryManRepository,
    private remitteeRepository: RemitteeRepository
  ) {}

  async execute({
    adminId,
    remitteeId,
    name,
  }: UpdateRemitteeUseCaseRequest): Promise<UpdateRemitteeUseCaseResponse> {
    const admin = await this.deliveryManRepository.findById(adminId);
    if (!admin || !admin.isAdmin) {
      throw new NotAllowedError();
    }

    const remitte = await this.remitteeRepository.findById(remitteeId);
    if (!remitte) {
      throw new ResourceNotFoundError();
    }

    remitte.name = name;
    await this.remitteeRepository.save(remitte);

    return { remitte };
  }
}
