import { makePrismaDeliveryMan } from "../../../../test/factories/make-delivery-man";
import request from "supertest";
import { app } from "../app";
import { Encrypter } from "../../cryptography/encrypter";
import { makePrismaRemittee } from "../../../../test/factories/make-remittee";
import { makePrismaOrder } from "../../../../test/factories/make-order";
import { prisma } from "../../database/prisma/prisma";

describe("DeletOrder [E2E]", () => {
  test("[DELETE] /orders/:id", async () => {
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
      .delete(`/orders/${orderId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send();

    expect(response.statusCode).toEqual(204);

    const orderOnRepository = await prisma.order.findUnique({
      where: { id: order.id.toString() },
    });

    expect(orderOnRepository).toBeNull();
  });
});
