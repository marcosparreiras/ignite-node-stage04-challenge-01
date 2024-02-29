import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { makeGetOrderUseCase } from "../../factories/make-get-order-use-case";
import { orderPresenter } from "../../presenters/order-presenter";
import { NotAllowedError } from "../../../domain/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "../../../domain/core/errors/resource-not-found-error";

export async function getOrderController(
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

    const getOrder = makeGetOrderUseCase();
    const { order } = await getOrder.execute({ adminId: userId, orderId: id });

    return response.status(200).json({ order: orderPresenter(order) });
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
