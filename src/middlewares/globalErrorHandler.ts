import type { ErrorRequestHandler } from "express";
import envConfig from "../config/env";
import sendResponse from "../utils/sendResponse";

export const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next,
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Unauthorized: Invalid token, please login again";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Unauthorized: Token has expired, please renew your token";
  }

  if (err.code) {
    if (err.code === "23505") {
      statusCode = 400;
      message =
        err.detail ||
        "Duplicate entry: A record with this value already exists";
    } else if (err.code === "23514") {
      statusCode = 400;
      message =
        "Bad Request: Provided data violates field constraints";
    } else if (err.code === "23503") {
      statusCode = 400;
      message =
        "Bad Request: Referenced relation or parent record does not exist";
    } else if (err.code === "23502") {
      statusCode = 400;
      message = `Bad Request: Missing required field (${err.column || "unknown column"
        })`;
    }
  }

  console.error("Global Error Handler:", {
    name: err.name,
    message: err.message,
    stack: envConfig.NODE_ENV === "development" ? err.stack : undefined,
  });

  sendResponse(res, {
    statusCode,
    success: false,
    message,
    errors: err,
  });
};
