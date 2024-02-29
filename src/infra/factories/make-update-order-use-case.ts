import { UpdateOrderUseCase } from "../../domain/shipping/application/use-cases/update-order";
import { PrimsaDeliveryManRepository } from "../database/prisma/repositories/prisma-delivery-man-repository";
import { PrismaOrderRepository } from "../database/prisma/repositories/prisma-order-repository";
import { PrismaRemitteeRepository } from "../database/prisma/repositories/prisma-remittee-repository";

export function makeUpdateOrderUseCase() {
  const deliveryManRepository = new PrimsaDeliveryManRepository();
  const remitteeRepository = new PrismaRemitteeRepository();
  const orderRepository = new PrismaOrderRepository();
  const useCase = new UpdateOrderUseCase(
    deliveryManRepository,
    remitteeRepository,
    orderRepository
  );
  return useCase;
}
