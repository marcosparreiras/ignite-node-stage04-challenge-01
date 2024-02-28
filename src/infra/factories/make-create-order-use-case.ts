import { CreateOrderUseCase } from "../../domain/shipping/application/use-cases/create-order";
import { PrimsaDeliveryManRepository } from "../database/prisma/repositories/prisma-delivery-man-repository";
import { PrismaOrderRepository } from "../database/prisma/repositories/prisma-order-repository";
import { PrismaRemitteeRepository } from "../database/prisma/repositories/prisma-remittee-repository";

export function makeCreateOrderUseCase() {
  const deliveryManRespository = new PrimsaDeliveryManRepository();
  const remitteeRepository = new PrismaRemitteeRepository();
  const orderRepository = new PrismaOrderRepository();
  const useCase = new CreateOrderUseCase(
    deliveryManRespository,
    remitteeRepository,
    orderRepository
  );
  return useCase;
}
