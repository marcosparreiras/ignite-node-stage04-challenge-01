import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { makeCreateDeliveryManUseCase } from "../../factories/make-create-delivery-man-use-case";
import { NotAllowedError } from "../../../domain/core/errors/not-allowed-error";
import { DeliveryManAlreadyExistsError } from "../../../domain/core/errors/delivery-man-already-exists-error";

export async function createDeliveryManController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const requestBodySchema = z.object({
    adminId: z.string(),
    cpf: z.string(),
    name: z.string(),
    password: z.string(),
  });

  try {
    const body = requestBodySchema.parse(request.body);
    const createDeliveryMan = makeCreateDeliveryManUseCase();
    await createDeliveryMan.execute(body);
    return response.status(201).json();
  } catch (error: any) {
    switch (error.constructor) {
      case NotAllowedError:
        return response.status(403).json({ message: error.message });
      case DeliveryManAlreadyExistsError:
        return response.status(409).json({ message: error.message });
      default:
        return next(error);
    }
  }
}
