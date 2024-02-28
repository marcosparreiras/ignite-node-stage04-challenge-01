import { DeleteDeliveryManUseCase } from "../../domain/shipping/application/use-cases/delete-delivery-man";
import { PrimsaDeliveryManRepository } from "../database/prisma/repositories/prisma-delivery-man-repository";

export function makeDeleteDeliveryManUseCase() {
  const deliveryManRepository = new PrimsaDeliveryManRepository();
  const useCase = new DeleteDeliveryManUseCase(deliveryManRepository);
  return useCase;
}
