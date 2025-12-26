

import { uploadMediaToCloudinary } from "../helpers/cloudinary.js";
import { sendConfirmcomplaint, sendOtp } from "../helpers/twilio.js";
import Complaint from "../models/Complaint.js";
import Employee from "../models/Employee.js";

const link = `${process.env.FRONTEND_URL}/trackComplaint`
console.log("Link to send:", link);

export const UserCompalint = async (req, res) => {




    try {

      console.log("link:", link)
        const { empId } = req.params;

        if (!empId) {
            console.log("no empId found from params!");
            return res.status(401).json({
                message: "no empId found"
            })
        }


        const empDetails = await Employee.findOne({ empId });


    

        const { type, description, userName, number } = req.body;

        if (!type || !description) {
            console.log("please enter type of complaint and description");
            return res.status(401).json({
                message: "please enter type and description !"
            })
        }



        const images = req.files?.images || [];


        const video = req.files?.video ? req.files.video[0] : null;


        let imageUrls = [];
        if (images.length > 0) {
            const imageUploadPromises = images.map((img) =>
                uploadMediaToCloudinary(img.path)
            );

            const uploadedImages = await Promise.all(imageUploadPromises);
            imageUrls = uploadedImages.map((img) => img.secure_url);
        }


        let videoUrl = null;
        if (video) {
            const uploadedVideo = await uploadMediaToCloudinary(video.path);
            videoUrl = uploadedVideo.secure_url;
        }


        

        const generateOtp = Math.floor(100000 + Math.random() * 900000);

        await sendOtp(number,generateOtp);

        const newComplaint = new Complaint({
            type,
            description,
            number,
            userName,
            empId,
            empName: empDetails.name,
            images: imageUrls,
            video: videoUrl,
            department: empDetails.department,
            city:empDetails.city,
            otp:generateOtp,
            activeComplaintsOfEmployee:empDetails.activeComplaints.length


        })


       


        await newComplaint.save()

         empDetails.complaints.push(newComplaint._id);
         empDetails.activeComplaints.push(newComplaint._id);


          
    

        await empDetails.save()

        return res.status(201).json({
            message: "Complaint registered successfully",
            complaint: newComplaint
        })

       

    }

    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "internal server error!",
        })
    }


}



export const verifyComplaintOtp = async(req,res)=>{
  try{

    const {complaintId, otp} = req.body;

    if(!complaintId || !otp){
      return res.status(401).json({
        message:"please provide otp and complaintId"
      })
    }

    const complaintData = await Complaint.findById(complaintId);

    if(parseInt(otp) !== parseInt(complaintData.otp) ){
      return res.status(401).json({
        message:"otp mismatch!"
      })
    }


    complaintData.OtpVerified = true;

    complaintData.save()

    await sendConfirmcomplaint(complaintData.number,`${process.env.FRONTEND_URL}/trackComplaint`,complaintData._id);

    return res.status(201).json({
      message:"otp verified successfully!"
    })


  }

  catch(err){
    console.log(err)
    return res.status(500).json({
      message:"internal server error!"
    })
  }
}






