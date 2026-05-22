import type { NextFunction, Request, Response } from "express";
import { authService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";
import type { IUserResponse } from "./user.interface";

const signUpUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result: IUserResponse = await authService.signUp(req.body);
    if (result) {
      sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "User registered successfully",
        data: result,
      });
    } else {
      sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "User creation failed",
      });
    }
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.login(req.body);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Login successful",
      data: {
        token: result.accessToken,
        user: result.user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const authController = {
  signUpUser,
  loginUser,
};
