import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { makeCreateOrderUseCase } from "../../factories/make-create-order-use-case";
import { NotAllowedError } from "../../../domain/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "../../../domain/core/errors/resource-not-found-error";
import { InvalidGeoCoordinatesError } from "../../../domain/core/errors/invalid-geo-coordinates-error";

export async function createOrderController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const requestBodySchema = z.object({
    remitteeId: z.string(),
    deliveryManId: z.string(),
    latitude: z.number(),
    longitude: z.number(),
  });

  const requestAuthSchema = z.string();

  try {
    const { remitteeId, deliveryManId, latitude, longitude } =
      requestBodySchema.parse(request.body);
    const userId = requestAuthSchema.parse(request.userId);
    const createOrder = makeCreateOrderUseCase();
    await createOrder.execute({
      adminId: userId,
      deliveryManId,
      remitteeId,
      latitude,
      longitude,
    });
    return response.status(201).json();
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
