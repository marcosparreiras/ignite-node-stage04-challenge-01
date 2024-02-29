import { FetchOrderUseCase } from "../../domain/shipping/application/use-cases/fetch-order";
import { PrimsaDeliveryManRepository } from "../database/prisma/repositories/prisma-delivery-man-repository";
import { PrismaOrderRepository } from "../database/prisma/repositories/prisma-order-repository";

export function makeFetchOrderUseCase() {
  const deliveryManRepository = new PrimsaDeliveryManRepository();
  const orderRepository = new PrismaOrderRepository();
  const useCase = new FetchOrderUseCase(deliveryManRepository, orderRepository);
  return useCase;
}
