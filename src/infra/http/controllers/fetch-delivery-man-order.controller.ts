import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { makeFetchDeliveryManOrderUseCase } from "../../factories/make-fetch-delivery-man-order-use-case";
import { orderPresenter } from "../../presenters/order-presenter";
import { ResourceNotFoundError } from "../../../domain/core/errors/resource-not-found-error";

export async function fetchDeliveryManOrderController(
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

    const fetchDeliveryManOrder = makeFetchDeliveryManOrderUseCase();
    const { orders } = await fetchDeliveryManOrder.execute({
      deliveryManId: userId,
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
