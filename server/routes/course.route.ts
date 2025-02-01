import express from "express";
import { authorizeRoles, isAuthenicated } from "../middleware/auth";
import {
  addAnswer,
  addQuestion,
  addReplyToReview,
  addReview,
  deleteCourse,
  editCourse,
  getAllCourse,
  getAllCourses,
  getCourseByUser,
  getSingleCourse,
  uploadCourse,
} from "../controllers/course.controller";
const courseRouter = express.Router();

courseRouter.post(
  "/create-course",
  isAuthenicated,
  authorizeRoles("admin"),
  uploadCourse
);

courseRouter.put(
  "/edit-course/:id",
  isAuthenicated,
  authorizeRoles("admin"),
  editCourse
);

courseRouter.get("/get-course/:id", getSingleCourse);
courseRouter.get("/get-Allcourse/:id", getAllCourse);
courseRouter.get("/get-courses", getAllCourse);
courseRouter.get("/get-course-content/:id", isAuthenicated, getCourseByUser);
courseRouter.put("/add-question", isAuthenicated, addQuestion);
courseRouter.put("/add-answer", isAuthenicated, addAnswer);
courseRouter.put("/add-review/:id", isAuthenicated, addReview);
courseRouter.put(
  "/add-reply",
  isAuthenicated,
  authorizeRoles("admin"),
  addReplyToReview
);
courseRouter.get(
  "/get-all-courses",
  isAuthenicated,
  authorizeRoles("admin"),
  getAllCourses
);

courseRouter.delete(
  "/delete-course/:id",
  isAuthenicated,
  authorizeRoles("admin"),
  deleteCourse
);
export default courseRouter;
