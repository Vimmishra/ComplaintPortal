import { sendOtp, sendResolvedMessage } from "../helpers/twilio.js";
import Complaint from "../models/Complaint.js";
import Employee from "../models/Employee.js";
import Message from "../models/Message.js";
import Officer from "../models/Officer.js";
import jwt from "jsonwebtoken";
import XLSX from "xlsx"


export const registerOfficerByGov = async (req,res)=>{

    try{
    const {name,email,phone,officerId,city,department} = req.body;

    if(!name || !email || !phone || !officerId || !department || !city){
        return res.status(401).json({
            message:"all fields are required!"
        })
    }


    const existing = await Officer.findOne({officerId});
 

    if(existing){
        return res.status(401).json({
            message:"officer already regitered !"
        })
    }

    

    const addOfficer = new Officer({ name,officerId,email,phone,city,department});

    await addOfficer.save();
    return res.status(201).json({
        message:"officer added successfully"
    })
    }


    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"internal server error!"
        })
    }

}



const jwtSign = (id)=>{

    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn:"7d"})

}

let otpStore = new Map()





export const getallOfficers = async(req,res)=>{
    try{


        const officers = await Officer.find();

        if(!officers){
            return res.status(401).json({
                message:"no officers found!"
            })
        }


        return res.status(200).json({
            message:"all officers fetched successfully!",
            officers: officers
        })

    }


    catch(err){
        console.log(err)
        return res.status(500).json({
            message:"internal server error"
        })
    }
}




export const getAllComplaints = async(req,res)=>{
    try{

        const {officerId} = req.params

        const complaints = await Officer.findById(officerId).populate({path: "complaints",
            match:{status :{$ne: "Resolved"}}
        } );

        console.log(complaints)

        if(!complaints){
            console.log("no complaints found")
            return res.status(404).json({
                message:"no complaints found in database for this officer"
            })

        }



        return res.status(200).json({
            message:"complaints fetched successfylly!",
            complaints:complaints
        })


    }

    catch(err){
        console.log(err)
        return res.status(500).json({
            message:"internal server error!"
        })
    }
}





export const statusUpdate = async (req,res)=>{
    try{

        const {complaintId} = req.params

        const updateStatus = await Complaint.findByIdAndUpdate(complaintId, {status: "In Progress"}, {new : true});

        if(!updateStatus){
            return res.status(404).json({
                message:"no complaint found"
            })
        }

       return res.status(200).json({
        message:"status updated successfully!"
       })



    }

    catch(err){
        console.log(err)
        return res.status(500).json({
            message:"internal server error"
        })
    }
}





export const markComplaintAsResolved = async(req,res)=>{
    try{

        const {complaintId} = req.params;

        const {remarks} = req.body;

        const {officerId} = req.params;

        const officer = await Officer.findById(officerId);

        const updateComplaint = await Complaint.findOneAndUpdate({_id: complaintId},
             {status:"Resolved", resolvedBy: officer._id,resolved:true, remarks:remarks},
              {new:true});


              if(!updateComplaint){
                return res.status(401).json({
                    message:"something went wrong while updating to resolved!"
                })
              } 



              const employee = await Employee.findOne({empId: updateComplaint.empId});

              employee.activeComplaints = employee.activeComplaints.filter( id => id.toString() !== updateComplaint._id);

              await employee.save()

              officer.complaintsResolved += 1;
              officer.resolvedComplaints.push(complaintId)
              officer.assignedComplaints -= 1
             officer.complaints = officer.complaints.filter( 
  id => id.toString() !== updateComplaint._id.toString()
);

               await officer.save()


await sendResolvedMessage(officer.phone, complaintId, `${process.env.FRONTEND_URL}/rateOfficer/${officer._id}/rate/${complaintId}`);

              return res.status(200).json({
                message:"complaint updated to resolved successfully!",
                complaint:updateComplaint
              })



    }

    catch(err){
        console.log(err);

        return res.status(500).json({
            message:"internal server error"
        })
    }
}



