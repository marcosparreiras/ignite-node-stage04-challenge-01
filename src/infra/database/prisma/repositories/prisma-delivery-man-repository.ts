import { DeliveryManRepository } from "../../../../domain/shipping/application/repositories/delivery-man-repository";
import { DeliveryMan } from "../../../../domain/shipping/enterprise/entities/deliveryMan";
import { PrismaDeliveryManMapper } from "../mappers/prisma-delivery-man-mapper";
import { prisma } from "../prisma";

export class PrimsaDeliveryManRepository implements DeliveryManRepository {
  async findByCpf(cpf: string): Promise<DeliveryMan | null> {
    const deliveryMan = await prisma.deliveryMan.findUnique({ where: { cpf } });
    if (!deliveryMan) {
      return null;
    }
    return PrismaDeliveryManMapper.toDomain(deliveryMan);
  }

  async findById(id: string): Promise<DeliveryMan | null> {
    const deliveryMan = await prisma.deliveryMan.findUnique({ where: { id } });
    if (!deliveryMan) {
      return null;
    }
    return PrismaDeliveryManMapper.toDomain(deliveryMan);
  }

  async findMany(page: number): Promise<DeliveryMan[]> {
    const deliveryMen = await prisma.deliveryMan.findMany({
      take: 20,
      skip: (page - 1) * 20,
    });
    return deliveryMen.map(PrismaDeliveryManMapper.toDomain);
  }

  async save(deliveryMan: DeliveryMan): Promise<void> {
    const data = PrismaDeliveryManMapper.toPrisma(deliveryMan);
    await prisma.deliveryMan.update({
      where: { id: deliveryMan.id.toString() },
      data,
    });
  }

  async create(deliveryMan: DeliveryMan): Promise<void> {
    const data = PrismaDeliveryManMapper.toPrisma(deliveryMan);
    await prisma.deliveryMan.create({ data });
  }

  async delete(deliveryMan: DeliveryMan): Promise<void> {
    await prisma.deliveryMan.delete({
      where: { id: deliveryMan.id.toString() },
    });
  }
}
