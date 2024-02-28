import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { InvalidCredentialsError } from "../../../domain/core/errors/invalid-credentials-error";
import { makeAuthenticateDeliveryManUseCase } from "../../factories/make-authenticate-delivery-man-use-case";
import { Encrypter } from "../../cryptography/encrypter";

export async function authenticateDeliveryManController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const requestBodySchema = z.object({
    cpf: z.coerce.string(),
    password: z.string(),
  });

  try {
    const { cpf, password } = requestBodySchema.parse(request.body);
    const authenticateDeliveryMan = makeAuthenticateDeliveryManUseCase();
    const { deliveryMan } = await authenticateDeliveryMan.execute({
      cpf,
      password,
    });
    const token = await Encrypter.encrypt({
      userId: deliveryMan.id.toString(),
    });
    return response.status(201).json({ token });
  } catch (error: any) {
    switch (error.constructor) {
      case InvalidCredentialsError:
        return response.status(401).json({ message: error.message });
      default:
        return next(error);
    }
  }
}
