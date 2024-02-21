import { OrderRepository } from "../../src/domain/shipping/application/repositories/order-repository";
import { Order } from "../../src/domain/shipping/enterprise/entities/order";

export class InMemoryOrderRepository implements OrderRepository {
  public items: Order[] = [];

  async create(order: Order): Promise<void> {
    this.items.push(order);
  }
}
