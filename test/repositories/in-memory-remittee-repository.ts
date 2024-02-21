import { RemitteeRepository } from "../../src/domain/shipping/application/repositories/remittee-repository";
import { Remittee } from "../../src/domain/shipping/enterprise/entities/remittee";

export class InMemoryRemitteeRepository implements RemitteeRepository {
  public items: Remittee[] = [];

  async findById(id: string): Promise<Remittee | null> {
    const remittee = this.items.find((item) => item.id.toString() === id);
    return remittee ?? null;
  }
  async findByCpf(cpf: string): Promise<Remittee | null> {
    const remittee = this.items.find((item) => item.cpf === cpf);
    return remittee ?? null;
  }

  async findMany(page: number): Promise<Remittee[]> {
    const remittees = this.items.slice((page - 1) * 20, page * 20);
    return remittees;
  }

  async create(remittee: Remittee): Promise<void> {
    this.items.push(remittee);
  }

  async save(remitte: Remittee): Promise<void> {
    const index = this.items.findIndex((item) => item.id.isEqual(remitte.id));
    this.items[index] = remitte;
  }

  async delete(remittee: Remittee): Promise<void> {
    const index = this.items.findIndex((item) => item.id.isEqual(remittee.id));
    this.items.splice(index, 1);
  }
}
