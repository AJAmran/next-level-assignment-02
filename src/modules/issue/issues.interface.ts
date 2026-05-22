import type { IUserResponse } from "../auth/user.interface";

const IssueType = {
  BUG: "bug",
  FEATURE_REQUEST: "feature_request",
} as const;

export type IssueTypeType = (typeof IssueType)[keyof typeof IssueType];

const IssueStatus = {
  OPEN: "open",
  IN_PROGRESS: "in_progress",
  RESOLVED: "resolved",
} as const;

export type IssueStatusType = (typeof IssueStatus)[keyof typeof IssueStatus];

export interface IIssue {
  title: string;
  description: string;
  type: IssueTypeType;
  status: IssueStatusType;
  reporter_id: number;
}

export interface IIssueQueryOptions {
  sort?: "newest" | "oldest";
  type?: IssueTypeType;
  status?: IssueStatusType
}

export interface IFormattedIssue {
  id: number;
  title: string;
  description: string;
  type: string;
  status: string;
  reporter: IUserResponse | null;
  created_at: Date;
  updated_at: Date;
}