import { DeliveryManRepository } from "../../src/domain/shipping/application/repositories/delivery-man-repository";
import { DeliveryMan } from "../../src/domain/shipping/enterprise/entities/deliveryMan";

export class InMemoryDeliveryManRepository implements DeliveryManRepository {
  public items: DeliveryMan[] = [];

  async delete(deliveryMan: DeliveryMan): Promise<void> {
    const index = this.items.findIndex((item) =>
      item.id.isEqual(deliveryMan.id)
    );
    this.items.splice(index, 1);
  }

  async findById(id: string): Promise<DeliveryMan | null> {
    const deliveryMan = this.items.find((item) => item.id.toString() === id);
    return deliveryMan ?? null;
  }

  async findByCpf(cpf: string): Promise<DeliveryMan | null> {
    const deliveryMan = this.items.find((item) => item.cpf === cpf);
    return deliveryMan ?? null;
  }

  async create(deliveryMan: DeliveryMan): Promise<void> {
    this.items.push(deliveryMan);
  }
}
