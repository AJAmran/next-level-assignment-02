import type { Request, Response } from "express";
import { authService } from "../services/auth.service";
import sendResponse from "../utils/sendResponse";
import type { IUserResponse } from "../interfaces/user.interface";

const signUpUser = async (req: Request, res: Response) => {
  try {
    const result: IUserResponse = await authService.signUp(req.body);
    console.log(result);
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
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Internal server error",
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.login(req.body);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User logged in successfully",
      data: {
        token: result.accessToken,
        user: result.user,
      },
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 401,
      success: false,
      message: "Invalid email or password",
    });
  }
};

export const authController = {
  signUpUser,
  loginUser,
};
