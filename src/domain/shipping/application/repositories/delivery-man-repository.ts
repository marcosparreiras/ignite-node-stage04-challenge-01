import { DeliveryMan } from "../../enterprise/entities/deliveryMan";

export interface DeliveryManRepository {
  findByCpf(cpf: string): Promise<DeliveryMan | null>;
  findById(id: string): Promise<DeliveryMan | null>;
  findMany(page: number): Promise<DeliveryMan[]>;
  save(deliveryMan: DeliveryMan): Promise<void>;
  create(deliveryMan: DeliveryMan): Promise<void>;
  delete(deliveryMan: DeliveryMan): Promise<void>;
}
