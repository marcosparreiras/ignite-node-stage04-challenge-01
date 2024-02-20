import { DeliveryManRepository } from "../../src/domain/shipping/application/repositories/delivery-man-repository";
import { DeliveryMan } from "../../src/domain/shipping/enterprise/entities/deliveryMan";

export class InMemoryDeliveryManRepository implements DeliveryManRepository {
  public items: DeliveryMan[] = [];

  async create(deliveryMan: DeliveryMan): Promise<void> {
    this.items.push(deliveryMan);
  }

  async findByCpf(cpf: string): Promise<DeliveryMan | null> {
    const deliveryMan = this.items.find((item) => item.cpf === cpf);
    return deliveryMan ?? null;
  }
}
