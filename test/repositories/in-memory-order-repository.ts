import { OrderRepository } from "../../src/domain/shipping/application/repositories/order-repository";
import { Order } from "../../src/domain/shipping/enterprise/entities/order";

export class InMemoryOrderRepository implements OrderRepository {
  public items: Order[] = [];

  async findById(id: string): Promise<Order | null> {
    const order = this.items.find((item) => item.id.toString() === id);
    return order ?? null;
  }

  async create(order: Order): Promise<void> {
    this.items.push(order);
  }

  async delete(order: Order): Promise<void> {
    const index = this.items.findIndex((item) => item.id.isEqual(order.id));
    this.items.splice(index, 1);
  }
}
