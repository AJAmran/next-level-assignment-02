import express, {} from "express";
import { userRoute } from "./routes/auth.routes";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { issueRoute } from "./routes/issue.routes";
const app = express();
app.use(express.json());
app.use("/api/auth", userRoute);
app.use("/api/issues", issueRoute);
app.use(globalErrorHandler);
export default app;
//# sourceMappingURL=app.js.map