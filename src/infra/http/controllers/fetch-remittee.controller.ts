import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { makeFetchRemitteeUseCase } from "../../factories/make-fetch-remittee-use-case";
import { remitteePresenter } from "../../presenters/remittee-presenter";
import { NotAllowedError } from "../../../domain/core/errors/not-allowed-error";

export async function fetchRemitteeController(
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

    const fetchRemittee = makeFetchRemitteeUseCase();
    const { remittees } = await fetchRemittee.execute({
      adminId: userId,
      page,
    });

    return response
      .status(200)
      .json({ remittees: remittees.map(remitteePresenter) });
  } catch (error: any) {
    switch (error.constructor) {
      case NotAllowedError:
        return response.status(403).json({ message: error.message });
      default:
        return next(error);
    }
  }
}
