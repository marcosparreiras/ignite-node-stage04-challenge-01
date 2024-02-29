import { Router } from "express";
import { createRemitteeController } from "../controllers/create-remittee.controller";
import { ensureAuth } from "../middlewares/ensure-auth";
import { getRemitteeController } from "../controllers/get-remittee.controller";

export const remitteRoutes = Router();

remitteRoutes.use(ensureAuth);
remitteRoutes.post("/", createRemitteeController);
remitteRoutes.get("/:id", getRemitteeController);
