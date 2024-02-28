import { FetchDeliveryManUseCase } from "../../domain/shipping/application/use-cases/fetch-delivery-man";
import { PrimsaDeliveryManRepository } from "../database/prisma/repositories/prisma-delivery-man-repository";

export function makeFecthDeliveryManUseCase() {
  const deliveryManRepository = new PrimsaDeliveryManRepository();
  const useCase = new FetchDeliveryManUseCase(deliveryManRepository);
  return useCase;
}
