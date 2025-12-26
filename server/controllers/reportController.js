// controllers/reportController.js
import XLSX from "xlsx";
import Employee from "../models/Employee.js";

import { sendYearlyIncentiveReportToAdmin } from "../helpers/nodemailer.js";
import User from "../models/User.js";
import { uploadToGCS } from "../helpers/gcsUploader.js";

export const generateYearlyExcel = async () => {
  try {


    const admin = User.find({role:"admin"});
  
    const employees = await Employee.find().lean();

    if (!employees.length) {
      console.log("No employees found, skipping report.");
      return;
    }

    // 2️⃣ Convert data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(employees);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");

    // 3️⃣ Generate buffer
    const excelBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    // 4️⃣ File name
    const fileName = `employee_report_${new Date().getFullYear()}.xlsx`;

    // 5️⃣ Upload to Google Cloud Storage
    const fileURL = await uploadToGCS(excelBuffer, fileName);

    // 6️⃣ Send email to admin
    await sendYearlyIncentiveReportToAdmin(fileURL,admin.email);

    console.log("✅ Yearly report generated, uploaded, and emailed to admin!");

  } catch (err) {
    console.error("❌ Error generating yearly report:", err);
  }
};
