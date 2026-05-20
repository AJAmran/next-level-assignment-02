import type { Request, Response } from "express";
import { authService } from "../services/auth.service";
import sendResponse from "../utils/sendResponse";

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.signUp(req.body);
    console.log(result);
    if (result.rows.length > 0) {
      sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "User registered successfully",
        data: result.rows[0],
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

export const authController = {
  loginUser,
};
