import express, { type Application } from "express";

const app: Application = express();
const port = 5000;
const NODE_ENV = "development";
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port} in ${NODE_ENV} mode`);
});
