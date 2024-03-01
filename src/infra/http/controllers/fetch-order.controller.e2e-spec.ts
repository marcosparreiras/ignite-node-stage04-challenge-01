import request from "supertest";
import { app } from "../app";
import { Encrypter } from "../../cryptography/encrypter";
import { makePrismaDeliveryMan } from "../../../../test/factories/prisma/make-prisma-delivery-man";
import { makePrismaRemittee } from "../../../../test/factories/prisma/make-prisma-remittee";
import { makePrismaOrder } from "../../../../test/factories/prisma/make-prisma-order";

describe("FetchOrder [E2E]", () => {
  test("[GET] /orders", async () => {
    const [admin, deliveryMan, remittee] = await Promise.all([
      makePrismaDeliveryMan({ isAdmin: true }),
      makePrismaDeliveryMan(),
      makePrismaRemittee(),
    ]);

    await Promise.all([
      makePrismaOrder({
        remitteeId: remittee.id,
        deliveryManId: deliveryMan.id,
      }),
      makePrismaOrder({
        remitteeId: remittee.id,
        deliveryManId: deliveryMan.id,
      }),
      makePrismaOrder({
        remitteeId: remittee.id,
        deliveryManId: deliveryMan.id,
      }),
    ]);

    const token = await Encrypter.encrypt({ userId: admin.id.toString() });

    const response = await request(app)
      .get("/orders")
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.orders).toHaveLength(3);
  });
});
