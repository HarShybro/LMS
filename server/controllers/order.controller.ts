import { Request, Response, NextFunction } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import { IOrder } from "../models/order.model";
import userModal from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import CourseModel from "../models/course.model";
import { getAllOrdersService, newOrder } from "../services/order.service";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMails";
import NotificationModel from "../models/notification.model";

export const createOrder = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info }: IOrder = req.body;

      const user = await userModal.findById(req.user?._id);

      const courseExistInUser = user?.courses.some(
        (course: any) => course?._id.toString() === courseId
      );

      if (courseExistInUser) {
        return next(new ErrorHandler("You already have this course", 400));
      }

      const course = await CourseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      const data: any = {
        courseId: course._id,
        userId: user?._id,
        payment_info,
      };

      const mailData = {
        order: {
          _id: (course?._id as string).toString().slice(0, 6),
          name: course.name,
          price: course.price,
          data: new Date().toLocaleString("en-us", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
        },
      };

      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/order-confirmation.ejs"),
        { order: mailData }
      );

      try {
        if (user) {
          await sendMail({
            email: user.email,
            subject: "Course Purchase",
            template: "order-confirmation.ejs",
            data: mailData,
          });
        }
      } catch (error) {
        next(new ErrorHandler("Email could not be sent", 500));
      }

      user?.courses.push({ _id: course._id as string });

      await user?.save();

      await NotificationModel.create({
        userId: user?._id,
        title: "New order",
        message: `You have new order from  ${course.name}`,
      });

      course.purchased += 1;

      await course.save();

      newOrder(data, res, next);
    } catch (error: any) {
      next(new ErrorHandler(error.message, 500));
    }
  }
);

export const getAllOrders = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    getAllOrdersService(res);
  }
);
