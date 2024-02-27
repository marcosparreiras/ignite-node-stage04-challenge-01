import { AuthenticateDeliveryManUseCase } from "../../domain/shipping/application/use-cases/authenticate-delivery-man";
import { HashService } from "../cryptography/hash-service";
import { PrimsaDeliveryManRepository } from "../database/prisma/repositories/prisma-delivery-man-repository";

export function makeAuthenticateDeliveryManUseCase() {
  const deliveryManRepository = new PrimsaDeliveryManRepository();
  const hashCompare = new HashService();
  const authenticateDeliveryManUseCase = new AuthenticateDeliveryManUseCase(
    deliveryManRepository,
    hashCompare
  );
  return authenticateDeliveryManUseCase;
}
