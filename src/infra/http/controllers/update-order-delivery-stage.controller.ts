import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { NotAllowedError } from "../../../domain/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "../../../domain/core/errors/resource-not-found-error";
import { InvalidDeliveryStageError } from "../../../domain/core/errors/invalid-delivery-stage-error";
import { MissingDeliveryPhotoUrlError } from "../../../domain/core/errors/missing-delivery-photo-error";
import { makeUpdateOrderDeliveryStageUseCase } from "../../factories/make-update-order-delivery-stage-use-case";

export async function updateOrderDeliveryStageController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const requestParamsSchema = z.object({
    id: z.string(),
  });
  const requestBodySchema = z.object({
    deliveryStage: z.string(),
  });
  const requestAuthSchema = z.string();

  try {
    const { id } = requestParamsSchema.parse(request.params);
    const { deliveryStage } = requestBodySchema.parse(request.body);
    const userId = requestAuthSchema.parse(request.userId);

    const updateOrderDeliveryStage = makeUpdateOrderDeliveryStageUseCase();
    await updateOrderDeliveryStage.execute({
      deliveryManId: userId,
      orderId: id,
      deliveryStage,
    });
    return response.status(204).json();
  } catch (error: any) {
    switch (error.constructor) {
      case NotAllowedError:
        return response.status(403).json({ message: error.message });
      case ResourceNotFoundError:
        return response.status(404).json({ message: error.message });
      case InvalidDeliveryStageError:
        return response.status(400).json({ message: error.message });
      case MissingDeliveryPhotoUrlError:
        return response.status(400).json({ message: error.message });
      default:
        return next(error);
    }
  }
}
