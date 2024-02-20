import { DeliveryMan } from "../../enterprise/entities/deliveryMan";
import { HashGenerator } from "../cryptography/hash-generator";
import { DeliveryManAlreadyExistsError } from "../errors/delivery-man-already-exists-error";
import { DeliveryManRepository } from "../repositories/delivery-man-repository";

interface CreateDeliveryManUseCaseRequest {
  cpf: string;
  name: string;
  password: string;
}

interface CreateDeliveryManUseCaseResponse {
  deliveryMan: DeliveryMan;
}

export class CreateDeliveryManUseCase {
  constructor(
    private deliveryManRepository: DeliveryManRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute({
    cpf,
    name,
    password,
  }: CreateDeliveryManUseCaseRequest): Promise<CreateDeliveryManUseCaseResponse> {
    const deliveryManAlreadyExists = await this.deliveryManRepository.findByCpf(
      cpf
    );
    if (deliveryManAlreadyExists) {
      throw new DeliveryManAlreadyExistsError();
    }

    const hashedPassword = await this.hashGenerator.hash(password);
    const deliveryMan = DeliveryMan.create({
      cpf,
      name,
      password: hashedPassword,
    });

    await this.deliveryManRepository.create(deliveryMan);
    return { deliveryMan };
  }
}
