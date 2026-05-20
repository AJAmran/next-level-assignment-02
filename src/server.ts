import app from "./app";
import { initializeDB } from "./config/db";

const port = 5000;
const NODE_ENV = "development";

const main = () => {
  initializeDB();
  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port} in ${NODE_ENV} mode`);
  });
};

main();