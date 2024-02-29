import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { makeGetRemitteeUseCase } from "../../factories/make-get-remittee-use-case";
import { NotAllowedError } from "../../../domain/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "../../../domain/core/errors/resource-not-found-error";
import { remitteePresenter } from "../../presenters/remittee-presenter";

export async function getRemitteeController(
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

    const getRemittee = makeGetRemitteeUseCase();
    const { remittee } = await getRemittee.execute({
      adminId: userId,
      remitteeId: id,
    });
    return response.status(200).send({ remittee: remitteePresenter(remittee) });
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
