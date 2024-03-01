import request from "supertest";
import { app } from "../app";
import { Encrypter } from "../../cryptography/encrypter";
import { Location } from "../../../domain/shipping/enterprise/object-values/location";
import { makePrismaDeliveryMan } from "../../../../test/factories/prisma/make-prisma-delivery-man";
import { makePrismaRemittee } from "../../../../test/factories/prisma/make-prisma-remittee";
import { makePrismaOrder } from "../../../../test/factories/prisma/make-prisma-order";

describe("FetchDeliveryManOrder [E2E]", () => {
  test("[GET] /orders/my", async () => {
    const [deliveryMan, otherDeliveryMan, remittee] = await Promise.all([
      makePrismaDeliveryMan(),
      makePrismaDeliveryMan(),
      makePrismaRemittee(),
    ]);

    await Promise.all([
      makePrismaOrder({
        remitteeId: remittee.id,
        deliveryManId: deliveryMan.id,
        deliveryLocation: new Location(-19.94765332605529, -43.94034520061096),
      }),
      makePrismaOrder({
        remitteeId: remittee.id,
        deliveryManId: deliveryMan.id,
        deliveryLocation: new Location(-19.91612678488924, -43.97581745976151),
      }),
      makePrismaOrder({
        remitteeId: remittee.id,
        deliveryManId: otherDeliveryMan.id,
        deliveryLocation: new Location(-19.94765332605529, -43.94034520061096),
      }),
    ]);

    const token = await Encrypter.encrypt({
      userId: deliveryMan.id.toString(),
    });

    const response = await request(app)
      .get("/orders/my")
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.orders).toHaveLength(2);
  });
});