export const addBulkOfficer = async(req,res)=>{
    try{

        const {file} = req.file;

        if(!file){
            return res.status(401).json({
                message:"no file found!"
            })
        }

        const workbook  = XLSX.read(file.buffer , {type: "buffer"});
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName]


        const json_data = XLSX.utils.sheet_to_json(worksheet);


        const officers = json_data.map((row)=>({
             officerId: row.officerId,
      name: row.name,
      designation: row.designation,
      department: row.department,
      phone: row.phone || "",
      city: row.city || "",

        }))


        await Officer.insertMany(officers);


        return res.status(200).json({
            message:`Officers added successfully!`, count: officers.length
        })


    }

    catch(err){
        console.log(err)
        return res.status(500).json({
            message:"internal server error!"
        })
    }
}




export const getNotification = async(req,res)=>{
    try{

        const {officerId} = req.params

        const messages = await Message.find({recieverId: officerId}).lean().sort({createdAt:-1});

        if(!messages){
            return res.status(401).json({
                message:"no messages found!"
            })
        }

        return res.status(200).json({
            message:"fetched all messages!",
            messages:messages
        })

    }

    catch(err){
        console.log(err)
        return res.status(500).json({
            message:"internal server error"
        })
    }
}




//notification
export const getUnreadNotificationCount = async (req, res) => {
  try {
    const { officerId } = req.params;

    const count = await Message.countDocuments({
      recieverId: officerId,
      isRead: false,
    });

    res.status(200).json({ count });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


//mark as read:
export const markAllAsRead = async (req, res) => {
  try {
    const { officerId } = req.params;

    await Message.updateMany(
      { recieverId: officerId, isRead: false },
      { $set: { isRead: true } }
    );

    // Emit to officer's room to reset badge live
    const io = req.app.get("io");
    io.to(officerId).emit("notificationsRead");

    res.status(200).json({ message: "All marked as read" });
  } catch (error) {
    console.log("Error marking read:", error);
    res.status(500).json({ message: "Server error" });
  }
};




export const getResolvedComplaints = async(req,res)=>{
    try{

        const {officerId}  =req.params;

        if(!officerId){
            return res.status(401).json({
                message:"officer id not found "
            })
        }


        const officerResolvedComplaints = await Officer.findById(officerId).populate("resolvedComplaints");

        if(!officerResolvedComplaints){
            return res.status(400).json({
                message:"You have not resolved any complaints yet!"
            })
        }


        return res.status(200).json({
            message:"resolved complaints fetched successfully!",
            resolvedComplaints:officerResolvedComplaints
        })


    }


    catch(err){
        console.log(err)
            return res.status(500).json({
                message:"internal server error!"
            })
        
    }
}







const signOtpStore = new Map();

// ================= OFFICER REGISTER =================
export const officerRegister = async (req, res) => {
  try {
    const { officerId } = req.body;
    console.log("➡️ officerRegister called");
    console.log("📥 officerId:", officerId);

    if (!officerId) {
      console.log("❌ officerId missing");
      return res.status(401).json({ message: "please enter officerId" });
    }

    const existing = await Officer.findOne({ officerId });
    console.log("👮 Existing officer:", existing);

    if (!existing) {
      console.log("❌ Officer not found in DB");
      return res.status(401).json({
        message: "cannot find officerID or not registered",
      });
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000);
    console.log("🔐 Generated OTP:", generatedOtp);

    await sendOtp(existing.phone, generatedOtp);
    console.log("📲 OTP sent to phone:", existing.phone);

    if (existing.isVerified) {
      signOtpStore.set(officerId, { otp: generatedOtp });
      console.log("✅ Stored OTP in signOtpStore:", signOtpStore.get(officerId));
    } else {
      otpStore.set(officerId, {
        otp: generatedOtp,
        name: existing.name,
        email: existing.email,
        city: existing.city,
        department: existing.department,
      });
      console.log("🆕 Stored OTP in otpStore:", otpStore.get(officerId));
    }

    return res.status(201).json({ message: "OTP sent successfully",  isVerified: existing.isVerified, });
  } catch (err) {
    console.log("🔥 officerRegister error:", err);
    return res.status(500).json({ message: "internal server error!" });
  }
};

// ================= SIGN-IN VERIFY =================
export const signInVerify = async (req, res) => {
  try {
    const { officerId, otp } = req.body;


    if (!officerId || !otp) {

      return res.status(404).json({ message: "all fields not found!" });
    }

    const existingofficer = await Officer.findOne({ officerId });
  

    if (!existingofficer) {
    
      return res.status(404).json({ message: "Officer not found" });
    }

    const otpData = signOtpStore.get(officerId);
   
    if (!otpData) {
   
      return res.status(401).json({ message: "OTP expired or invalid" });
    }

   
    if (parseInt(otp) !== parseInt(otpData.otp)) {
    
      return res.status(401).json({ message: "otp mismatched!" });
    }

    signOtpStore.delete(officerId);
 

    const token = jwtSign(existingofficer._id);
    console.log("🔑 JWT generated");

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(201).json({
      message: "signedIn successfully!",
      user: existingofficer,
      token,
    });
  } catch (err) {
    console.log("🔥 signInVerify error:", err);
    return res.status(500).json({ message: "internal server error!" });
  }
};

// ================= FIRST-TIME VERIFY =================
export const verifyOtp = async (req, res) => {
  try {
    const { officerId, otp } = req.body;
    console.log("➡️ verifyOtp called");
    console.log("📥 officerId:", officerId);
    console.log("📥 OTP received:", otp);

    if (!officerId || !otp) {
      console.log("❌ Missing officerId or OTP");
      return res.status(401).json({ message: "officerId or otp missing" });
    }

    const otpData = otpStore.get(officerId);
    console.log("📦 OTP from otpStore:", otpData);

    if (!otpData) {
      console.log("❌ No OTP found in otpStore");
      return res.status(401).json({ message: "OTP expired or invalid" });
    }

    console.log("🔍 Comparing OTPs:", otp, "vs", otpData.otp);

    if (parseInt(otp) !== parseInt(otpData.otp)) {
      console.log("❌ OTP mismatch");
      return res.status(401).json({ message: "otp mismatch!" });
    }

    otpStore.delete(officerId);
    console.log("🧹 OTP removed from otpStore");

    const registerOfficer = await Officer.findOneAndUpdate(
      { officerId },
      { $set: { isVerified: true } },
      { new: true }
    );

    console.log("✅ Officer verified:", registerOfficer);

    return res.status(201).json({
      message: "officer verified successfully!",
      officer: registerOfficer,
    });
  } catch (err) {
    console.log("🔥 verifyOtp error:", err);
    return res.status(500).json({ message: "internal server error!" });
  }
};



export const averageResolveTime = async (req, res) => {
  try {
    const { officerId } = req.params;

    const officer = await Officer.findById(officerId)
      .populate("resolvedComplaints");

    if (!officer) {
      return res.status(404).json({ message: "Officer not found" });
    }

    let totalTime = 0;
    let resolvedCount = 0;

    for (const complaint of officer.resolvedComplaints) {
      if (!complaint.updatedAt || !complaint.createdAt) continue;

      const timeTaken =
        new Date(complaint.updatedAt) -
        new Date(complaint.createdAt);

      if (timeTaken > 0) {
        totalTime += timeTaken;
        resolvedCount++;
      }
    }

    if (resolvedCount === 0) {
      return res.json({
        totalResolved: 0,
        averageTimeInMinutes: 0,
        averageTimeInHours: 0,
        avgTimeDays: 0,
      });
    }

    const avgMs = totalTime / resolvedCount;

    return res.json({
      totalResolved: resolvedCount,
      averageTimeInMinutes: Math.round(avgMs / 60000),
      averageTimeInHours: (avgMs / 3600000).toFixed(2),
      avgTimeDays: (avgMs / (1000 * 60 * 60 * 24)).toFixed(2),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
