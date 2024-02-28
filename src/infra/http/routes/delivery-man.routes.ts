import { Router } from "express";
import { authenticateDeliveryManController } from "../controllers/authenticate-delivery-man.controller";
import { createDeliveryManController } from "../controllers/create-delivery-man.controller";

export const deliveryManRoutes = Router();

deliveryManRoutes.post("/", createDeliveryManController);
deliveryManRoutes.post("/session", authenticateDeliveryManController);
