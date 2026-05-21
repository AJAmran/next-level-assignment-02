import dotenv from "dotenv";
import type { SignOptions } from "jsonwebtoken";
dotenv.config();

import { env } from "process";

const envConfig = {
  CONNECTION_STRING: env.CONNECTION_STRING as string,
  PORT: env.PORT || 5000,
  NODE_ENV: env.NODE_ENV || "development",
  JWT_SECRET_KEY: env.JWT_SECRET_KEY as string,
  JWT_EXPIRES_IN: (env.JWT_EXPIRES_IN || "1d") as NonNullable<
    SignOptions["expiresIn"]
  >,
  BCRYPT_SALT_ROUNDS: env.BCRYPT_SALT_ROUNDS as string,
};

export default envConfig;
