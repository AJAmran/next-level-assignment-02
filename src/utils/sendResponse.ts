import type { Response } from "express";

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  data?: T;
  errors?: unknown;
};

const sendResponse = <T>(res: Response, payload: TResponse<T>) => {
  const responseBody: Record<string, unknown> = {
    success: payload.success,
  };

  if (payload.message !== undefined) {
    responseBody.message = payload.message;
  }

  if (payload.data !== undefined) {
    responseBody.data = payload.data;
  }

  if (payload.errors !== undefined) {
    responseBody.errors = payload.errors;
  }

  res.status(payload.statusCode).json(responseBody);
};

export default sendResponse;