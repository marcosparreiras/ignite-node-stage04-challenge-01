import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { NotAllowedError } from "../../../domain/core/errors/not-allowed-error";
import { makeFecthDeliveryManUseCase } from "../../factories/make-fetch-delivery-man-use-case";
import { deliveryManPresenter } from "../../presenters/delivery-man-presenter";

export async function fecthDeliveryManController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const requestQuerySchema = z.object({
    page: z.coerce.number().default(1),
  });
  const requestAuthSchema = z.string();

  try {
    const { page } = requestQuerySchema.parse(request.query);
    const userId = requestAuthSchema.parse(request.userId);

    const fetchDeliveryMan = makeFecthDeliveryManUseCase();
    const { deliveryMan } = await fetchDeliveryMan.execute({
      adminId: userId,
      page,
    });

    return response
      .status(200)
      .json({ deliveryMen: deliveryMan.map(deliveryManPresenter) });
  } catch (error: any) {
    switch (error.constructor) {
      case NotAllowedError:
        return response.status(403).json({ message: error.message });
      default:
        return next(error);
    }
  }
}
