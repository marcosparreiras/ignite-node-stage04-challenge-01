import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { NotAllowedError } from "../../../domain/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "../../../domain/core/errors/resource-not-found-error";
import { makeUpdateDeliveryManUseCase } from "../../factories/make-update-delivery-man-use-case";

export async function updateDeliveryManController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const requestParamsSchema = z.object({
    id: z.string(),
  });

  const requestBodySchema = z.object({
    name: z.string(),
    isAdmin: z.boolean(),
    password: z.coerce.string().optional(),
  });

  const requestAuthSchema = z.string();

  try {
    const { id } = requestParamsSchema.parse(request.params);
    const { name, isAdmin, password } = requestBodySchema.parse(request.body);
    const userId = requestAuthSchema.parse(request.userId);

    const updateDeliveryMan = makeUpdateDeliveryManUseCase();
    await updateDeliveryMan.execute({
      adminId: userId,
      deliveryManId: id,
      isAdmin,
      name,
      password,
    });

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
