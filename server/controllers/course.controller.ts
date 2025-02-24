import { NextFunction, Response, Request } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { createCourse, getAllCoursesService } from "../services/course.service";
import CourseModel from "../models/course.model";
import { redis } from "../utils/redis";
import { json } from "stream/consumers";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMails";
import NotificationModel from "../models/notification.model";

interface CourseRequestBody {
  thumbnail?: string | { public_id: string; url: string };
}

export const uploadCourse = catchAsyncError(
  async (
    req: Request & { body: CourseRequestBody },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = req.body;
      console.log("Data:", data);
      if (data?.thumbnail && typeof data.thumbnail === "string") {
        const myCloud = await cloudinary.v2.uploader.upload(data.thumbnail, {
          folder: "courses",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      createCourse(data, res, next);
    } catch (error: any) {
      next(new ErrorHandler(error, 400));
    }
  }
);

export const editCourse = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;

      if (thumbnail) {
        await cloudinary.v2.uploader.destroy(thumbnail.public_id);

        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      const courseId = req.params.id;

      const course = await CourseModel.findByIdAndUpdate(
        courseId,
        {
          $set: data,
        },
        {
          new: true,
        }
      );

      return res.status(201).json({
        success: true,
        course,
      });
    } catch (error: any) {
      next(new ErrorHandler(error.message, 401));
    }
  }
);

export const getSingleCourse = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const courseId = req.params.id;
    const iscacheExist = await redis.get(courseId);

    if (iscacheExist) {
      const course = JSON.parse(iscacheExist);
      console.log("Redis hit");
      res.status(200).json({
        success: true,
        course,
      });
    } else {
      const course = await CourseModel.findById(req.params.id).select(
        "-courseData.videoUrl -courseData.suggestion, -courseData.questions -courseData.links"
      );

      await redis.set(courseId, JSON.stringify(course), "EX", 604800);
      console.log("mongo db hit");
      return res.status(200).json({
        success: true,
        course,
      });
    }
  }
);

export const getAllCourse = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const courseId = req.params.id;
    const isCacheExist = await redis.get("allCourses");

    if (isCacheExist) {
      const course = JSON.parse(isCacheExist);
      console.log("redis hit");
      return res.status(200).json({
        success: true,
        course,
      });
    } else {
      const course = await CourseModel.find().select(
        "-courseData.videoUrl -courseData.suggestion, -courseData.questions -courseData.links"
      );
      console.log("mongo db hit");
      await redis.set("allCourses", JSON.stringify(course));
      return res.status(200).json({
        success: true,
        course,
      });
    }
  }
);

export const getCourseByUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const userCourseList = req.user?.courses;
    const courseId = req.params.id;
    console.log("CourseId", courseId);
    userCourseList?.map((item) => {
      console.log(item);
    });
    const courseExists = userCourseList?.find(
      (course) => course._id === courseId
    );
    console.log("Test", courseExists);
    if (!courseExists) {
      return next(
        new ErrorHandler("You are eligible to access this course", 400)
      );
    }

    const course = await CourseModel.findById(courseId);

    const content = course?.courseData;
    console.log(content);
    res.status(200).json({
      success: true,
      content,
    });
  }
);

interface IAddQuestionData {
  question: string;
  courseId: string;
  contentId: string;
}

export const addQuestion = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { question, contentId, courseId }: IAddQuestionData = req.body;

      const course = await CourseModel.findById(courseId);

      const courseContent = course?.courseData?.find((item: any) =>
        item._id.equals(contentId)
      );

      if (!courseContent) {
        return next(new ErrorHandler("Content not found", 404));
      }

      const newQuestion: any = {
        user: req.user,
        question,
        questionReplies: [],
      };
      courseContent.questions.push(newQuestion);

      await NotificationModel.create({
        user: req.user?._id,
        title: "New Question Recived",
        message: `${req.user?.name} has asked a question in ${courseContent.title}`,
      });

      await course?.save();

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

interface IAddAnswerData {
  answer: string;
  questionId: string;
  courseId: string;
  contentId: string;
}

export const addAnswer = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { answer, questionId, courseId, contentId }: IAddAnswerData =
      req.body;

    const course = await CourseModel.findById(courseId);

    const courseContent = course?.courseData?.find((item: any) =>
      item._id.equals(contentId)
    );

    if (!courseContent) {
      return next(new ErrorHandler("Content not found", 404));
    }

    const question = courseContent?.questions?.find((item: any) =>
      item._id.equals(questionId)
    );

    if (!question) {
      return next(new ErrorHandler("Question not found", 404));
    }

    const newAnswer: any = {
      user: req.user,
      answer,
    };
    if (!question.questionReplies) {
      question.questionReplies = [];
    }

    question.questionReplies.push(newAnswer);

    await course?.save();

    if (req.user?._id === question.user._id) {
      await NotificationModel.create({
        user: req.user?._id,
        title: "New Question Reply Recived",
        message: `You have reply to new question in ${courseContent.title}`,
      });
    } else {
      const data = {
        name: question.user.name,
        title: courseContent.title,
      };
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/question-rely.ejs"),
        data
      );

      try {
        await sendMail({
          email: question.user.email,
          subject: "Question Reply",
          template: "question-rely.ejs",
          data,
        });
      } catch (err: any) {
        return next(new ErrorHandler(err.message, 500));
      }
    }

    res.status(200).json({ success: true, course });
  }
);

interface IAddReview {
  review: string;
  rating: number;
  courseId: string;
  userId: string;
}

export const addReview = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const userCourseList = req.user?.courses;
    const courseId = req.params.id;

    const courseExist = userCourseList?.some(
      (course: any) => course._id.toString() === courseId.toString()
    );

    if (!courseExist) {
      return next(
        new ErrorHandler("You are not eligible to review this course", 400)
      );
    }

    const course = await CourseModel.findById(courseId);

    const { review, rating } = req.body as IAddReview;

    const reviewData: any = {
      user: req.user,
      comment: review,
      rating,
    };

    course?.reviews.push(reviewData);

    let avg = 0;

    course?.reviews.forEach((rev: any) => {
      avg += rev.rating;
    });

    if (course) {
      course.ratings = avg / course?.reviews.length;
    }

    await course?.save();

    const notification = {
      title: "New Review Recived",
      message: `${req.user?.name} has given review in ${course?.name}`,
    };

    res.status(200).json({
      success: true,
      course,
    });
  }
);

interface IAddReviewData {
  comment: string;
  courseId: string;
  reviewId: string;
}

export const addReplyToReview = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { comment, courseId, reviewId } = req.body as IAddReviewData;

    const course = await CourseModel.findById(courseId);

    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }

    const review = course?.reviews.find(
      (rev: any) => rev._id.toString() === reviewId
    );

    if (!review) {
      return next(new ErrorHandler("Review not found", 404));
    }

    const replyData: any = {
      user: req.user,
      comment,
    };

    if (!review.commentReplies) {
      review.commentReplies = [];
    }
    review.commentReplies.push(replyData);

    await course?.save();

    res.status(200).json({
      success: true,
      course,
    });
  }
);

export const getAllCourses = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    getAllCoursesService(res);
  }
);

export const deleteCourse = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const course = await CourseModel.findById(id);

    if (!course) {
      return next(new ErrorHandler("COurse not found", 404));
    }

    await course.deleteOne({ id });

    await redis.del(id);

    res
      .status(200)
      .json({ sucess: true, message: "COurse deleted successfully" });
  }
);
