require("dotenv").config();
import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "./catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utils/redis";
import { updateAccessToken } from "../controllers/user.controller";

export const isAuthenicated = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.headers["access-token"] as string;

    console.log("ACCESS_TOKEN:-----", access_token);

    if (!access_token) {
      return next(new ErrorHandler("User is not Authenicated", 400));
    }

    const decoded = jwt.decode(access_token) as JwtPayload;
    console.log("Decoded:>>>>>>>   ", decoded);
    if (!decoded) {
      return next(new ErrorHandler("access token is not valid", 400));
    }

    if (decoded.exp && decoded.exp <= Date.now() / 1000) {
      try {
        console.log("Wokring ..... Refresh token");
        updateAccessToken(req, res, next);
      } catch (error) {
        console.log("Not working ..... Refresh token");
        return next(error);
      }
    }

    const user = await redis.get(decoded._id);

    if (!user) {
      return next(new ErrorHandler("user not found", 400));
    }

    req.user = JSON.parse(user);
    next();
  }
);

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || "")) {
      return next(
        new ErrorHandler(
          `Role: ${req.user?.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
