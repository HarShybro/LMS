import express from "express";
import { authorizeRoles, isAuthenicated } from "../middleware/auth";
import {
  getCourseAnalytics,
  getOrderAnalytics,
  getUserAnalytics,
} from "../controllers/analytics.controller";

const analyticsRouter = express.Router();

analyticsRouter.get(
  "/get-user-analytics",
  isAuthenicated,
  authorizeRoles("admin"),
  getUserAnalytics
);

analyticsRouter.get(
  "/get-order-analytics",
  isAuthenicated,
  authorizeRoles("admin"),
  getOrderAnalytics
);

analyticsRouter.get(
  "/get-course-analytics",
  isAuthenicated,
  authorizeRoles("admin"),
  getCourseAnalytics
);

export default analyticsRouter;
