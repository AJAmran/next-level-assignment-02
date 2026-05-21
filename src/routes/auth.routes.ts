import express from "express";
import { authController } from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", authController.signUpUser);
router.post("/login", authController.loginUser);

export const userRoute = router;
