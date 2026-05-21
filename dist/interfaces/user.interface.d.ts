export declare const UserRole: {
    readonly CONTRIBUTOR: "contributor";
    readonly MAINTAINER: "maintainer";
};
export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];
export interface IUser {
    name: string;
    email: string;
    password: string;
    role?: UserRoleType;
}
export type IUserResponse = Omit<IUser, "password"> & {
    id: number;
    created_at?: Date;
    updated_at?: Date;
};
//# sourceMappingURL=user.interface.d.ts.map