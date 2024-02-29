import { UpdateRemitteeUseCase } from "../../domain/shipping/application/use-cases/update-remittee";
import { PrimsaDeliveryManRepository } from "../database/prisma/repositories/prisma-delivery-man-repository";
import { PrismaRemitteeRepository } from "../database/prisma/repositories/prisma-remittee-repository";

export function makeUpdateRemitteUseCase() {
  const deliveryManRepository = new PrimsaDeliveryManRepository();
  const remitteeRepository = new PrismaRemitteeRepository();
  const useCase = new UpdateRemitteeUseCase(
    deliveryManRepository,
    remitteeRepository
  );
  return useCase;
}
