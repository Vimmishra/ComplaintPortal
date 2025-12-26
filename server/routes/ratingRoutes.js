import express from "express";
import { employeeRatings, verifyNumber } from "../controllers/ratingController.js";

const router  = express.Router();

router.post("/rate-employee/:empId", employeeRatings);

router.post("/verify-number", verifyNumber)

export default router;