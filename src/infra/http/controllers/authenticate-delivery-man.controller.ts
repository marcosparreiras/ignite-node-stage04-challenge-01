import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { AuthenticateDeliveryManUseCase } from "../../../domain/shipping/application/use-cases/authenticate-delivery-man";
import { InvalidCredentialsError } from "../../../domain/core/errors/invalid-credentials-error";
import { InMemoryDeliveryManRepository } from "../../../../test/repositories/in-memory-delivery-man-repository";
import { HashService } from "../../cryptography/hash-service";

export async function authenticateDeliveryMan(
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

    const deliveryManRepository = new InMemoryDeliveryManRepository();
    const hashService = new HashService();
    const authenticateDeliveryMan = new AuthenticateDeliveryManUseCase(
      deliveryManRepository,
      hashService
    );

    await authenticateDeliveryMan.execute({ cpf, password });
  } catch (error: any) {
    switch (error.constructor) {
      case InvalidCredentialsError:
        return response.status(401).json({ message: error.message });
      default:
        return next(error);
    }
  }
}
