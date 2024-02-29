import { FetchRemitteeOrderUseCase } from "../../domain/shipping/application/use-cases/fetch-remittee-order";
import { PrismaOrderRepository } from "../database/prisma/repositories/prisma-order-repository";
import { PrismaRemitteeRepository } from "../database/prisma/repositories/prisma-remittee-repository";

export function makeFetchRemitteeOrderUseCase() {
  const remitteeRepository = new PrismaRemitteeRepository();
  const orderRepository = new PrismaOrderRepository();
  const useCase = new FetchRemitteeOrderUseCase(
    remitteeRepository,
    orderRepository
  );
  return useCase;
}
