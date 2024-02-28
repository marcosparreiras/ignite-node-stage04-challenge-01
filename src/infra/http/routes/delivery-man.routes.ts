import { Router } from "express";
import { authenticateDeliveryManController } from "../controllers/authenticate-delivery-man.controller";
import { createDeliveryManController } from "../controllers/create-delivery-man.controller";
import { ensureAuth } from "../middlewares/ensure-auth";

export const deliveryManRoutes = Router();

deliveryManRoutes.post("/session", authenticateDeliveryManController);

deliveryManRoutes.use(ensureAuth);
deliveryManRoutes.post("/", createDeliveryManController);
