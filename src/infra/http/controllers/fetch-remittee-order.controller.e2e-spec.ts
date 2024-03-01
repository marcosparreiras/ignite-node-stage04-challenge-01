import request from "supertest";
import { app } from "../app";
import { makePrismaRemittee } from "../../../../test/factories/prisma/make-prisma-remittee";
import { makePrismaDeliveryMan } from "../../../../test/factories/prisma/make-prisma-delivery-man";
import { makePrismaOrder } from "../../../../test/factories/prisma/make-prisma-order";

describe("FetchRemitteeOrder [E2E]", () => {
  test("[GET] /orders/remittee/:cpf", async () => {
    const [deliveryMan, remittee, otherRemittee] = await Promise.all([
      makePrismaDeliveryMan(),
      makePrismaRemittee(),
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
        remitteeId: otherRemittee.id,
        deliveryManId: deliveryMan.id,
      }),
    ]);

    const response = await request(app)
      .get(`/orders/remittee/${remittee.cpf}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.orders).toHaveLength(2);
  });
});
