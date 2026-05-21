import express from "express";
import { authController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/signup", authController.signUpUser);
router.post("/login", authController.loginUser);
//test route for protected route

router.get("/test", authMiddleware("contributor"));

export const userRoute = router;
