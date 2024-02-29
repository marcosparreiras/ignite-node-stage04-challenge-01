import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { makeUpdateRemitteUseCase } from "../../factories/make-update-remittee-use-case";
import { NotAllowedError } from "../../../domain/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "../../../domain/core/errors/resource-not-found-error";

export async function updateRemitteeController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const requestBodySchema = z.object({
    name: z.string(),
  });
  const requestParamsSchema = z.object({
    id: z.string(),
  });
  const requestAuthSchema = z.string();
  try {
    const { name } = requestBodySchema.parse(request.body);
    const { id } = requestParamsSchema.parse(request.params);
    const userId = requestAuthSchema.parse(request.userId);

    const updateRemittee = makeUpdateRemitteUseCase();
    await updateRemittee.execute({ adminId: userId, remitteeId: id, name });
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
