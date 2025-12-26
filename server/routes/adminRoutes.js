import express from "express";
import { allResolvedComplaints, assignComplaintToOfficer, complaintVerifiedByAdmin, deleteComplaintByAdmin, getAllAnalytics } from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.patch("/verifyComplaint/:complaintId", complaintVerifiedByAdmin);

router.delete("/deleteComplaint/:complaintId" ,deleteComplaintByAdmin);

router.post("/assignComplaint/:complaintId" ,assignComplaintToOfficer);

router.get("/stats", getAllAnalytics);

router.get("/resolvedComplaints", allResolvedComplaints)


export default router;