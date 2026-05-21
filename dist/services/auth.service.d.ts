import type { IUser } from "../interfaces/user.interface";
export declare const authService: {
    signUp: (payload: IUser) => Promise<any>;
    login: (payload: {
        email: string;
        password: string;
    }) => Promise<{
        accessToken: string;
        user: any;
    }>;
};
//# sourceMappingURL=auth.service.d.ts.map