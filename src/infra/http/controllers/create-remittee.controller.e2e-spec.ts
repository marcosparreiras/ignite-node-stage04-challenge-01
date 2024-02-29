import request from "supertest";
import { app } from "../app";
import { makePrismaDeliveryMan } from "../../../../test/factories/make-delivery-man";
import { Encrypter } from "../../cryptography/encrypter";
import { prisma } from "../../database/prisma/prisma";

describe("CreateRemittee [E2E]", () => {
  test("[POST] /remittees", async () => {
    const admin = await makePrismaDeliveryMan({ isAdmin: true });

    const token = await Encrypter.encrypt({ userId: admin.id.toString() });
    const cpf = "03665422365";
    const name = "John Doe";

    const response = await request(app)
      .post("/remittees")
      .set({ Authorization: `Bearer ${token}` })
      .send({
        name,
        cpf,
      });

    expect(response.statusCode).toEqual(201);

    const remitteeOnRepository = await prisma.remittee.findUnique({
      where: { cpf },
    });
    expect(remitteeOnRepository).toEqual(
      expect.objectContaining({
        name,
        cpf,
      })
    );
  });
});
