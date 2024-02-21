import { Remittee } from "../../enterprise/entities/remittee";
import { NotAllowedError } from "../errors/not-allowed-error";
import { RemitteeAlreadyExistsError } from "../errors/remittee-already-exists-error";
import { DeliveryManRepository } from "../repositories/delivery-man-repository";
import { RemitteeRepository } from "../repositories/remittee-repository";

interface CreateRemitteeUseCaseRequest {
  adminId: string;
  cpf: string;
  name: string;
}

interface CreateRemitteeUseCaseResponse {
  remittee: Remittee;
}

export class CreateRemitteeUseCase {
  constructor(
    private deliveryManRepository: DeliveryManRepository,
    private remitteeRepository: RemitteeRepository
  ) {}

  async execute({
    adminId,
    cpf,
    name,
  }: CreateRemitteeUseCaseRequest): Promise<CreateRemitteeUseCaseResponse> {
    const admin = await this.deliveryManRepository.findById(adminId);
    if (!admin || !admin.isAdmin) {
      throw new NotAllowedError();
    }

    const remitteeAlreadyExists = await this.remitteeRepository.findByCpf(cpf);
    if (remitteeAlreadyExists) {
      throw new RemitteeAlreadyExistsError();
    }

    const remittee = Remittee.create({ cpf, name });
    await this.remitteeRepository.create(remittee);

    return { remittee };
  }
}
