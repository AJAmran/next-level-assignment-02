import app from "./app";
import { initializeDB } from "./config/db";
import envConfig from "./config/env";

const main = () => {
  initializeDB();
  app.listen(envConfig.PORT, () => {
    console.log(
      `🚀 Server running on port ${envConfig.PORT} in ${envConfig.NODE_ENV} mode`,
    );
  });
};

main();
