import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import NotificationModel from "../models/notification.model";
import ErrorHandler from "../utils/ErrorHandler";
import cron from "node-cron";

export const getNotification = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const notifications = await NotificationModel.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      notifications,
    });
  }
);

export const updateNotification = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const notification = await NotificationModel.findById(req.params.id);

    if (!notification) {
      return next(new ErrorHandler("Notification not found", 404));
    } else {
      notification.status
        ? (notification.status = "read")
        : notification.status;
    }

    await notification.save();

    const notifications = await NotificationModel.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      notifications,
    });
  }
);

cron.schedule("0 0 0 * * *", async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  await NotificationModel.deleteMany({
    status: "read",
    createdAt: { $lt: thirtyDaysAgo },
  });
  console.log("Deleted read notifications");
});
