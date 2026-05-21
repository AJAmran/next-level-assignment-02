import type { NextFunction, Request, Response } from "express";
import sendResponse from "../utils/sendResponse";
import jwt, { type JwtPayload } from "jsonwebtoken";
import envConfig from "../config/env";
import type { UserRoleType } from "../interfaces/user.interface";
import { pool } from "../config/db";

export const authMiddleware = (...roles: UserRoleType[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return sendResponse(res, {
          statusCode: 401,
          success: false,
          message: "Unauthorized access !!!",
        });
      }

      const decodedToken = jwt.verify(
        token,
        envConfig.JWT_SECRET_KEY as string,
      ) as JwtPayload;

      // find user into database
      const findUser = await pool.query(`SELECT * FROM users WHERE id = $1`, [
        decodedToken.id,
      ]);

      if (findUser.rows.length === 0) {
        return sendResponse(res, {
          statusCode: 401,
          success: false,
          message: "Unauthorized access !!!",
        });
      }

      if (!roles.includes(findUser.rows[0].role)) {
        return sendResponse(res, {
          statusCode: 403,
          success: false,
          message: "Forbidden access !!!",
        });
      }
      next();
    } catch (error) {
      return sendResponse(res, {
        statusCode: 500,
        success: false,
        message: "Internal server error !!!",
      });
    }
  };
};
