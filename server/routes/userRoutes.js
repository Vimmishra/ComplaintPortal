import express from "express";
import { rateOfficer, trackComplaint } from "../controllers/userController.js";

const router = express.Router();

router.post("/track",trackComplaint);
router.post("/rateOfficer/:officerId/rate/:complaintId",rateOfficer);


export default router;