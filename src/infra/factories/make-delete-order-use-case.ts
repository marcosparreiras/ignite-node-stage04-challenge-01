import { DeleteOrderUseCase } from "../../domain/shipping/application/use-cases/delete-order";
import { PrimsaDeliveryManRepository } from "../database/prisma/repositories/prisma-delivery-man-repository";
import { PrismaOrderRepository } from "../database/prisma/repositories/prisma-order-repository";

export function makeDeleteOrderUseCase() {
  const deliveryManRepository = new PrimsaDeliveryManRepository();
  const orderRepository = new PrismaOrderRepository();
  const useCase = new DeleteOrderUseCase(
    deliveryManRepository,
    orderRepository
  );
  return useCase;
}