export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({verified:false, OtpVerified:true});

    if (!complaints || complaints.length === 0) {
      return res.status(404).json({
        message: "No complaints found",
      });
    }

    // Manually attach employee details (because empId is string)
    const enrichedComplaints = await Promise.all(
      complaints.map(async (c) => {
        const emp = await Employee.findOne({ empId: c.empId });
        return {
          ...c._doc,
          employeeDetails: emp || null,
        };
      })
    );

    return res.status(200).json({
      message: "All complaints fetched successfully!",
      complaints: enrichedComplaints,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};



export const updateState = async(req,res)=>{
  try{

    const {complaintId} = req.params;

    console.log(complaintId)

    if(!complaintId){
      return res.status(401).json({
        message:"please provide complaint Id"
      })
    }


    const complaint  = await Complaint.findOneAndUpdate({_id: complaintId},{ 
      $set:{status: "Under-Review"},
       $push: { timeline: { status: "Under-Review", time: new Date() }}
    }
      ,{new:true});


 if (!complaint) {
  console.log("no complaint found with id: ", complaintId)
      return res.status(404).json({ message: "Complaint not found" });
    }


return res.status(200).json({
  message:"status updated to under review",
  complaint:complaint
})

  }

  catch(err){
    console.log(err)
    return res.status(500).json({
      message:"internal server error"
    })
  }
}





export const formComplaint = async (req, res) => {
  try {
    console.log("📥 Incoming complaint request");

    const { type, description, city, department, userName, number } = req.body;
    console.log("📝 Request body:", req.body);

    if (!type || !description || !city || !department || !userName || !number) {
      console.log("❌ Missing required fields");
      return res.status(401).json({
        message: "all fields are required!",
      });
    }

    const images = req.files?.images || [];
    const video = req.files?.video ? req.files.video[0] : null;


    console.log("🖼 Images received:", images.length);
    console.log("🎥 Video received:", video ? "Yes" : "No");

    let imagesUrl = [];

    if (images.length > 0) {
      console.log("☁️ Uploading images to Cloudinary...");

      const imageUploadPromises = images.map((img, index) => {
        console.log(`⬆️ Uploading image ${index + 1}:`, img.path);
        return uploadMediaToCloudinary(img.path);
      });

      const uploadedImages = await Promise.all(imageUploadPromises);

      imagesUrl = uploadedImages.map((img) => img.secure_url);
      console.log("✅ Image upload completed:", imagesUrl);
    }

    let videoUrl = null;
    if (video) {
      console.log("☁️ Uploading video to Cloudinary...");
      const uploadVideo = await uploadMediaToCloudinary(video.path);
      videoUrl = uploadVideo.secure_url;
      console.log("✅ Video uploaded:", videoUrl);
    }

    const generateOtp = Math.floor(100000 + Math.random() * 900000);
    console.log("🔐 Generated OTP:", generateOtp);

    await sendOtp(number, generateOtp);
    console.log("📲 OTP sent to number:", number);

    const complaintSubmit = new Complaint({
      userName:userName,
      type,
      description,
      department,
      city,
      number,
      otp: generateOtp,
      images: imagesUrl, 
      video: videoUrl,
    });

    await complaintSubmit.save();
    console.log("💾 Complaint saved to DB:", complaintSubmit._id);

    return res.status(201).json({
      message:
        "complaint submitted successfully, please verify otp to registered complaint fully!",
      data: complaintSubmit,
    });
  } catch (err) {
    console.error("🔥 Error in formComplaint:", err);
    res.status(500).json({
      message: "internal server error",
    });
  }
};



export const verifyFormComplaint = async (req, res) => {
  try {
    console.log("🔍 OTP verification request received");
    console.log("📥 Request body:", req.body);

    const { complaintId, otp } = req.body;

    if (!complaintId) {
      console.log("❌ Number not provided");
      return res.status(401).json({
        message: "could not verify number!",
      });
    } 

    const complaintData = await Complaint.findById(complaintId);
    console.log("📄 Complaint fetched:", complaintData?._id);

    if (!complaintData) {
      console.log("❌ Complaint not found for number:", number);
      return res.status(404).json({
        message: "complaint not found!",
      });
    }

    console.log("🔐 Stored OTP:", complaintData.otp);
    console.log("🔢 Received OTP:", otp);

    if (parseInt(otp) !== parseInt(complaintData.otp)) {
      console.log("❌ OTP mismatch");
      return res.status(401).json({
        message: "otp mismatch!",
      });
    }

    complaintData.OtpVerified = true;
    await complaintData.save();

    console.log("✅ OTP verified successfully for complaint:", complaintData._id);

    await sendConfirmcomplaint(complaintData.number, link, complaintData._id);
    console.log("📩 Confirmation message sent");

    return res.status(201).json({
      message: "otp verified successfully!",
    });
  } catch (err) {
    console.error("🔥 Error in verifyFormComplaint:", err);
    return res.status(500).json({
      message: "internal server error",
    });
  }
};
