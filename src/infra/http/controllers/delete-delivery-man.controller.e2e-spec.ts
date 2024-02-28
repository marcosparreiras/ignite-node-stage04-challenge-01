import { makePrismaDeliveryMan } from "../../../../test/factories/make-delivery-man";
import request from "supertest";
import { app } from "../app";
import { prisma } from "../../database/prisma/prisma";
import { Encrypter } from "../../cryptography/encrypter";

describe("DeleteDeliveryMan [E2E]", () => {
  test("[DELETE] /delivery-men/:id", async () => {
    const [admin, deliveryMan] = await Promise.all([
      await makePrismaDeliveryMan({ isAdmin: true }),
      await makePrismaDeliveryMan(),
    ]);

    const token = await Encrypter.encrypt({ userId: admin.id.toString() });
    const deliveryManId = deliveryMan.id.toString();

    const response = await request(app)
      .delete(`/delivery-men/${deliveryManId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send();

    expect(response.statusCode).toEqual(204);

    const deliveryManOnRepository = await prisma.deliveryMan.findUnique({
      where: { cpf: deliveryMan.cpf },
    });

    expect(deliveryManOnRepository).toBeNull();
  });
});