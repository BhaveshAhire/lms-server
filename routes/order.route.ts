import express from "express";
import { isAuthenticated, authorizedRoles } from "../middleware/auth";
import {
  createOrder,
  getAllOrders,
  newPayment,
  sentStripePublishableKey,
} from "../controllers/order.controller";
import { updateAccessToken } from "../controllers/user.controller";

const orderRouter = express.Router();

orderRouter.post("/create-order", isAuthenticated, createOrder);
orderRouter.get(
  "/get-orders",
  updateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  getAllOrders
);
orderRouter.get("/payment/stripepublishablekey", sentStripePublishableKey);
orderRouter.post("/payment", isAuthenticated, newPayment);

export default orderRouter;
