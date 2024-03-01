import request from "supertest";
import { app } from "../app";
import { HashService } from "../../cryptography/hash-service";
import { Encrypter } from "../../cryptography/encrypter";
import { makePrismaDeliveryMan } from "../../../../test/factories/prisma/make-prisma-delivery-man";

describe("AuthenticateDeliveryMan [E2E]", () => {
  test("[POST] /delivery-men/session", async () => {
    const hashService = new HashService();
    const password = "123456";
    const hashedPassword = await hashService.hash("123456");

    const deliveryMan = await makePrismaDeliveryMan({
      password: hashedPassword,
    });

    const response = await request(app).post("/delivery-men/session").send({
      cpf: deliveryMan.cpf,
      password: password,
    });

    expect(response.statusCode).toEqual(201);
    expect(response.body.token).toBeTruthy();

    const data = await Encrypter.decrypt(response.body.token);
    expect(data).toEqual(
      expect.objectContaining({
        userId: deliveryMan.id.toString(),
      })
    );
  });
});
