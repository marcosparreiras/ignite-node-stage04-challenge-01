import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { NotAllowedError } from "../../../domain/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "../../../domain/core/errors/resource-not-found-error";
import { makeReturnOrderUseCase } from "../../factories/make-return-order-use-case";

export async function returnOrderController(
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

    const returnOrder = makeReturnOrderUseCase();
    await returnOrder.execute({ deliveryManId: userId, orderId: id });
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
