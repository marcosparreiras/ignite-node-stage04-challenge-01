import { Remittee } from "../../enterprise/entities/remittee";

export interface RemitteeRepository {
  findByCpf(cpf: string): Promise<Remittee | null>;
  findById(id: string): Promise<Remittee | null>;
  findMany(page: number): Promise<Remittee[]>;
  create(remittee: Remittee): Promise<void>;
  delete(remittee: Remittee): Promise<void>;
}
