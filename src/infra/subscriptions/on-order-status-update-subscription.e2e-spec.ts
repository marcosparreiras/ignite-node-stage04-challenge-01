import request from "supertest";
import { app } from "../http/app";
import { Encrypter } from "../cryptography/encrypter";
import { waitFor } from "../../../test/utils/wait-for";
import { prisma } from "../database/prisma/prisma";
import { DomainEvents } from "../../domain/core/events/domain-events";
import { makePrismaDeliveryMan } from "../../../test/factories/prisma/make-prisma-delivery-man";
import { makePrismaRemittee } from "../../../test/factories/prisma/make-prisma-remittee";
import { makePrismaOrder } from "../../../test/factories/prisma/make-prisma-order";

describe("OnOrderStatusUpdate [E2E]", () => {
  beforeAll(() => {
    DomainEvents.shouldRun = true;
  });

  it("Should send a notification when order status is update", async () => {
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

    await request(app)
      .patch(`/orders/${orderId}/delivery-stage`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        deliveryStage: "AVAILABE_TO_DELIVERY",
      });

    expect(1).toEqual(1);

    await waitFor(async () => {
      const notificationOnRepository = await prisma.notification.findFirst({
        where: { recipientId: remittee.id.toString() },
      });
      expect(notificationOnRepository).not.toBeNull();
    });
  });
});
