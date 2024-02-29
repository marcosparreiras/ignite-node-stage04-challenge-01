import { Router } from "express";
import { createOrderController } from "../controllers/create-order.controller";
import { ensureAuth } from "../middlewares/ensure-auth";
import { getOrderController } from "../controllers/get-order.controller";
import { fetchOrderController } from "../controllers/fetch-order.controller";
import { updateOrderController } from "../controllers/update-order.controller";

export const orderRoutes = Router();

orderRoutes.use(ensureAuth);
orderRoutes.post("/", createOrderController);
orderRoutes.get("/", fetchOrderController);
orderRoutes.get("/:id", getOrderController);
orderRoutes.put("/:id", updateOrderController);
