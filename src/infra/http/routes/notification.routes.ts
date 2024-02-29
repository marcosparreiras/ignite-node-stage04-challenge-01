import { Router } from "express";
import { ensureAuth } from "../middlewares/ensure-auth";
import { sendNotificationController } from "../controllers/send-notification.controller";
import { readNotificationController } from "../controllers/read-notification.controller";

export const notificationRoutes = Router();

notificationRoutes.patch("/:id", readNotificationController);
notificationRoutes.post("/", ensureAuth, sendNotificationController);
