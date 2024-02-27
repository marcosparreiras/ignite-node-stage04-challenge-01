import jwt from "jsonwebtoken";
import { env } from "../env";

export class Encrypter {
  static async encrypt(payload: Record<string, unknown>): Promise<string> {
    const token = jwt.sign(payload, env.JWT_TOKEN, { expiresIn: "24h" });
    return token;
  }

  static async decrypt(
    token: string
  ): Promise<Record<string, unknown> | string> {
    const payload = jwt.verify(token, env.JWT_TOKEN);
    return payload;
  }
}
