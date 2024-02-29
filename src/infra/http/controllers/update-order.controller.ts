import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { NotAllowedError } from "../../../domain/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "../../../domain/core/errors/resource-not-found-error";
import { InvalidGeoCoordinatesError } from "../../../domain/core/errors/invalid-geo-coordinates-error";
import { makeUpdateOrderUseCase } from "../../factories/make-update-order-use-case";

export async function updateOrderController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const requestParamsSchema = z.object({
    id: z.string(),
  });
  const requesBodySchema = z.object({
    remitteeId: z.string(),
    deliveryManId: z.string(),
    latitude: z.number(),
    longitude: z.number(),
  });
  const requestAuthSchema = z.string();
  try {
    const { id } = requestParamsSchema.parse(request.params);
    const { remitteeId, deliveryManId, latitude, longitude } =
      requesBodySchema.parse(request.body);
    const userId = requestAuthSchema.parse(request.userId);

    const updateOrder = makeUpdateOrderUseCase();
    await updateOrder.execute({
      adminId: userId,
      orderId: id,
      remitteeId,
      deliveryManId,
      latitude,
      longitude,
    });
    return response.status(204).json();
  } catch (error: any) {
    switch (error.constructor) {
      case NotAllowedError:
        return response.status(403).json({ message: error.message });
      case ResourceNotFoundError:
        return response.status(404).json({ message: error.message });
      case InvalidGeoCoordinatesError:
        return response.status(400).json({ message: error.message });
      default:
        return next(error);
    }
  }
}
