import { Router } from "express";
import { ensureAuth } from "../middlewares/ensure-auth";
import { authenticateDeliveryManController } from "../controllers/authenticate-delivery-man.controller";
import { createDeliveryManController } from "../controllers/create-delivery-man.controller";
import { getDeliveryManController } from "../controllers/get-delivery-man.controller";

export const deliveryManRoutes = Router();

deliveryManRoutes.post("/session", authenticateDeliveryManController);

deliveryManRoutes.use(ensureAuth);
deliveryManRoutes.post("/", createDeliveryManController);
deliveryManRoutes.get("/:id", getDeliveryManController);
