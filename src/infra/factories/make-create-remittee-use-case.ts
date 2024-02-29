import { CreateRemitteeUseCase } from "../../domain/shipping/application/use-cases/create-remittee";
import { PrimsaDeliveryManRepository } from "../database/prisma/repositories/prisma-delivery-man-repository";
import { PrismaRemitteeRepository } from "../database/prisma/repositories/prisma-remittee-repository";

export function makeCreateRemitteeUseCase() {
  const deliveryManRepository = new PrimsaDeliveryManRepository();
  const remitteeRepository = new PrismaRemitteeRepository();
  const useCase = new CreateRemitteeUseCase(
    deliveryManRepository,
    remitteeRepository
  );
  return useCase;
}
