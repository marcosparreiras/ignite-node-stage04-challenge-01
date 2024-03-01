import { DomainEvents } from "../../../../domain/core/events/domain-events";
import { OrderRepository } from "../../../../domain/shipping/application/repositories/order-repository";
import { Order } from "../../../../domain/shipping/enterprise/entities/order";
import { CacheRepository } from "../../../cache/cache-repository";
import { PrismaOrderMapper } from "../mappers/prisma-order-mapper";
import { prisma } from "../prisma";
import { Order as PrismaOrder } from "@prisma/client";

export class PrismaOrderRepository implements OrderRepository {
  constructor(private cacheRepository: CacheRepository) {}

  async findById(id: string): Promise<Order | null> {
    const cacheHit = await this.cacheRepository.get(`order:${id}`);
    if (cacheHit) {
      return JSON.parse(cacheHit);
    }

    const data = await prisma.order.findUnique({ where: { id } });
    if (!data) {
      return null;
    }

    const order = PrismaOrderMapper.toDomain(data);
    await this.cacheRepository.set(`order:${id}`, JSON.stringify(order));

    return order;
  }

  async findMany(page: number): Promise<Order[]> {
    const data = await prisma.order.findMany({
      take: 20,
      skip: (page - 1) * 20,
    });

    const orders = data.map(PrismaOrderMapper.toDomain);
    return orders;
  }

  async findManyNearbyDeliveryMan(
    deliveryManId: string,
    latitude: number,
    longitude: number,
    page: number
  ): Promise<Order[]> {
    const orders = await prisma.$queryRaw<PrismaOrder[]>`
      SELECT * From orders
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 5 AND delivery_man_id = ${deliveryManId}
      LIMIT 20
      OFFSET ${(page - 1) * 20}
    `; // 5 km
    return orders.map(PrismaOrderMapper.toDomain);
  }

  async findManyByRemitteeId(
    remitteeId: string,
    page: number
  ): Promise<Order[]> {
    const orders = await prisma.order.findMany({
      where: { remitteeId },
      take: 20,
      skip: (page - 1) * 20,
    });
    return orders.map(PrismaOrderMapper.toDomain);
  }

  async findManyByDeliveryManId(
    deliveryManId: string,
    page: number
  ): Promise<Order[]> {
    const orders = await prisma.order.findMany({
      where: { deliveryManId },
      take: 20,
      skip: (page - 1) * 20,
    });
    return orders.map(PrismaOrderMapper.toDomain);
  }

  async create(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order);
    await prisma.order.create({ data });
  }

  async save(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order);
    await prisma.order.update({
      where: { id: data.id },
      data,
    });
    await this.cacheRepository.delete(`order:${data.id}`);
    DomainEvents.dispatchEventsForAggregate(order.id);
  }

  async delete(order: Order): Promise<void> {
    const orderId = order.id.toString();
    await prisma.order.delete({ where: { id: orderId } });
    await this.cacheRepository.delete(`order:${orderId}`);
  }
}
