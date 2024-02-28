import { makePrismaDeliveryMan } from "../../../../test/factories/make-delivery-man";
import request from "supertest";
import { app } from "../app";
import { Encrypter } from "../../cryptography/encrypter";
import { prisma } from "../../database/prisma/prisma";
import { HashService } from "../../cryptography/hash-service";

describe("UpdateDeliveryMan [E2E]", () => {
  test("[PUT] /delivery-men/:id", async () => {
    const hashService = new HashService();

    const deliveryMan = await makePrismaDeliveryMan();
    const admin = await makePrismaDeliveryMan({
      isAdmin: true,
    });

    const token = await Encrypter.encrypt({ userId: admin.id.toString() });
    const deliveryManId = deliveryMan.id.toString();

    const response = await request(app)
      .put(`/delivery-men/${deliveryManId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        name: "john Doe",
        isAdmin: true,
      });

    expect(response.statusCode).toEqual(204);
    const deliveryManOnRepository = await prisma.deliveryMan.findUnique({
      where: { cpf: deliveryMan.cpf },
    });

    expect(deliveryManOnRepository).toEqual(
      expect.objectContaining({
        name: "john Doe",
        isAdmin: true,
      })
    );
  });
});
