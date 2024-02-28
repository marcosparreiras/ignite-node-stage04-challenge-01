import { GetDeliveryManUseCase } from "../../domain/shipping/application/use-cases/get-delivery-man";
import { PrimsaDeliveryManRepository } from "../database/prisma/repositories/prisma-delivery-man-repository";

export function makeGetDeliveryManUseCase() {
  const deliveryManRepository = new PrimsaDeliveryManRepository();
  const useCase = new GetDeliveryManUseCase(deliveryManRepository);
  return useCase;
}
