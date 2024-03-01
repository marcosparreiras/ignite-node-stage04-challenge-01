import { ReturnOrderUseCase } from "../../domain/shipping/application/use-cases/return-order";
import { RedisCacheRepository } from "../cache/redis/redis-cache-repository";
import { PrimsaDeliveryManRepository } from "../database/prisma/repositories/prisma-delivery-man-repository";
import { PrismaOrderRepository } from "../database/prisma/repositories/prisma-order-repository";

export function makeReturnOrderUseCase() {
  const cacheRepository = new RedisCacheRepository();
  const deliveryManRepository = new PrimsaDeliveryManRepository();
  const orderRepositroy = new PrismaOrderRepository(cacheRepository);
  const useCase = new ReturnOrderUseCase(
    deliveryManRepository,
    orderRepositroy
  );
  return useCase;
}
