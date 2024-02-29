import { makePrismaDeliveryMan } from "../../../../test/factories/make-delivery-man";
import request from "supertest";
import { app } from "../app";
import { Encrypter } from "../../cryptography/encrypter";
import { makePrismaRemittee } from "../../../../test/factories/make-remittee";
import { makePrismaOrder } from "../../../../test/factories/make-order";
import { prisma } from "../../database/prisma/prisma";

describe("UpdateOrderDeliveryStage [E2E]", () => {
  test("[PUT] /orders/:id/delivery-stage", async () => {
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
      .patch(`/orders/${orderId}/delivery-stage`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        deliveryStage: "AVAILABE_TO_DELIVERY",
      });

    expect(response.statusCode).toEqual(204);

    const orderOnRepository = await prisma.order.findUnique({
      where: { id: order.id.toString() },
    });

    expect(orderOnRepository).toEqual(
      expect.objectContaining({
        remitteeId: remittee.id.toString(),
        deliveryManId: deliveryMan.id.toString(),
        stage: "AVAILABE_TO_DELIVERY",
      })
    );
  });
});
