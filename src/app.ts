import express, { type Application } from "express";
import { userRoute } from "./routes/auth.routes";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";

const app: Application = express();
app.use(express.json());

app.use("/api/auth", userRoute);



app.use(globalErrorHandler);
export default app;
