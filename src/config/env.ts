import dotenv from "dotenv";
dotenv.config();

import { env } from "process";

const envConfig = {
  CONNECTION_STRING: env.CONNECTION_STRING as string,
  PORT: env.PORT || 5000,
  NODE_ENV: env.NODE_ENV || "development",
  JWT_SECRET_KEY: env.JWT_SECRET_KEY,
};

export default envConfig;
