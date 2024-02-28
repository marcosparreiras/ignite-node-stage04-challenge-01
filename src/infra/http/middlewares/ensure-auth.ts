import { NextFunction, Request, Response } from "express";
import { Encrypter } from "../../cryptography/encrypter";

export async function ensureAuth(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { authorization } = request.headers;
    const token = authorization?.split(" ")[1];
    if (!token) {
      return response.status(401).json({ message: "Unauthenticate ⚠️" });
    }

    const payload = await Encrypter.decrypt(token);
    if (typeof payload === "string" || typeof payload.userId !== "string") {
      return response.status(401).json({ message: "Invalid token ⚠️" });
    }

    request.userId = payload.userId;
    return next();
  } catch (error) {
    return next(error);
  }
}
