import { makePrismaDeliveryMan } from "../../../../test/factories/make-delivery-man";
import request from "supertest";
import { app } from "../app";
import { Encrypter } from "../../cryptography/encrypter";
import { makePrismaRemittee } from "../../../../test/factories/make-remittee";
import { makePrismaOrder } from "../../../../test/factories/make-order";

describe("GetOrder [E2E]", () => {
  test("[GET] /orders/:id", async () => {
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
