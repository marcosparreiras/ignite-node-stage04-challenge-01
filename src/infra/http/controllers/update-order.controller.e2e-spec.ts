import { makePrismaDeliveryMan } from "../../../../test/factories/make-delivery-man";
import request from "supertest";
import { app } from "../app";
import { Encrypter } from "../../cryptography/encrypter";
import { makePrismaRemittee } from "../../../../test/factories/make-remittee";
import { makePrismaOrder } from "../../../../test/factories/make-order";
import { prisma } from "../../database/prisma/prisma";

describe("UpdateOrder [E2E]", () => {
  test("[PUT] /orders/:id", async () => {
    const [admin, deliveryMan, remittee, newRemittee] = await Promise.all([
      makePrismaDeliveryMan({ isAdmin: true }),
      makePrismaDeliveryMan(),
      makePrismaRemittee(),
      makePrismaRemittee(),
    ]);

    const order = await makePrismaOrder({
      remitteeId: remittee.id,
      deliveryManId: deliveryMan.id,
    });

    const token = await Encrypter.encrypt({ userId: admin.id.toString() });
    const orderId = order.id.toString();

    const response = await request(app)
      .put(`/orders/${orderId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        remitteeId: newRemittee.id.toString(),
        deliveryManId: deliveryMan.id.toString(),
        latitude: -43.05,
        longitude: -65.46,
      });

    expect(response.statusCode).toEqual(204);

    const orderOnRepository = await prisma.order.findUnique({
      where: { id: order.id.toString() },
    });

    expect(orderOnRepository).toEqual(
      expect.objectContaining({
        remitteeId: newRemittee.id.toString(),
        deliveryManId: deliveryMan.id.toString(),
      })
    );
  });
});
