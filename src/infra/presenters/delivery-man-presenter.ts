import { DeliveryMan } from "../../domain/shipping/enterprise/entities/deliveryMan";

export function deliveryManPresenter(data: DeliveryMan) {
  return {
    id: data.id.toString(),
    name: data.name,
    cpf: data.cpf,
    isAdmin: data.isAdmin,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}
