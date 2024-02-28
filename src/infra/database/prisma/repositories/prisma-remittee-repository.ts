import { RemitteeRepository } from "../../../../domain/shipping/application/repositories/remittee-repository";
import { Remittee } from "../../../../domain/shipping/enterprise/entities/remittee";
import { PrismaRemitteeMapper } from "../mappers/prisma-remitte-mapper";
import { prisma } from "../prisma";

export class PrismaRemitteeRepository implements RemitteeRepository {
  async findByCpf(cpf: string): Promise<Remittee | null> {
    const remittee = await prisma.remittee.findUnique({ where: { cpf } });
    if (!remittee) {
      return null;
    }
    return PrismaRemitteeMapper.toDomain(remittee);
  }

  async findById(id: string): Promise<Remittee | null> {
    const remittee = await prisma.remittee.findUnique({ where: { id } });
    if (!remittee) {
      return null;
    }
    return PrismaRemitteeMapper.toDomain(remittee);
  }

  async findMany(page: number): Promise<Remittee[]> {
    const remittees = await prisma.remittee.findMany({
      take: 20,
      skip: (page - 1) * 20,
    });
    return remittees.map(PrismaRemitteeMapper.toDomain);
  }

  async create(remittee: Remittee): Promise<void> {
    const data = PrismaRemitteeMapper.toPrisma(remittee);
    await prisma.remittee.create({ data });
  }

  async save(remittee: Remittee): Promise<void> {
    const data = PrismaRemitteeMapper.toPrisma(remittee);
    await prisma.remittee.update({ where: { id: data.id }, data });
  }

  async delete(remittee: Remittee): Promise<void> {
    await prisma.remittee.delete({ where: { id: remittee.id.toString() } });
  }
}
