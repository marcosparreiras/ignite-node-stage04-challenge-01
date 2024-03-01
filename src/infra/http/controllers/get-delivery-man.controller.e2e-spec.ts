import request from "supertest";
import { app } from "../app";
import { Encrypter } from "../../cryptography/encrypter";
import { makePrismaDeliveryMan } from "../../../../test/factories/prisma/make-prisma-delivery-man";

describe("GetDeliveryMan [E2E]", () => {
  test("[GET] /delivery-men/:id", async () => {
    const deliveryMan = await makePrismaDeliveryMan();
    const admin = await makePrismaDeliveryMan({
      isAdmin: true,
    });

    const token = await Encrypter.encrypt({ userId: admin.id.toString() });
    const deliveryManId = deliveryMan.id.toString();

    const response = await request(app)
      .get(`/delivery-men/${deliveryManId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        deliveryMan: expect.objectContaining({
          cpf: deliveryMan.cpf,
          name: deliveryMan.name,
        }),
      })
    );
  });
});
