import { GetRemitteeUseCase } from "../../domain/shipping/application/use-cases/get-remittee";
import { PrimsaDeliveryManRepository } from "../database/prisma/repositories/prisma-delivery-man-repository";
import { PrismaRemitteeRepository } from "../database/prisma/repositories/prisma-remittee-repository";

export function makeGetRemitteeUseCase() {
  const deliveryManRepository = new PrimsaDeliveryManRepository();
  const remitteeRepository = new PrismaRemitteeRepository();
  const useCase = new GetRemitteeUseCase(
    deliveryManRepository,
    remitteeRepository
  );
  return useCase;
}
