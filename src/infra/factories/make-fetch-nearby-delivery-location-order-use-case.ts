import { FetchNearbyDeliveryLocationOrderUseCase } from "../../domain/shipping/application/use-cases/fetch-nearby-delivery-location-order";
import { RedisCacheRepository } from "../cache/redis/redis-cache-repository";
import { PrimsaDeliveryManRepository } from "../database/prisma/repositories/prisma-delivery-man-repository";
import { PrismaOrderRepository } from "../database/prisma/repositories/prisma-order-repository";

export function makeFetchNearbyDeliveryLocationOrderUseCase() {
  const cacheRepository = new RedisCacheRepository();
  const deliveryManRepository = new PrimsaDeliveryManRepository();
  const orderRepository = new PrismaOrderRepository(cacheRepository);
  const useCase = new FetchNearbyDeliveryLocationOrderUseCase(
    deliveryManRepository,
    orderRepository
  );
  return useCase;
}
