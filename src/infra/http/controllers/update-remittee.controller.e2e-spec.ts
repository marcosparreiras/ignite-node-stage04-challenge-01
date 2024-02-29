import request from "supertest";
import { app } from "../app";
import { makePrismaDeliveryMan } from "../../../../test/factories/make-delivery-man";
import { Encrypter } from "../../cryptography/encrypter";
import { makePrismaRemittee } from "../../../../test/factories/make-remittee";
import { prisma } from "../../database/prisma/prisma";

describe("UpdateRemittee [E2E]", () => {
  test("[PUT] /remittees/:id", async () => {
    const [admin, remittee] = await Promise.all([
      makePrismaDeliveryMan({ isAdmin: true }),
      makePrismaRemittee(),
    ]);

    const token = await Encrypter.encrypt({ userId: admin.id.toString() });
    const remitteeId = remittee.id.toString();
    const newName = "John Doe";
    const response = await request(app)
      .put(`/remittees/${remitteeId}`)
      .set({ Authorization: `Bearer ${token}` })
      .send({
        name: newName,
      });

    expect(response.statusCode).toEqual(204);

    const remitteOnRepository = await prisma.remittee.findUnique({
      where: { cpf: remittee.cpf },
    });

    expect(remitteOnRepository).toEqual(
      expect.objectContaining({
        name: newName,
        cpf: remittee.cpf,
      })
    );
  });
});
