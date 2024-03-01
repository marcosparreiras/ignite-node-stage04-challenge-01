import request from "supertest";
import { app } from "../app";
import { Encrypter } from "../../cryptography/encrypter";
import { prisma } from "../../database/prisma/prisma";
import { makePrismaDeliveryMan } from "../../../../test/factories/prisma/make-prisma-delivery-man";
import { makePrismaRemittee } from "../../../../test/factories/prisma/make-prisma-remittee";
import { makePrismaOrder } from "../../../../test/factories/prisma/make-prisma-order";

describe("UploadOrderDeliveryConfirmationPhoto [E2E]", () => {
  test("[PATCH] /orders/:id/upload-confirmation-photo", async () => {
    const [deliveryMan, remittee] = await Promise.all([
      makePrismaDeliveryMan(),
      makePrismaRemittee(),
    ]);

    const order = await makePrismaOrder({
      remitteeId: remittee.id,
      deliveryManId: deliveryMan.id,
    });

    const token = await Encrypter.encrypt({
      userId: deliveryMan.id.toString(),
    });
    const orderId = order.id.toString();

    const response = await request(app)
      .patch(`/orders/${orderId}/upload-confirmation-photo`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .attach("file", "./test/e2e/order-photo.png");

    expect(response.status).toEqual(204);
    const orderOnRepository = await prisma.order.findUnique({
      where: { id: order.id.toString() },
    });

    expect(orderOnRepository?.deliveryConfirmationPhotoUrl).toBeTruthy();
  });
});
