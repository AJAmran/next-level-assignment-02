import express, { type Application } from "express";
import { userRoute } from "./routes/auth.routes";

const app: Application = express();
app.use(express.json());

app.use("/api/auth", userRoute);

export default app;
