import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { makeReadNotificationUseCase } from "../../factories/make-read-notification-use-case";
import { NotAllowedError } from "../../../domain/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "../../../domain/core/errors/resource-not-found-error";

export async function readNotificationController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const requestParamsSchema = z.object({
    id: z.string(),
  });
  const requestBodySchema = z.object({
    recipientId: z.string(),
  });
  try {
    const { id } = requestParamsSchema.parse(request.params);
    const { recipientId } = requestBodySchema.parse(request.body);

    const readNotification = makeReadNotificationUseCase();
    await readNotification.execute({ notificationId: id, recipientId });
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
