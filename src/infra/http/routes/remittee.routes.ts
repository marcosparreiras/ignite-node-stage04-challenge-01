import { Router } from "express";
import { createRemitteeController } from "../controllers/create-remittee.controller";
import { ensureAuth } from "../middlewares/ensure-auth";
import { getRemitteeController } from "../controllers/get-remittee.controller";
import { fetchRemitteeController } from "../controllers/fetch-remittee.controller";
import { updateRemitteeController } from "../controllers/update-remittee.controller";
import { deleteRemitteeController } from "../controllers/delete-remittee.controller";

export const remitteRoutes = Router();

remitteRoutes.post("/", ensureAuth, createRemitteeController);
remitteRoutes.get("/", ensureAuth, fetchRemitteeController);
remitteRoutes.get("/:id", ensureAuth, getRemitteeController);
remitteRoutes.put("/:id", ensureAuth, updateRemitteeController);
remitteRoutes.delete("/:id", ensureAuth, deleteRemitteeController);
