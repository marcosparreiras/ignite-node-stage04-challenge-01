import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { makeFetchRemitteeOrderUseCase } from "../../factories/make-fetch-remittee-order-use-case";
import { orderPresenter } from "../../presenters/order-presenter";
import { ResourceNotFoundError } from "../../../domain/core/errors/resource-not-found-error";

export async function fetchRemitteeOrder(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const requestParamsSchema = z.object({
    cpf: z.string(),
  });
  const requestQuerySchema = z.object({
    page: z.coerce.number().default(1),
  });

  try {
    const { cpf } = requestParamsSchema.parse(request.params);
    const { page } = requestQuerySchema.parse(request.query);

    const fetchRemitteeOrder = makeFetchRemitteeOrderUseCase();
    const { orders } = await fetchRemitteeOrder.execute({
      remitteeCpf: cpf,
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
