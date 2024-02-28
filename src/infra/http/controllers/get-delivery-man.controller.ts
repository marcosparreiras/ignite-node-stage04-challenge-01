import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { makeGetDeliveryManUseCase } from "../../factories/make-get-delivery-man-use-case";
import { NotAllowedError } from "../../../domain/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "../../../domain/core/errors/resource-not-found-error";
import { deliveryManPresenter } from "../../presenters/delivery-man-presenter";

export async function getDeliveryManController(
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

    const getDeliveryMan = makeGetDeliveryManUseCase();
    const { deliveryMan } = await getDeliveryMan.execute({
      adminId: userId,
      deliveryManId: id,
    });

    return response
      .status(200)
      .json({ deliveryMan: deliveryManPresenter(deliveryMan) });
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
