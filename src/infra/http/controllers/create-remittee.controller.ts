import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { NotAllowedError } from "../../../domain/core/errors/not-allowed-error";
import { RemitteeAlreadyExistsError } from "../../../domain/core/errors/remittee-already-exists-error";
import { makeCreateRemitteeUseCase } from "../../factories/make-create-remittee-use-case";

export async function createRemitteeController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const requestBodySchema = z.object({
    cpf: z.string(),
    name: z.string(),
  });

  const requestAuthSchema = z.string();

  try {
    const { cpf, name } = requestBodySchema.parse(request.body);
    const userId = requestAuthSchema.parse(request.userId);

    const createRemittee = makeCreateRemitteeUseCase();
    await createRemittee.execute({ adminId: userId, cpf, name });

    return response.status(201).json();
  } catch (error: any) {
    switch (error.constructor) {
      case NotAllowedError:
        return response.status(403).json({ message: error.message });
      case RemitteeAlreadyExistsError:
        return response.status(409).json({ message: error.message });
      default:
        return next(error);
    }
  }
}
