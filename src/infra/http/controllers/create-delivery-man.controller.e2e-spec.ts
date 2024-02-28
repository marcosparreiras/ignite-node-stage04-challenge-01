import { makePrismaDeliveryMan } from "../../../../test/factories/make-delivery-man";
import request from "supertest";
import { app } from "../app";
import { prisma } from "../../database/prisma/prisma";

describe("CreateDeliveryMan [E2E]", () => {
  test("[POST] /delivery-men", async () => {
    const admin = await makePrismaDeliveryMan({
      isAdmin: true,
    });

    const cpf = "00457848876";
    const response = await request(app).post("/delivery-men").send({
      cpf,
      adminId: admin.id.toString(),
      name: "john Doe",
      password: "123456",
    });

    expect(response.statusCode).toEqual(201);

    const deliveryManOnRepository = await prisma.deliveryMan.findUnique({
      where: { cpf },
    });

    expect(deliveryManOnRepository).toBeTruthy();
  });
});
