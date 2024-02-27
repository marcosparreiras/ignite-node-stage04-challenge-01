import { Request, Response, Router } from "express";
import { authenticateDeliveryMan } from "../controllers/authenticate-delivery-man.controller";

export const deliveryManRoutes = Router();

deliveryManRoutes.post("/session", authenticateDeliveryMan);
