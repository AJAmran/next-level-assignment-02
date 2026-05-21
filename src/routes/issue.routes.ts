import express from "express";
import { issueController } from "../controllers/issue.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", issueController.getAllIssues);
router.post(
  "/",
  authMiddleware("contributor", "maintainer"),
  issueController.createIssue,
);

export const issueRoute = router;
