import { Router } from "express";
import { createRemitteeController } from "../controllers/create-remittee.controller";
import { ensureAuth } from "../middlewares/ensure-auth";
import { getRemitteeController } from "../controllers/get-remittee.controller";
import { fetchRemitteeController } from "../controllers/fetch-remittee.controller";
import { updateRemitteeController } from "../controllers/update-remittee.controller";

export const remitteRoutes = Router();

remitteRoutes.use(ensureAuth);
remitteRoutes.post("/", createRemitteeController);
remitteRoutes.get("/", fetchRemitteeController);
remitteRoutes.get("/:id", getRemitteeController);
remitteRoutes.put("/:id", updateRemitteeController);
