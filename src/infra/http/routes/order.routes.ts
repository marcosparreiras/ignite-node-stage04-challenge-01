import { Router } from "express";
import { createOrderController } from "../controllers/create-order.controller";
import { ensureAuth } from "../middlewares/ensure-auth";

export const orderRoutes = Router();

orderRoutes.use(ensureAuth);
orderRoutes.post("/", createOrderController);
