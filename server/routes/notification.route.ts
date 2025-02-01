import express from "express";
import { authorizeRoles, isAuthenicated } from "../middleware/auth";
import { getNotification, updateNotification } from "../controllers/notification.controller";

const notificationRouter = express.Router();

notificationRouter.get(
  "/get-all-notifications",
  isAuthenicated,
  authorizeRoles("admin"),
  getNotification
);

notificationRouter.put('/update-notification/:id', isAuthenicated, authorizeRoles('admin'), updateNotification);

export default notificationRouter;
