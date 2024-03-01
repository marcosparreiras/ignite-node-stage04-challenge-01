import { UpdateOrderDeliveryStageUseCase } from "../../domain/shipping/application/use-cases/update-order-delivery-stage";
import { RedisCacheRepository } from "../cache/redis/redis-cache-repository";
import { PrimsaDeliveryManRepository } from "../database/prisma/repositories/prisma-delivery-man-repository";
import { PrismaOrderRepository } from "../database/prisma/repositories/prisma-order-repository";

export function makeUpdateOrderDeliveryStageUseCase() {
  const cacheRepository = new RedisCacheRepository();
  const deliveryManRepository = new PrimsaDeliveryManRepository();
  const orderRepository = new PrismaOrderRepository(cacheRepository);
  const useCase = new UpdateOrderDeliveryStageUseCase(
    deliveryManRepository,
    orderRepository
  );
  return useCase;
}
