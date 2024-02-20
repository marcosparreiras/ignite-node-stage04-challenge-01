import { DeliveryMan } from "../../enterprise/entities/deliveryMan";

export interface DeliveryManRepository {
  findByCpf(cpf: string): Promise<DeliveryMan | null>;
  findById(id: string): Promise<DeliveryMan | null>;
  create(deliveryMan: DeliveryMan): Promise<void>;
  delete(deliveryMan: DeliveryMan): Promise<void>;
}
