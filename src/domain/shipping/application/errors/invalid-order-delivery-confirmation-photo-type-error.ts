export class InvalidOrderDeliveryConfirmationPhotoTypeError extends Error {
  constructor() {
    super("Order delivery confirmation photo should be jpeg, png, jpg or pdf");
  }
}
