import { InvalidOrderDeliveryConfirmationPhotoTypeError } from "../../../core/errors/invalid-order-delivery-confirmation-photo-type-error";
import { NotAllowedError } from "../../../core/errors/not-allowed-error";
import { ResourceNotFoundError } from "../../../core/errors/resource-not-found-error";
import { DeliveryManRepository } from "../repositories/delivery-man-repository";
import { OrderRepository } from "../repositories/order-repository";
import { Uploader } from "../storage/uploader";

interface UploadOrderDeliveryConfirmationPhotoUseCaseRequest {
  deliveryManId: string;
  orderId: string;
  fileName: string;
  fileType: string;
  body: Buffer;
}

interface UploadOrderDeliveryConfirmationPhotoUseCaseResponse {
  url: string;
}

export class UploadOrderDeliveryConfirmationPhotoUseCase {
  constructor(
    private deliveryManRepository: DeliveryManRepository,
    private orderRepository: OrderRepository,
    private uploader: Uploader
  ) {}

  async execute({
    deliveryManId,
    orderId,
    fileName,
    fileType,
    body,
  }: UploadOrderDeliveryConfirmationPhotoUseCaseRequest): Promise<UploadOrderDeliveryConfirmationPhotoUseCaseResponse> {
    const order = await this.orderRepository.findById(orderId);
    const deliveryMan = await this.deliveryManRepository.findById(
      deliveryManId
    );

    if (!order || !deliveryMan) {
      throw new ResourceNotFoundError();
    }

    if (!deliveryMan.isAdmin && !deliveryMan.id.equals(order.deliveryManId)) {
      throw new NotAllowedError();
    }

    if (!/^(image\/(jpeg|png|jpg))$|^(application\/pdf)$/.test(fileType)) {
      throw new InvalidOrderDeliveryConfirmationPhotoTypeError();
    }

    const url = await this.uploader.upload(fileName, fileType, body);
    order.deliveryConfirmationPhotoUrl = url;
    await this.orderRepository.save(order);

    return { url };
  }
}
