import { Router } from "express";
import { ensureAuth } from "../middlewares/ensure-auth";
import { authenticateDeliveryManController } from "../controllers/authenticate-delivery-man.controller";
import { createDeliveryManController } from "../controllers/create-delivery-man.controller";
import { getDeliveryManController } from "../controllers/get-delivery-man.controller";
import { fecthDeliveryManController } from "../controllers/fetch-delivery-man.controller";
import { updateDeliveryManController } from "../controllers/update-delivery-man.controller";

export const deliveryManRoutes = Router();

deliveryManRoutes.post("/session", authenticateDeliveryManController);

deliveryManRoutes.use(ensureAuth);
deliveryManRoutes.post("/", createDeliveryManController);
deliveryManRoutes.get("/", fecthDeliveryManController);
deliveryManRoutes.get("/:id", getDeliveryManController);
deliveryManRoutes.put("/:id", updateDeliveryManController);
