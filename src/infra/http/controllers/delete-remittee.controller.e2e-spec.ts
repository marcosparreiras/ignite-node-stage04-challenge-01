import request from "supertest";
import { app } from "../app";
import { makePrismaDeliveryMan } from "../../../../test/factories/make-delivery-man";
import { Encrypter } from "../../cryptography/encrypter";
import { makePrismaRemittee } from "../../../../test/factories/make-remittee";
import { prisma } from "../../database/prisma/prisma";

describe("DeleteRemitte [E2E]", () => {
  test("[DELETE] /remittees/:id", async () => {
    const [admin, remittee] = await Promise.all([
      makePrismaDeliveryMan({ isAdmin: true }),
      makePrismaRemittee(),
    ]);

    const token = await Encrypter.encrypt({ userId: admin.id.toString() });
    const remitteeId = remittee.id.toString();

    const response = await request(app)
      .delete(`/remittees/${remitteeId}`)
      .set({ Authorization: `Bearer ${token}` })
      .send();

    expect(response.statusCode).toEqual(204);
    const remitteeOnRepository = await prisma.remittee.findUnique({
      where: { id: remittee.id.toString() },
    });
    expect(remitteeOnRepository).toBeNull();
  });
});
