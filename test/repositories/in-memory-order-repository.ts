import { DomainEvents } from "../../src/domain/core/events/domain-events";
import { OrderRepository } from "../../src/domain/shipping/application/repositories/order-repository";
import { Order } from "../../src/domain/shipping/enterprise/entities/order";
import { Location } from "../../src/domain/shipping/enterprise/object-values/location";

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

  async findManyNearbyDeliveryMan(
    deliveryManId: string,
    latitude: number,
    longitude: number,
    page: number
  ): Promise<Order[]> {
    const deliveryManLocation = new Location(latitude, longitude);

    const orders = this.items.filter(
      (item) => item.deliveryManId.toString() === deliveryManId
    );

    const nearbyOrders = orders.filter((item) => {
      const distance =
        item.deliveryLocation.getDistanceInKm(deliveryManLocation);
      return distance <= 5; // 5 km
    });

    return nearbyOrders
      .sort((a, b) => {
        return (
          a.deliveryLocation.getDistanceInKm(deliveryManLocation) -
          b.deliveryLocation.getDistanceInKm(deliveryManLocation)
        );
      })
      .slice((page - 1) * 20, page * 20);
  }

  async findManyByRemitteeId(
    remitteeId: string,
    page: number
  ): Promise<Order[]> {
    const orders = this.items
      .filter((item) => item.remitteId.toString() === remitteeId)
      .slice((page - 1) * 20, page * 20);
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
    const index = this.items.findIndex((item) => item.id.equals(order.id));
    this.items[index] = order;
    DomainEvents.dispatchEventsForAggregate(order.id);
  }

  async delete(order: Order): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(order.id));
    this.items.splice(index, 1);
  }
}
