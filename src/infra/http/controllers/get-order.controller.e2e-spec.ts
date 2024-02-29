import { makePrismaDeliveryMan } from "../../../../test/factories/make-delivery-man";
import request from "supertest";
import { app } from "../app";
import { Encrypter } from "../../cryptography/encrypter";
import { makePrismaRemittee } from "../../../../test/factories/make-remittee";
import { makePrismaOrder } from "../../../../test/factories/make-order";
import { prisma } from "../../database/prisma/prisma";

describe("GetOrder [E2E]", () => {
  test("[GET] /orders/:id", async () => {
    const [admin, deliveryMan, remittee] = await Promise.all([
      makePrismaDeliveryMan({ isAdmin: true }),
      makePrismaDeliveryMan(),
      makePrismaRemittee(),
    ]);

    const order = await makePrismaOrder({
      remitteeId: remittee.id,
      deliveryManId: deliveryMan.id,
    });

    const token = await Encrypter.encrypt({ userId: admin.id.toString() });
    const orderId = order.id.toString();

    const response = await request(app)
      .get(`/orders/${orderId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.order).toEqual(
      expect.objectContaining({
        id: order.id.toString(),
        remitteeId: remittee.id.toString(),
        deliveryManId: deliveryMan.id.toString(),
      })
    );
  });
});
