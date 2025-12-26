import govEmployee from "../models/govEmployee.js";
import XLSX from "xlsx";


export const GovAddEmployee = async (req, res) => {
  console.log("➡️ GovAddEmployee API called");

  try {
    console.log("📥 Request Body:", req.body);

    const { name, email, department, designation, empId, phone, city } = req.body;

    // Validation check
    if (!name || !email || !department || !designation || !empId || !phone || !city) {
      console.log("❌ Missing required fields");
      return res.status(401).json({
        message: "please fill out all fields",
      });
    }

    console.log("🔍 Checking if employee already exists with empId:", empId);

    const employee = await govEmployee.findOne({ empId: empId });

    console.log("👤 Existing Employee Found:", employee);

    if (employee) {
      console.log("⚠️ Employee already registered");
      return res.status(401).json({
        message: "employee already registered!",
      });
    }

    console.log("🆕 Creating new government employee");

    const newGovEmployee = new govEmployee({
      name,
      email,
      department,
      designation,
      phone,
      empId,
      city,
    });

    await newGovEmployee.save();

    console.log("✅ Employee saved successfully:", newGovEmployee);

    return res.status(200).json({
      message: "employee added successfully!",
      govemployee: newGovEmployee,
    });

  } catch (error) {
    console.error("🔥 Error in GovAddEmployee:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};






export const bulkEmployeeUpload = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const jsonData = XLSX.utils.sheet_to_json(worksheet);


    const employees = jsonData.map((row) => ({
      empId: row.empId,
      email: row.email,
      name: row.name,
      designation: row.designation,
      department: row.department,
      phone: row.phone || "",
      city: row.city || "",
    }));

    
    await govEmployee.insertMany(employees);

    res.status(200).json({ message: "Employees uploaded successfully", count: employees.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


