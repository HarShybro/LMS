import express from "express";
import { authorizeRoles, isAuthenicated } from "../middleware/auth";
import { createOrder, getAllOrders } from "../controllers/order.controller";
import { getAllOrdersService } from "../services/order.service";

const orderRouter = express.Router();

orderRouter.route("/create-order").post(isAuthenicated, createOrder);
orderRouter
  .route("/get-all-orders")
  .get(isAuthenicated, authorizeRoles("admin"), getAllOrders);

export default orderRouter;
