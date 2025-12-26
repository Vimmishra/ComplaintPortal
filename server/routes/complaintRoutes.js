import express from "express";
import multer from "multer";
import { formComplaint, getAllComplaints, updateState, UserCompalint,verifyComplaintOtp, verifyFormComplaint } from "../controllers/complaintController.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" }); // OR your custom multer config

router.post(
  "/complaint/:empId",
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "video", maxCount: 1 },
  ]),
  UserCompalint
);


router.post("/verify-otp", verifyComplaintOtp)


router.get("/allComplaints", getAllComplaints);
router.post("/updateComplaint/:complaintId", updateState);


router.post("/formComplaint/",
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "video", maxCount: 1 },
  ]), formComplaint);

router.post("/verify-otp", verifyFormComplaint)

export default router;

