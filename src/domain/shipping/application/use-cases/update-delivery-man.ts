import { DeliveryMan } from "../../enterprise/entities/deliveryMan";
import { HashGenerator } from "../cryptography/hash-generator";
import { NotAllowedError } from "../../../core/errors/not-allowed-error";
import { ResourceNotFoundError } from "../../../core/errors/resource-not-found-error";
import { DeliveryManRepository } from "../repositories/delivery-man-repository";

interface UpdateDeliveryManUseCaseRequest {
  adminId: string;
  deliveryManId: string;
  isAdmin: boolean;
  name: string;
  password?: string;
}

interface UpdateDeliveryManUseCaseResponse {
  deliveryMan: DeliveryMan;
}

export class UpdateDeliveryManUseCase {
  constructor(
    private deliveryManRepository: DeliveryManRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute({
    adminId,
    deliveryManId,
    isAdmin,
    name,
    password,
  }: UpdateDeliveryManUseCaseRequest): Promise<UpdateDeliveryManUseCaseResponse> {
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

    deliveryMan.isAdmin = isAdmin;
    deliveryMan.name = name;
    if (password) {
      deliveryMan.password = await this.hashGenerator.hash(password);
    }

    await this.deliveryManRepository.save(deliveryMan);
    return { deliveryMan };
  }
}
