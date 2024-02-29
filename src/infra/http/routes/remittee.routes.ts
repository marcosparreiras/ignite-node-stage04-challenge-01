import { Router } from "express";
import { createRemitteeController } from "../controllers/create-remittee.controller";
import { ensureAuth } from "../middlewares/ensure-auth";

export const remitteRoutes = Router();

remitteRoutes.use(ensureAuth);
remitteRoutes.post("/", createRemitteeController);
