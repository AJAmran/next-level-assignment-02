import type { NextFunction, Request, Response } from "express";
import type { UserRoleType } from "../interfaces/user.interface";
export declare const authMiddleware: (...roles: UserRoleType[]) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.middleware.d.ts.map