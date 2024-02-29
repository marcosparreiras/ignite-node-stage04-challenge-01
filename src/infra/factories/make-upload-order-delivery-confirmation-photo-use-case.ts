import { UploadOrderDeliveryConfirmationPhotoUseCase } from "../../domain/shipping/application/use-cases/upload-order-delivery-confirmation-photo";
import { PrimsaDeliveryManRepository } from "../database/prisma/repositories/prisma-delivery-man-repository";
import { PrismaOrderRepository } from "../database/prisma/repositories/prisma-order-repository";
import { TebiStorage } from "../storage/tebi-storage";

export function makeUploadOrderDeliveryConfirmationPhotoUseCase() {
  const deliveryManRepository = new PrimsaDeliveryManRepository();
  const orderRepository = new PrismaOrderRepository();
  const uploader = new TebiStorage();
  const useCase = new UploadOrderDeliveryConfirmationPhotoUseCase(
    deliveryManRepository,
    orderRepository,
    uploader
  );
  return useCase;
}
