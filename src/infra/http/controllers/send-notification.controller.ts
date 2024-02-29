import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { makeSendNotificationUseCase } from "../../factories/make-send-notification-use-case";

export async function sendNotificationController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const requestBodySchema = z.object({
    recipientId: z.string(),
    title: z.string(),
    content: z.string(),
  });

  try {
    const { recipientId, title, content } = requestBodySchema.parse(
      request.body
    );
    const sendNotification = makeSendNotificationUseCase();
    await sendNotification.execute({ recipientId, title, content });
    return response.status(201).json();
  } catch (error: any) {
    return next(error);
  }
}
