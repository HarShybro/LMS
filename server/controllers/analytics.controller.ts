import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import { generate12MonthsData } from "../utils/analytics.generator";
import userModal from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import CourseModel from "../models/course.model";
import OrderModel from "../models/order.model";

export const getUserAnalytics = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await generate12MonthsData(userModal);
    if (!users) {
      return next(new ErrorHandler("no get user analytics", 400));
    }

    res.status(200).json({
      succcess: true,
      users,
    });
  }
);

export const getCourseAnalytics = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const courses = await generate12MonthsData(CourseModel);
    if (!courses) {
      return next(new ErrorHandler("no get courses analytics", 400));
    }

    res.status(200).json({
      succcess: true,
      courses,
    });
  }
);

export const getOrderAnalytics = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const orders = await generate12MonthsData(OrderModel);
    if (!orders) {
      return next(new ErrorHandler("no get courses analytics", 400));
    }

    res.status(200).json({
      succcess: true,
      orders,
    });
  }
);
