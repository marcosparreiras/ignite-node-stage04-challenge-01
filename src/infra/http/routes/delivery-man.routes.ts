import { Request, Response, Router } from "express";

export const deliveryManRoutes = Router();

deliveryManRoutes.get("/", (_request: Request, response: Response) => {
  response.send("Delivery Man");
});
