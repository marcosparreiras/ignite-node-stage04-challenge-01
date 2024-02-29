import { makePrismaDeliveryMan } from "../../../../test/factories/make-delivery-man";
import request from "supertest";
import { app } from "../app";
import { prisma } from "../../database/prisma/prisma";
import { Encrypter } from "../../cryptography/encrypter";
import { makePrismaRemittee } from "../../../../test/factories/make-remittee";

describe("CreateOrder [E2E]", () => {
  test("[POST] /orders", async () => {
    const [admin, deliveryMan, remittee] = await Promise.all([
      makePrismaDeliveryMan({ isAdmin: true }),
      makePrismaDeliveryMan(),
      makePrismaRemittee(),
    ]);

    const token = await Encrypter.encrypt({ userId: admin.id.toString() });
    const response = await request(app)
      .post("/orders")
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        remitteeId: remittee.id.toString(),
        deliveryManId: deliveryMan.id.toString(),
        latitude: -19.94431468110453,
        longitude: -43.92989090202169,
      });

    expect(response.statusCode).toEqual(201);

    const orderOnRepository = await prisma.order.findFirst({
      where: { remitteeId: remittee.id.toString() },
    });

    expect(orderOnRepository).toEqual(
      expect.objectContaining({
        remitteeId: remittee.id.toString(),
        deliveryManId: deliveryMan.id.toString(),
      })
    );
  });
});
