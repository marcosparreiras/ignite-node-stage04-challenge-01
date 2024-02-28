import { DomainEvents } from "../../../../domain/core/events/domain-events";
import { OrderRepository } from "../../../../domain/shipping/application/repositories/order-repository";
import { Order } from "../../../../domain/shipping/enterprise/entities/order";
import { PrismaOrderMapper } from "../mappers/prisma-order-mapper";
import { prisma } from "../prisma";
import { Order as PrismaOrder } from "@prisma/client";

export class PrismaOrderRepository implements OrderRepository {
  async findById(id: string): Promise<Order | null> {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return null;
    }
    return PrismaOrderMapper.toDomain(order);
  }

  async findMany(page: number): Promise<Order[]> {
    const orders = await prisma.order.findMany({
      take: 20,
      skip: (page - 1) * 20,
    });
    return orders.map(PrismaOrderMapper.toDomain);
  }

  async findManyNearbyDeliveryMan(
    deliveryManId: string,
    latitude: number,
    longitude: number,
    page: number
  ): Promise<Order[]> {
    const orders = await prisma.$queryRaw<PrismaOrder[]>`
      SELECT * From orders
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10 AND delivery_man_id = ${deliveryManId}
      LIMIT 20
      OFFSET ${(page - 1) * 20}
    `;
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
    DomainEvents.dispatchEventsForAggregate(order.id);
  }

  async delete(order: Order): Promise<void> {
    await prisma.order.delete({ where: { id: order.id.toString() } });
  }
}
