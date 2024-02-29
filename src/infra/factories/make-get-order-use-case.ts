import { GetOrderUseCase } from "../../domain/shipping/application/use-cases/get-order";
import { PrimsaDeliveryManRepository } from "../database/prisma/repositories/prisma-delivery-man-repository";
import { PrismaOrderRepository } from "../database/prisma/repositories/prisma-order-repository";

export function makeGetOrderUseCase() {
  const deliveryManRepository = new PrimsaDeliveryManRepository();
  const orderRepository = new PrismaOrderRepository();
  const useCase = new GetOrderUseCase(deliveryManRepository, orderRepository);
  return useCase;
}
