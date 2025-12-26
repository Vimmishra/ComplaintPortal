import express from "express";
import { bulkEmployeeUpload, GovAddEmployee } from "../controllers/govAddEmployee.js";
import {  addProfilePhoto, employeecomments, getEmployeeDetails, sendOtptoEmployee, verifyOtp } from "../controllers/employeeController.js";
import multer from "multer"
const router = express.Router();

const storage = multer.memoryStorage();

const fileUpload = multer({storage})

const upload = multer({ dest: "uploads/" });

router.post("/addGovEmployee", GovAddEmployee);
router.post("/addBulkEmployee",fileUpload.single("file"), bulkEmployeeUpload);
router.post("/send-otp", sendOtptoEmployee);
router.post("/verify-otp", verifyOtp);
router.get("/feedback/:empId", getEmployeeDetails)
router.patch("/uploadImage", upload.single("image"), addProfilePhoto  );
router.get("/employeeComments/:empId", employeecomments)


export default router;