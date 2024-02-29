import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { ResourceNotFoundError } from "../../../domain/core/errors/resource-not-found-error";
import { makeFetchNearbyDeliveryLocationOrderUseCase } from "../../factories/make-fetch-nearby-delivery-location-order-use-case";
import { orderPresenter } from "../../presenters/order-presenter";

export async function fetchNearbyDeliveryLocationOrderController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const requestQuerySchema = z.object({
    latitude: z.coerce.number(),
    longitude: z.coerce.number(),
    page: z.coerce.number().default(1),
  });
  const requestAuthSchema = z.string();
  try {
    const { latitude, longitude, page } = requestQuerySchema.parse(
      request.query
    );
    const userId = requestAuthSchema.parse(request.userId);

    const fetchNearbyDeliveryLocationOrder =
      makeFetchNearbyDeliveryLocationOrderUseCase();
    const { orders } = await fetchNearbyDeliveryLocationOrder.execute({
      deliveryManId: userId,
      latitude,
      longitude,
      page,
    });
    return response.status(200).json({ orders: orders.map(orderPresenter) });
  } catch (error: any) {
    switch (error.constructor) {
      case ResourceNotFoundError:
        return response.status(404).json({ message: error.message });
      default:
        return next(error);
    }
  }
}
