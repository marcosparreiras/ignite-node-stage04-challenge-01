import { OrderRepository } from "../../src/domain/shipping/application/repositories/order-repository";
import { Order } from "../../src/domain/shipping/enterprise/entities/order";

export class InMemoryOrderRepository implements OrderRepository {
  public items: Order[] = [];

  async findById(id: string): Promise<Order | null> {
    const order = this.items.find((item) => item.id.toString() === id);
    return order ?? null;
  }

  async findMany(page: number): Promise<Order[]> {
    const orders = this.items.slice((page - 1) * 20, page * 20);
    return orders;
  }

  async findManyByDeliveryManId(
    deliveryManId: string,
    page: number
  ): Promise<Order[]> {
    const orders = this.items
      .filter((item) => item.deliveryManId.toString() === deliveryManId)
      .splice((page - 1) * 20, page * 20);
    return orders;
  }

  async create(order: Order): Promise<void> {
    this.items.push(order);
  }

  async save(order: Order): Promise<void> {
    const index = this.items.findIndex((item) => item.id.isEqual(order.id));
    this.items[index] = order;
  }

  async delete(order: Order): Promise<void> {
    const index = this.items.findIndex((item) => item.id.isEqual(order.id));
    this.items.splice(index, 1);
  }
}
