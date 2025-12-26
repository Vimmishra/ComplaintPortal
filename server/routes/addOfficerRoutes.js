import express from "express";
import { addBulkOfficer, averageResolveTime, getAllComplaints, getallOfficers, getNotification, getResolvedComplaints, getUnreadNotificationCount, markAllAsRead, markComplaintAsResolved, officerRegister, registerOfficerByGov,  signInVerify, statusUpdate, verifyOtp } from "../controllers/officerController.js";

const router = express.Router();

router.post("/registerbyGov", registerOfficerByGov);
router.post("/registerOfficer", officerRegister);
router.post("/verify-officer", verifyOtp);
router.get("/allofficers", getallOfficers);
router.get("/complaints/:officerId", getAllComplaints)
router.patch("/updateStatus/:complaintId", statusUpdate);
router.patch("/resolved/:complaintId/:officerId", markComplaintAsResolved);
router.post("/bulkofficer", addBulkOfficer);
router.get("/notification/:officerId", getNotification);
router.get("/notification-count/:officerId", getUnreadNotificationCount);
router.patch("/mark-read/:officerId", markAllAsRead);
router.get("/resolvedComplaints/:officerId", getResolvedComplaints);

router.post("/signInVerify", signInVerify);
router.get("/avgResolveTime/:officerId", averageResolveTime);


export default router; 