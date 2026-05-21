import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import envConfig from "../config/env";
import type { UserRoleType } from "../interfaces/user.interface";
import { pool } from "../config/db";
import { ApiError } from "../utils/ApiError";

export const authMiddleware = (...roles: UserRoleType[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new ApiError(401, "Unauthorized access !!!");
      }

      const decodedUser = jwt.verify(
        token,
        envConfig.JWT_SECRET_KEY as string,
      ) as JwtPayload;

      // find user into database
      const findUser = await pool.query(`SELECT * FROM users WHERE id = $1`, [
        decodedUser.id,
      ]);

      if (findUser.rows.length === 0) {
        throw new ApiError(401, "Unauthorized access !!!");
      }

      if (!roles.includes(findUser.rows[0].role)) {
        throw new ApiError(403, "Forbidden access !!!");
      }
      req.user = decodedUser;

      next();
    } catch (error) {
      next(error);
    }
  };
};
