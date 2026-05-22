import express from "express";
import { issueController } from "./issue.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = express.Router();

router.get("/", issueController.getAllIssues);
router.get("/:id", issueController.getSingleIssue);
router.post(
  "/",
  authMiddleware("contributor", "maintainer"),
  issueController.createIssue,
);

router.patch(
  "/:id",
  authMiddleware("contributor", "maintainer"),
  issueController.updateIssue,
);
router.delete(
  "/:id",
  authMiddleware("maintainer"),
  issueController.deleteIssue,
);

export const issueRoute = router;
