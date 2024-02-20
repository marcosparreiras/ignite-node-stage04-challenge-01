import { DeliveryMan } from "../../enterprise/entities/deliveryMan";

export interface DeliveryManRepository {
  findByCpf(cpf: string): Promise<DeliveryMan | null>;
}
