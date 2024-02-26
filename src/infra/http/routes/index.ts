import { Router } from "express";
import { deliveryManRoutes } from "./delivery-man.routes";

export const routes = Router();

routes.use("/delivery-men", deliveryManRoutes);
routes.use("/orders", deliveryManRoutes);
routes.use("/remittees", deliveryManRoutes);
