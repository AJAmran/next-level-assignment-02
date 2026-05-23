import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { userRoute } from "./modules/auth/auth.routes";
import { issueRoute } from "./modules/issue/issue.routes";
import cors from "cors";
import envConfig from "./config/env";


const app: Application = express();
app.use(express.json());
const allowedOrigins =
  envConfig.ALLOWED_ORIGINS.length > 0 ? envConfig.ALLOWED_ORIGINS : ["*"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes("*") ||
        allowedOrigins.includes(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Issue Tracker API",
  });
});
app.use("/api/auth", userRoute);
app.use("/api/issues", issueRoute);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
    error: `Cannot find ${req.originalUrl} on this server.`,
  });
});
app.use(globalErrorHandler);
export default app;
