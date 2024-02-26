import { Request, Response, Router } from "express";

export const orderRoutes = Router();

orderRoutes.get("/", (_request: Request, response: Response) => {
  response.send("Orders");
});
