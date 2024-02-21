import { RemitteeRepository } from "../../src/domain/shipping/application/repositories/remittee-repository";
import { Remittee } from "../../src/domain/shipping/enterprise/entities/remittee";

export class InMemoryRemitteeRepository implements RemitteeRepository {
  public items: Remittee[] = [];

  async findByCpf(cpf: string): Promise<Remittee | null> {
    const remittee = this.items.find((item) => item.cpf === cpf);
    return remittee ?? null;
  }

  async create(remittee: Remittee): Promise<void> {
    this.items.push(remittee);
  }
}
