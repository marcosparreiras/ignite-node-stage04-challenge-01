import { makePrismaDeliveryMan } from "../../../../test/factories/make-delivery-man";
import request from "supertest";
import { app } from "../app";
import { Encrypter } from "../../cryptography/encrypter";
import { makePrismaRemittee } from "../../../../test/factories/make-remittee";
import { prisma } from "../../database/prisma/prisma";

describe("SendNotification [E2E]", () => {
  test("[POST] /notifications", async () => {
    const [deliveryMan, remittee] = await Promise.all([
      makePrismaDeliveryMan(),
      makePrismaRemittee(),
    ]);

    const token = await Encrypter.encrypt({
      userId: deliveryMan.id.toString(),
    });

    const response = await request(app)
      .post("/notifications")
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        recipientId: remittee.id.toString(),
        title: "fake notification",
        content: "fake content",
      });

    expect(response.statusCode).toEqual(201);

    const notificationOnRepository = await prisma.notification.findFirst({
      where: { title: "fake notification" },
    });

    expect(notificationOnRepository).toEqual(
      expect.objectContaining({
        recipientId: remittee.id.toString(),
        title: "fake notification",
        content: "fake content",
      })
    );
  });
});
