import dotenv from "dotenv";
dotenv.config();
import { env } from "process";
const envConfig = {
    CONNECTION_STRING: env.CONNECTION_STRING,
    PORT: env.PORT || 5000,
    NODE_ENV: env.NODE_ENV || "development",
    JWT_SECRET_KEY: env.JWT_SECRET_KEY,
    JWT_EXPIRES_IN: (env.JWT_EXPIRES_IN || "1d"),
    BCRYPT_SALT_ROUNDS: env.BCRYPT_SALT_ROUNDS,
};
export default envConfig;
//# sourceMappingURL=env.js.map