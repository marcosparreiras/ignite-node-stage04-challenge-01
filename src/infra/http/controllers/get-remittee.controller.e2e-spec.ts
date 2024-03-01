import request from "supertest";
import { app } from "../app";
import { Encrypter } from "../../cryptography/encrypter";
import { makePrismaDeliveryMan } from "../../../../test/factories/prisma/make-prisma-delivery-man";
import { makePrismaRemittee } from "../../../../test/factories/prisma/make-prisma-remittee";

describe("GetRemittee [E2E]", () => {
  test("[GET] /remittees/:id", async () => {
    const [admin, remittee] = await Promise.all([
      makePrismaDeliveryMan({ isAdmin: true }),
      makePrismaRemittee(),
    ]);

    const token = await Encrypter.encrypt({ userId: admin.id.toString() });
    const remitteeId = remittee.id.toString();

    const response = await request(app)
      .get(`/remittees/${remitteeId}`)
      .set({ Authorization: `Bearer ${token}` })
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.remittee).toEqual(
      expect.objectContaining({
        name: remittee.name,
        cpf: remittee.cpf,
      })
    );
  });
});
