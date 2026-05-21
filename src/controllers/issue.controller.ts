import type { NextFunction, Request, Response } from "express";
import { issueService } from "../services/issue.service";
import { ApiError } from "../utils/ApiError";
import sendResponse from "../utils/sendResponse";

const createIssue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reporter_id = req.user?.id;
    if (!reporter_id) {
      throw new ApiError(401, "Unauthorized");
    }
    const result = await issueService.createIssueIntoDB({
      ...req.body,
      reporter_id,
    });

    if (!result.rows || result.rows.length === 0) {
      throw new ApiError(400, "Issue creation failed");
    }

    // console.log(result);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Issue created successfully",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

const getAllIssues = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await issueService.getAllIsueFromDB();
    if (!result || result.length === 0) {
      throw new ApiError(404, "No issues found");
    }
    sendResponse(res, {
      statusCode: 200,
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const issueController = {
  createIssue,
  getAllIssues,
};
