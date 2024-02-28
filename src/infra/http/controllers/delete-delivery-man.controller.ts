import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { makeDeleteDeliveryManUseCase } from "../../factories/make-delete-delivery-man-use-case";
import { NotAllowedError } from "../../../domain/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "../../../domain/core/errors/resource-not-found-error";

export async function deleteDeliveryManController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const requestParamsSchema = z.object({
    id: z.string(),
  });

  const requestAuthSchema = z.string();

  try {
    const { id } = requestParamsSchema.parse(request.params);
    const userId = requestAuthSchema.parse(request.userId);

    const deleteDeliveryMan = makeDeleteDeliveryManUseCase();
    await deleteDeliveryMan.execute({ adminId: userId, deliveryManId: id });
    return response.status(204).json();
  } catch (error: any) {
    switch (error.constructor) {
      case NotAllowedError:
        return response.status(403).json({ message: error.message });
      case ResourceNotFoundError:
        return response.status(404).json({ message: error.message });
      default:
        return next(error);
    }
  }
}
