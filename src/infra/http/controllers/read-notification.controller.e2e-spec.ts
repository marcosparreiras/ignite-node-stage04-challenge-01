import request from "supertest";
import { app } from "../app";
import { prisma } from "../../database/prisma/prisma";
import { makePrismaRemittee } from "../../../../test/factories/prisma/make-prisma-remittee";
import { makePrismaNotification } from "../../../../test/factories/prisma/make-prisma-notification";

describe("ReadNotification [E2E]", () => {
  test("[PATCH] /notifications/:id", async () => {
    const remittee = await makePrismaRemittee();
    const notification = await makePrismaNotification({
      recipientId: remittee.id,
    });

    const response = await request(app)
      .patch(`/notifications/${notification.id.toString()}`)
      .send({
        recipientId: remittee.id.toString(),
      });

    expect(response.statusCode).toEqual(204);

    const notificationOnRepository = await prisma.notification.findUnique({
      where: { id: notification.id.toString() },
    });

    expect(notificationOnRepository?.readAt).not.toBeNull();
  });
});
