import { CreateDeliveryManUseCase } from "../../domain/shipping/application/use-cases/create-delivery-man";
import { HashService } from "../cryptography/hash-service";
import { PrimsaDeliveryManRepository } from "../database/prisma/repositories/prisma-delivery-man-repository";

export function makeCreateDeliveryManUseCase() {
  const deliveryManRepository = new PrimsaDeliveryManRepository();
  const hashGenerator = new HashService();
  const useCase = new CreateDeliveryManUseCase(
    deliveryManRepository,
    hashGenerator
  );
  return useCase;
}
