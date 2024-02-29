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
import { fetchNearbyDeliveryLocationOrderController } from "../controllers/fetch-nearby-delivery-location-order.controller";
import { fetchDeliveryManOrderController } from "../controllers/fetch-delivery-man-order.controller";
import { fetchRemitteeOrder } from "../controllers/fetch-remittee-order.controller";

const upload = multer();
export const orderRoutes = Router();

orderRoutes.get("/remittee/:cpf", fetchRemitteeOrder);
orderRoutes.get(
  "/my/nearby",
  ensureAuth,
  fetchNearbyDeliveryLocationOrderController
);
orderRoutes.get("/my", ensureAuth, fetchDeliveryManOrderController);
orderRoutes.post("/", ensureAuth, createOrderController);
orderRoutes.get("/", ensureAuth, fetchOrderController);
orderRoutes.get("/:id", ensureAuth, getOrderController);
orderRoutes.put("/:id", ensureAuth, updateOrderController);
orderRoutes.delete("/:id", ensureAuth, deleteOrderController);
orderRoutes.patch(
  "/:id/delivery-stage",
  ensureAuth,
  updateOrderDeliveryStageController
);
orderRoutes.patch("/:id/return", ensureAuth, returnOrderController);
orderRoutes.patch(
  "/:id/upload-confirmation-photo",
  ensureAuth,
  upload.single("file"),
  uploadOrderDeliveryConfirmationPhotoController
);
