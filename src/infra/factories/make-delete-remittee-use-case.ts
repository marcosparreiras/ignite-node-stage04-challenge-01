import { DeleteRemitteeUseCase } from "../../domain/shipping/application/use-cases/delete-remittee";
import { PrimsaDeliveryManRepository } from "../database/prisma/repositories/prisma-delivery-man-repository";
import { PrismaRemitteeRepository } from "../database/prisma/repositories/prisma-remittee-repository";

export function makeDeleteRemitteeUseCase() {
  const deliveryManRepository = new PrimsaDeliveryManRepository();
  const remitteeRepository = new PrismaRemitteeRepository();
  const useCase = new DeleteRemitteeUseCase(
    deliveryManRepository,
    remitteeRepository
  );
  return useCase;
}
