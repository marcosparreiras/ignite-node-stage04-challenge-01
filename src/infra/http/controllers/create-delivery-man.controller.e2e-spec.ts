import { makePrismaDeliveryMan } from "../../../../test/factories/make-delivery-man";
import request from "supertest";
import { app } from "../app";
import { prisma } from "../../database/prisma/prisma";
import { Encrypter } from "../../cryptography/encrypter";

describe("CreateDeliveryMan [E2E]", () => {
  test("[POST] /delivery-men", async () => {
    const admin = await makePrismaDeliveryMan({
      isAdmin: true,
    });

    const token = await Encrypter.encrypt({ userId: admin.id.toString() });
    const cpf = "00457848876";

    const response = await request(app)
      .post("/delivery-men")
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        cpf,
        name: "john Doe",
        password: "123456",
      });

    expect(response.statusCode).toEqual(201);

    const deliveryManOnRepository = await prisma.deliveryMan.findUnique({
      where: { cpf },
    });

    expect(deliveryManOnRepository).toBeTruthy();
  });
});
