import { DeliveryManRepository } from "../../src/domain/shipping/application/repositories/delivery-man-repository";
import { DeliveryMan } from "../../src/domain/shipping/enterprise/entities/deliveryMan";

export class InMemoryDeliveryManRepository implements DeliveryManRepository {
  public items: DeliveryMan[] = [];

  async findByCpf(cpf: string): Promise<DeliveryMan | null> {
    const deliveryMan = this.items.find((item) => item.cpf === cpf);
    return deliveryMan ?? null;
  }
}
