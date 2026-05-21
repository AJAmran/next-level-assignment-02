import type { IIssue, IIssueQueryOptions } from "../interfaces/issues.interface";
export declare const issueService: {
    createIssueIntoDB: (payload: IIssue) => Promise<import("pg").QueryResult<any>>;
    getAllIsueFromDB: (options: IIssueQueryOptions) => Promise<{
        id: any;
        title: any;
        description: any;
        type: any;
        status: any;
        reporter: any;
        created_at: any;
        updated_at: any;
    }[]>;
};
//# sourceMappingURL=issue.service.d.ts.map