import type { IUserResponse } from "./user.interface";
declare const IssueType: {
    readonly BUG: "bug";
    readonly FEATURE_REQUEST: "feature_request";
};
export type IssueTypeType = (typeof IssueType)[keyof typeof IssueType];
declare const IssueStatus: {
    readonly OPEN: "open";
    readonly IN_PROGRESS: "in_progress";
    readonly RESOLVED: "resolved";
};
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
    status?: IssueStatusType;
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
export {};
//# sourceMappingURL=issues.interface.d.ts.map