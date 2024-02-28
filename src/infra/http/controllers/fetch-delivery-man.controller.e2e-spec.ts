import { makePrismaDeliveryMan } from "../../../../test/factories/make-delivery-man";
import request from "supertest";
import { app } from "../app";

import { Encrypter } from "../../cryptography/encrypter";

describe("FetchDeliveryMan [E2E]", () => {
  test("[GET] /delivery-men", async () => {
    const [admin, ..._rest] = await Promise.all([
      makePrismaDeliveryMan({ isAdmin: true }),
      makePrismaDeliveryMan(),
      makePrismaDeliveryMan(),
      makePrismaDeliveryMan(),
      makePrismaDeliveryMan(),
    ]);

    const token = await Encrypter.encrypt({ userId: admin.id.toString() });
    const response = await request(app)
      .get("/delivery-men")
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.deliveryMen).toHaveLength(5);
  });
});
