import request from "supertest";
import { app } from "../app";
import { Encrypter } from "../../cryptography/encrypter";
import { makePrismaDeliveryMan } from "../../../../test/factories/prisma/make-prisma-delivery-man";
import { makePrismaRemittee } from "../../../../test/factories/prisma/make-prisma-remittee";

describe("FetchRemittee [E2E]", () => {
  test("[GET] /remittees", async () => {
    const [admin, _remittees] = await Promise.all([
      makePrismaDeliveryMan({ isAdmin: true }),
      makePrismaRemittee(),
      makePrismaRemittee(),
      makePrismaRemittee(),
    ]);

    const token = await Encrypter.encrypt({ userId: admin.id.toString() });

    const response = await request(app)
      .get("/remittees")
      .set({ Authorization: `Bearer ${token}` })
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.remittees).toHaveLength(3);
  });
});
