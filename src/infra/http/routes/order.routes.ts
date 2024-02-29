import { Router } from "express";
import { createOrderController } from "../controllers/create-order.controller";
import { ensureAuth } from "../middlewares/ensure-auth";
import { getOrderController } from "../controllers/get-order.controller";

export const orderRoutes = Router();

orderRoutes.use(ensureAuth);
orderRoutes.post("/", createOrderController);
orderRoutes.get("/:id", getOrderController);
