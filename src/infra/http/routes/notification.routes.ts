import { Router } from "express";
import { ensureAuth } from "../middlewares/ensure-auth";
import { sendNotificationController } from "../controllers/send-notification.controller";

export const notificationRoutes = Router();

notificationRoutes.post("/", ensureAuth, sendNotificationController);
