import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { NotAllowedError } from "../../../domain/core/errors/not-allowed-error";
import { makeFetchOrderUseCase } from "../../factories/make-fetch-order-use-case";
import { orderPresenter } from "../../presenters/order-presenter";

export async function fetchOrderController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const requestAuthSchema = z.string();
  const requestQueryScheme = z.object({
    page: z.coerce.number().default(1),
  });

  try {
    const { page } = requestQueryScheme.parse(request.query);
    const userId = requestAuthSchema.parse(request.userId);

    const fetchOrder = makeFetchOrderUseCase();
    const { orders } = await fetchOrder.execute({ adminId: userId, page });

    return response.status(200).json({ orders: orders.map(orderPresenter) });
  } catch (error: any) {
    switch (error.constructor) {
      case NotAllowedError:
        return response.status(403).json({ message: error.message });
      default:
        return next(error);
    }
  }
}
