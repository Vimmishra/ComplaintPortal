import express from "express";
import { allUsers, checkAuth, logout, register, signIn, verifyOtp } from "../controllers/authController.js";

const router = express.Router();

router.post("/signUp", register);
router.post("/signIn",signIn);
router.post("/verify-otp",verifyOtp);
router.get("/checkAuth", checkAuth);
router.get("/allUsers", allUsers);

router.post("/logout", logout)

export default router;