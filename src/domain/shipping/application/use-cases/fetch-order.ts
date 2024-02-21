import { Order } from "../../enterprise/entities/order";
import { NotAllowedError } from "../errors/not-allowed-error";
import { DeliveryManRepository } from "../repositories/delivery-man-repository";
import { OrderRepository } from "../repositories/order-repository";

interface FetchOrderUseCaseRequest {
  adminId: string;
  page: number;
}

interface FetchOrderUseCaseResponse {
  orders: Order[];
}

export class FetchOrderUseCase {
  constructor(
    private deliveryManRepository: DeliveryManRepository,
    private orderRepository: OrderRepository
  ) {}

  async execute({
    adminId,
    page,
  }: FetchOrderUseCaseRequest): Promise<FetchOrderUseCaseResponse> {
    const admin = await this.deliveryManRepository.findById(adminId);
    if (!admin || !admin.isAdmin) {
      throw new NotAllowedError();
    }
    const orders = await this.orderRepository.findMany(page);
    return { orders };
  }
}
