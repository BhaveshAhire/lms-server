import express from "express";
import {
  getNotifications,
  updateNotification,
} from "../controllers/notification.controller";
import { isAuthenticated, authorizedRoles } from "../middleware/auth";
import { updateAccessToken } from "../controllers/user.controller";

const notificationRouter = express.Router();

notificationRouter.get(
  "/get-notifications",
  updateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  getNotifications
);

notificationRouter.put(
  "/update-notification/:id",
  updateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  updateNotification
);

export default notificationRouter;
