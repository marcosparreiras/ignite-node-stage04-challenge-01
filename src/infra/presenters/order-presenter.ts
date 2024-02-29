import { Order } from "../../domain/shipping/enterprise/entities/order";

export function orderPresenter(data: Order) {
  return {
    id: data.id.toString(),
    remitteeId: data.remitteId.toString(),
    deliveryManId: data.deliveryManId.toString(),
    deliveryLocation: {
      latitude: data.deliveryLocation.latitude,
      longitude: data.deliveryLocation.longitude,
    },
    deliveryStage: data.deliveryStage.isReturned
      ? "RETURNED"
      : data.deliveryStage.stage,
    deliveryConfirmationPhotoUrl: data.deliveryConfirmationPhotoUrl,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}
