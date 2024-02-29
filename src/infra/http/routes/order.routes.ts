import { Router } from "express";
import { createOrderController } from "../controllers/create-order.controller";
import { ensureAuth } from "../middlewares/ensure-auth";
import { getOrderController } from "../controllers/get-order.controller";
import { fetchOrderController } from "../controllers/fetch-order.controller";
import { updateOrderController } from "../controllers/update-order.controller";
import { deleteOrderController } from "../controllers/delete-order.controller";
import { updateOrderDeliveryStageController } from "../controllers/update-order-delivery-stage.controller";
import { returnOrderController } from "../controllers/return-order.controller";
import multer from "multer";
import { uploadOrderDeliveryConfirmationPhotoController } from "../controllers/upload-order-delivery-confirmation-photo.controller";

const upload = multer();
export const orderRoutes = Router();

orderRoutes.use(ensureAuth);
orderRoutes.post("/", createOrderController);
orderRoutes.get("/", fetchOrderController);
orderRoutes.get("/:id", getOrderController);
orderRoutes.put("/:id", updateOrderController);
orderRoutes.delete("/:id", deleteOrderController);
orderRoutes.patch("/:id/delivery-stage", updateOrderDeliveryStageController);
orderRoutes.patch("/:id/return", returnOrderController);
orderRoutes.patch(
  "/:id/upload-confirmation-photo",
  upload.single("file"),
  uploadOrderDeliveryConfirmationPhotoController
);
