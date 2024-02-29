import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { NotAllowedError } from "../../../domain/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "../../../domain/core/errors/resource-not-found-error";
import { InvalidOrderDeliveryConfirmationPhotoTypeError } from "../../../domain/core/errors/invalid-order-delivery-confirmation-photo-type-error";
import { makeUploadOrderDeliveryConfirmationPhotoUseCase } from "../../factories/make-upload-order-delivery-confirmation-photo-use-case";

export async function uploadOrderDeliveryConfirmationPhotoController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const requestParamsSchema = z.object({
    id: z.string(),
  });
  const requestFileSchema = z.object({
    originalname: z.string(),
    mimetype: z.string(),
    buffer: z.instanceof(Buffer),
  });
  const requestAuthSchema = z.string();
  try {
    const { id } = requestParamsSchema.parse(request.params);
    const { originalname, mimetype, buffer } = requestFileSchema.parse(
      request.file
    );
    const userId = requestAuthSchema.parse(request.userId);

    const uploadOrderDeliveryConfirmationPhoto =
      makeUploadOrderDeliveryConfirmationPhotoUseCase();
    await uploadOrderDeliveryConfirmationPhoto.execute({
      orderId: id,
      deliveryManId: userId,
      fileName: originalname,
      fileType: mimetype,
      body: buffer,
    });

    return response.status(204).json();
  } catch (error: any) {
    switch (error.constructor) {
      case NotAllowedError:
        return response.status(403).json({ message: error.message });
      case ResourceNotFoundError:
        return response.status(404).json({ message: error.message });
      case InvalidOrderDeliveryConfirmationPhotoTypeError:
        return response.status(400).json({ message: error.message });
      default:
        return next(error);
    }
  }
}
