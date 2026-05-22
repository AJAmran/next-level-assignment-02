import express from "express";
import { issueController } from "../controllers/issue.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", issueController.getAllIssues);
router.get("/:id", issueController.getSingleIssue);
router.post(
  "/",
  authMiddleware("contributor", "maintainer"),
  issueController.createIssue,
);

router.patch("/:id", authMiddleware("contributor", "maintainer"), issueController.updateIssue);

export const issueRoute = router;
