import { Remittee } from "../../enterprise/entities/remittee";

export interface RemitteeRepository {
  findByCpf(cpf: string): Promise<Remittee | null>;
  create(remittee: Remittee): Promise<void>;
}
