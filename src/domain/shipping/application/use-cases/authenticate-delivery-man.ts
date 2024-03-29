import { HashCompare } from "../cryptography/hash-compare";
import { InvalidCredentialsError } from "../../../core/errors/invalid-credentials-error";
import { DeliveryManRepository } from "../repositories/delivery-man-repository";
import { DeliveryMan } from "../../enterprise/entities/deliveryMan";

interface AuthenticateDeliveryManUseCaseRequest {
  cpf: string;
  password: string;
}

interface AuthenticateDeliveryManUseCaseReposne {
  deliveryMan: DeliveryMan;
}

export class AuthenticateDeliveryManUseCase {
  constructor(
    private deliveryManRepository: DeliveryManRepository,
    private hashCompare: HashCompare
  ) {}

  async execute({
    cpf,
    password,
  }: AuthenticateDeliveryManUseCaseRequest): Promise<AuthenticateDeliveryManUseCaseReposne> {
    const deliveryMan = await this.deliveryManRepository.findByCpf(cpf);
    if (!deliveryMan) {
      throw new InvalidCredentialsError();
    }

    const passwordIsValid = await this.hashCompare.compare(
      password,
      deliveryMan.password
    );

    if (!passwordIsValid) {
      throw new InvalidCredentialsError();
    }
    return { deliveryMan };
  }
}
