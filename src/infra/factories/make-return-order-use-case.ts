import { ReturnOrderUseCase } from "../../domain/shipping/application/use-cases/return-order";
import { PrimsaDeliveryManRepository } from "../database/prisma/repositories/prisma-delivery-man-repository";
import { PrismaOrderRepository } from "../database/prisma/repositories/prisma-order-repository";

export function makeReturnOrderUseCase() {
  const deliveryManRepository = new PrimsaDeliveryManRepository();
  const orderRepositroy = new PrismaOrderRepository();
  const useCase = new ReturnOrderUseCase(
    deliveryManRepository,
    orderRepositroy
  );
  return useCase;
}
