import { Order } from "../../domain/shipping/enterprise/entities/order";

export function orderPresenter(order: Order) {
  return {
    id: order.id.toString(),
    remitteeId: order.remitteId.toString(),
    deliveryManId: order.deliveryManId.toString(),
    deliveryLocation: {
      latitude: order.deliveryLocation.latitude,
      longitude: order.deliveryLocation.longitude,
    },
    deliveryStage: order.deliveryStage.isReturned
      ? "RETURNED"
      : order.deliveryStage.stage,
    deliveryConfirmationPhotoUrl: order.deliveryConfirmationPhotoUrl,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}
