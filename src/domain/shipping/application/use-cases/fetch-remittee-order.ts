import { Order } from "../../enterprise/entities/order";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { OrderRepository } from "../repositories/order-repository";
import { RemitteeRepository } from "../repositories/remittee-repository";

interface FetchRemitteeOrderUseCaseRequest {
  remitteeCpf: string;
  page: number;
}

interface FetchRemitteeOrderUseCaseResponse {
  orders: Order[];
}

export class FetchRemitteeOrderUseCase {
  constructor(
    private remitteeRepository: RemitteeRepository,
    private orderRepository: OrderRepository
  ) {}

  async execute({
    remitteeCpf,
    page,
  }: FetchRemitteeOrderUseCaseRequest): Promise<FetchRemitteeOrderUseCaseResponse> {
    const remittee = await this.remitteeRepository.findByCpf(remitteeCpf);
    if (!remittee) {
      throw new ResourceNotFoundError();
    }

    const orders = await this.orderRepository.findManyByRemitteeId(
      remittee.id.toString(),
      page
    );
    return { orders };
  }
}
