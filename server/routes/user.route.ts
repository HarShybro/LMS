import express from "express";
import {
  activateUser,
  deleteUser,
  getAllUsers,
  getUserInfo,
  loginUser,
  logoutUser,
  registrationUser,
  socialAuth,
  updateAccessToken,
  UpdateAvatar,
  updatePassword,
  updateUserInfo,
  updateUserRole,
} from "../controllers/user.controller";
import { authorizeRoles, isAuthenicated } from "../middleware/auth";
import { getAllUsersService } from "../services/user.service";

const userRouter = express.Router();

userRouter.post("/registration", registrationUser);
userRouter.post("/activation-user", activateUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", isAuthenicated, logoutUser);
userRouter.get("/refreshtoken", updateAccessToken);
userRouter.get("/me", isAuthenicated, getUserInfo);
userRouter.post("/social-auth", socialAuth);
userRouter.put("/update-user-info", isAuthenicated, updateUserInfo);
userRouter.put("/update-user-password", isAuthenicated, updatePassword);
userRouter.put("/update-user-avatar", isAuthenicated, UpdateAvatar);
userRouter.get(
  "/get-all-users",
  isAuthenicated,
  authorizeRoles("admin"),
  getAllUsers
);

userRouter.put(
  "/update-user-role",
  isAuthenicated,
  authorizeRoles("admin"),
  updateUserRole
);

userRouter.delete(
  "/delete-user/:id",
  isAuthenicated,
  authorizeRoles("admin"),
  deleteUser
);
export default userRouter;
