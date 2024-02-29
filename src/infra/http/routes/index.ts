import { Router } from "express";
import { deliveryManRoutes } from "./delivery-man.routes";
import { orderRoutes } from "./order.routes";
import { remitteRoutes } from "./remittee.routes";

export const routes = Router();

routes.use("/orders", orderRoutes);
routes.use("/delivery-men", deliveryManRoutes);
routes.use("/remittees", remitteRoutes);
