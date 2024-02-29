import { FetchNearbyDeliveryLocationOrderUseCase } from "../../domain/shipping/application/use-cases/fetch-nearby-delivery-location-order";
import { PrimsaDeliveryManRepository } from "../database/prisma/repositories/prisma-delivery-man-repository";
import { PrismaOrderRepository } from "../database/prisma/repositories/prisma-order-repository";

export function makeFetchNearbyDeliveryLocationOrderUseCase() {
  const deliveryManRepository = new PrimsaDeliveryManRepository();
  const orderRepository = new PrismaOrderRepository();
  const useCase = new FetchNearbyDeliveryLocationOrderUseCase(
    deliveryManRepository,
    orderRepository
  );
  return useCase;
}
