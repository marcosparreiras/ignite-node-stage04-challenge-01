import { FetchRemitteeUseCase } from "../../domain/shipping/application/use-cases/fetch-remittee";
import { PrimsaDeliveryManRepository } from "../database/prisma/repositories/prisma-delivery-man-repository";
import { PrismaRemitteeRepository } from "../database/prisma/repositories/prisma-remittee-repository";

export function makeFetchRemitteeUseCase() {
  const deliveryManRepository = new PrimsaDeliveryManRepository();
  const remitteeRepository = new PrismaRemitteeRepository();
  const useCase = new FetchRemitteeUseCase(
    deliveryManRepository,
    remitteeRepository
  );
  return useCase;
}
