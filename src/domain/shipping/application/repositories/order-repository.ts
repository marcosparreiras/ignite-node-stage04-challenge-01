import { Order } from "../../enterprise/entities/order";

export interface OrderRepository {
  findById(id: string): Promise<Order | null>;
  findMany(page: number): Promise<Order[]>;
  findManyByDeliveryManId(
    deliveryManId: string,
    page: number
  ): Promise<Order[]>;
  create(order: Order): Promise<void>;
  save(order: Order): Promise<void>;
  delete(order: Order): Promise<void>;
}
