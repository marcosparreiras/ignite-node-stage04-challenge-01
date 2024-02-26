import { Request, Response, Router } from "express";

export const remitteRoutes = Router();

remitteRoutes.get("/", (_request: Request, response: Response) => {
  response.send("Remittee");
});
