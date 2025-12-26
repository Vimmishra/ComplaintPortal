
import { sendOtp } from "../helpers/twilio.js";
import Employee from "../models/Employee.js";
import govEmployee from "../models/govEmployee.js";
import QRCode from "qrcode";
import jwt from "jsonwebtoken";
import { uploadMediaToCloudinary } from "../helpers/cloudinary.js";

const otpStore = new Map();

const jwtSign = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const sendOtptoEmployee = async (req, res) => {
  try {
    const { empId} = req.body;

    if (!empId) {
      return res.status(401).json({ message: "please enter empId" });
    }

    const employeeData = await govEmployee.findOne({ empId });

    if (!employeeData) {
      return res.status(401).json({
        message: "no empId found in government record!",
      });
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000);

    otpStore.set(empId, {
      name: employeeData.name,
      email:employeeData.email,
      designation: employeeData.designation,
      department: employeeData.department,
      phone: employeeData.phone,
      otp: generatedOtp,
      city:employeeData.city
    });

    await sendOtp(employeeData.phone, generatedOtp);

    return res.status(200).json({ message: "otp sent successfully!" });
  } catch (err) {
    console.log(err);
  }
};



export const verifyOtp = async (req, res) => {
  try {
    const { empId, otp } = req.body;

    if (!empId || !otp) {
      return res.status(401).json({ message: "please provide otp and empId" });
    }

    const otpData = otpStore.get(empId);

    if (!otpData) {
      return res.status(401).json({ message: "OTP expired or not found" });
    }

    if (parseInt(otp) !== otpData.otp) {
      return res.status(401).json({ message: "otp not matched" });
    }

    // Check if employee already exists
    let employee = await Employee.findOne({ empId });

    if (!employee) {
      // REGISTER FLOW
      const complaintPageUrl = `${process.env.FRONTEND_URL}/feedback/${empId}`;
      const qrCodeImage = await QRCode.toDataURL(complaintPageUrl);

      employee = new Employee({
        empId,
        name: otpData.name,
        designation: otpData.designation,
        department: otpData.department,
        phone: otpData.phone,
        qrCode: qrCodeImage,
        isVerify: true,
        city: otpData.city,
      });

      await employee.save();
    } else {
      // LOGIN FLOW
     
      employee.name = otpData.name;
      employee.designation = otpData.designation;
      employee.department = otpData.department;
      employee.phone = otpData.phone;
      employee.city = otpData.city;
      employee.isVerify = true;

      await employee.save();
    }

    // OTP used → remove from memory
    otpStore.delete(empId);

    // Generate auth token
    const token = jwtSign(employee._id);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    return res.status(200).json({
      message: employee ? "Logged in successfully" : "Employee registered successfully",
      user:employee,
      token,
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "server error", error: err.message });
  }
};





export const getEmployeeDetails = async(req,res)=>{
  try{

    const {empId} = req.params;

    const employeeDetails = await Employee.findOne({empId});

    if(!employeeDetails){
      return res.status(401).json({
        message:"error while fetching employee details!"
      })
    }

    return res.status(200).json({
      message:"employee details fetched successfully!",
      employee:employeeDetails
    })



  }

  catch(err){
    console.log(err)

    return res.status(500).json({
      message:"internal server error!"
    })

      
    
  }
}





export const getTopRatedEmployee = async(req,res)=>{
  try{

    const topEmployees = Employee.find({avgRating: {$gte:4}});

    if(!topEmployees){
      console.log("no employees found with greater than 4 ratings!");
      return res.status(401).json({
        message:"no topp rated employees found!"
      })
    }


    return res.status(200).json({
      message:"found top rated employees!",
      topEmployees: topEmployees
    })

  }

  catch(err){
    console.log(err)
    return res.status(500).json({
      message:"intewrnal server error"
    })
  }
}




export const addProfilePhoto = async(req,res)=>{
  try{

    const {Id} = req.body;

    const file = req.file;

    const uploadImage = await uploadMediaToCloudinary(file.path,"image");

    const imageUrl = uploadImage.secure_url


    const updateEmployee = await Employee.findByIdAndUpdate(Id, {imageUrl:imageUrl}, {new:true})
    console.log("Cloudinary upload result:", uploadImage);

    if(!updateEmployee){
      console.log("did not add image")
      return res.status(401).json({
        message:"error while adding image"
      })
    }


    return res.status(201).json({
      message:"image uploaded successfully!",
       employee: updateEmployee
    })


  }

  catch(err){
    console.log(err)
    return res.status(500).json({
      message:"internal server error!"
    })
  }
}




export const employeecomments = async(req,res)=>{
  try{

    const {empId} = req.params;

    if(!empId){
      return res.status(401).json({
        message:"Employee is not registred!"
      })
    }


    const employeeComments = await Employee.findById(empId);

    if(!employeeComments){
      return res.status(404).json({
        message:"no commnents found for this employee!"
      })
    }


    return res.status(200).json({
      message:"comments fetched successfully!",
      comments: employeeComments.comments,
      avgRating: employeeComments.avgRating,
      totalRatings: employeeComments.totalRatings
    })

  }

  catch(err){
    console.log(err)
    return res.status(500).json({
      message:"internal server error!"
    })
  }
}