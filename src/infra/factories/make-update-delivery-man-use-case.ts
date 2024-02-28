import { UpdateDeliveryManUseCase } from "../../domain/shipping/application/use-cases/update-delivery-man";
import { HashService } from "../cryptography/hash-service";
import { PrimsaDeliveryManRepository } from "../database/prisma/repositories/prisma-delivery-man-repository";

export function makeUpdateDeliveryManUseCase() {
  const deliveryManRepository = new PrimsaDeliveryManRepository();
  const hashGenerator = new HashService();
  const useCase = new UpdateDeliveryManUseCase(
    deliveryManRepository,
    hashGenerator
  );
  return useCase;
}
