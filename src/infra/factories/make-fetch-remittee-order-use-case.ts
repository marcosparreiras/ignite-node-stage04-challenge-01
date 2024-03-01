import { FetchRemitteeOrderUseCase } from "../../domain/shipping/application/use-cases/fetch-remittee-order";
import { RedisCacheRepository } from "../cache/redis/redis-cache-repository";
import { PrismaOrderRepository } from "../database/prisma/repositories/prisma-order-repository";
import { PrismaRemitteeRepository } from "../database/prisma/repositories/prisma-remittee-repository";

export function makeFetchRemitteeOrderUseCase() {
  const cacheRepository = new RedisCacheRepository();
  const remitteeRepository = new PrismaRemitteeRepository();
  const orderRepository = new PrismaOrderRepository(cacheRepository);
  const useCase = new FetchRemitteeOrderUseCase(
    remitteeRepository,
    orderRepository
  );
  return useCase;
}
