import type { SignOptions } from "jsonwebtoken";
declare const envConfig: {
    CONNECTION_STRING: string;
    PORT: string | number;
    NODE_ENV: string;
    JWT_SECRET_KEY: string;
    JWT_EXPIRES_IN: NonNullable<SignOptions["expiresIn"]>;
    BCRYPT_SALT_ROUNDS: string;
};
export default envConfig;
//# sourceMappingURL=env.d.ts.map