/*

import Employee from "../models/Employee.js";

export const employeeRatings = async (req, res) => {
  try {
    const { empId } = req.params;
    const { rating, userId,comment } = req.body;

    if (!empId) {
      return res.status(401).json({ message: "EmpId missing" });
    }

    if (!rating || rating <= 0 || rating > 5) {
      return res.status(401).json({ message: "Invalid rating" });
    }


    const employeeData = await Employee.findOne({ empId });

    if (!employeeData) {
      return res.status(404).json({ message: "Employee not found" });
    }

  
    if (employeeData.ratedBy.includes(userId)) {
      return res.status(400).json({
        message: "You already rated this employee"
      });
    }


    employeeData.totalRatings += rating; 
    employeeData.ratingCount += 1;
    employeeData.ratedBy.push(userId);
     const avgRating = employeeData.totalRatings / employeeData.ratingCount;
     
employeeData.avgRating = avgRating;

employeeData.comments.push(comment)

    await employeeData.save();

   

    return res.status(201).json({
      message: `You rated ${employeeData.name} successfully`,
      avgRating
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "internal server error" });
  }
};
*/





const otpStore = new Map();
import Employee from "../models/Employee.js";
import { sendOtp } from "../helpers/twilio.js";

export const employeeRatings = async (req, res) => {
  try {
    const { empId } = req.params;
    const { rating,comment , number} = req.body;

    if (!empId || !number) {
      return res.status(401).json({ message: "EmpId missing" });
    }

    if (!rating || rating <= 0 || rating > 5) {
      return res.status(401).json({ message: "Invalid rating" });
    }


    const employeeData = await Employee.findOne({ empId });

    if (!employeeData) {
      return res.status(404).json({ message: "Employee not found" });
    }

  
    if (employeeData.ratedBy.includes(number)) {
      return res.status(400).json({
        message: "You already rated this employee"
      });
    }



    const generateOtp = Math.floor(100000 + Math.random() * 900000);

    await sendOtp(number, generateOtp);
    console.log(generateOtp)

    otpStore.set(number,
       {rating,comment,empId: employeeData._id, otp:generateOtp})

   

    return res.status(201).json({
      message: `Your otp generated successfully, Verify your number to rate employee!`,
      
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "internal server error" });
  }
};



export const verifyNumber = async(req,res)=>{
  try{

    const {otp, number} = req.body;
    if(!otp){
      return res.status(401).json({
        message:"otp  required"
      })
    }



    if(!number){
      return res.status(401).json({
        message:"number required"
      })
    }




    const otpData = otpStore.get(number);

    if(parseInt(otpData.otp) !== parseInt(otp)){
      return res.status(401).json({
        message:"otp mismatch!"
      })
    }


    const employee = await Employee.findById(otpData.empId);

    if(!employee){
      return res.status(400).json({
        message:"no employee found!"
      })
    };

employee.totalRatings += otpData.rating;
employee.ratingCount += 1;
 employee.ratedBy.push(number);

 const avgRating = employee.totalRatings / employee.ratingCount.toFixed(2);

employee.avgRating = avgRating;


  

employee.comments.push(otpData.comment);

await employee.save();

return res.status(201).json({
  message:"you have rated employee successfully!"
})

  }

  catch(err){
    console.log(err)
    return res.status(500).json({
      message:"internal server error"
    })
  }
}
