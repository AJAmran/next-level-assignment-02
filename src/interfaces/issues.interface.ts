const IssueType = {
  BUG: "bug",
  FEATURE_REQUEST: "feature_request",
} as const;

export type IssueTypeType = (typeof IssueType)[keyof typeof IssueType];

const IssueStatus = {
  OPEN: "open",
  IN_PROGRESS: "in_progress",
  resolved: "resolved",
} as const;

export type IssueStatusType = (typeof IssueStatus)[keyof typeof IssueStatus];

export interface IIssue {
  title: string;
  description: string;
  type: IssueTypeType;
  status: IssueStatusType;
  reporter_id: string;
}
