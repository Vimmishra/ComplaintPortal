import Complaint from "../models/Complaint.js";
import Officer from "../models/Officer.js";

export const trackComplaint = async (req, res) => {
  try {
    const { complaintId } = req.body;

    // Validate
    if (!complaintId) {
      return res.status(400).json({
        message: "Complaint ID is required",
        success: false,
      });
    }

    // Fetch complaint
    const complaint = await Complaint.findById(complaintId).populate("assignedTo");

    // Check if exists
    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found! Please check your ID again.",
        success: false,
      });
    }

    // Return full complaint data for tracking
    return res.status(200).json({
      message: "Complaint fetched successfully",
      success: true,
      complaint: {
        id: complaint._id,
        status: complaint.status,
        assignedTo: complaint.assignedTo || null,
        createdAt: complaint.createdAt,
        updatedAt: complaint.updatedAt,
        type: complaint.type,
        department: complaint.department,
        city: complaint.city,
        userName: complaint.userName || "Anonymous",
        phone: complaint.number ,
        description: complaint.description,
        images: complaint.images || [],
        video: complaint.video || "",
        remarks:complaint.remarks || ""
      },
    });
  } catch (err) {
    console.log("Track Complaint Error:", err);
    return res.status(500).json({
      message: "Internal server error!",
      success: false,
    });
  }
};




export const rateOfficer = async(req,res)=>{
  try{

    const {officerId,complaintId} = req.params;
    const {rating,comment} = req.body

    if(!officerId || !complaintId ){
      return res.status(401).json({
        message : "please provide all fields"
      })
    }

    if(rating <=0 || rating >5 ){
      return res.status(400).json({
        message:"invalid rating!"
      })
    }


    const officer = await Officer.findById(officerId);
    if(!officer){
      return res.status(400).json({
        message:"no officer found in database"
      })
    }

   
    const alreadyRated = officer.ratings.some((r) => r.complaint.toString() === complaintId.toString())


    const complaint = await Complaint.findById(complaintId);
    if(!complaint){
      return res.status(400).json({
        message:"no complaint found with this id"
      })
    }

    if(alreadyRated){
      return res.status(401).json({
        message:"You already have rated for this complaint!"
      })
    }


   officer.ratings.push({
  rating,
  comment,
  complaint: complaintId
});


complaint.rating = rating

await complaint.save()



    await officer.save()

    return res.status(201).json({
      message:"You have Rated officer successfully!"
    })

  }


  catch(err){
    console.log(err)
    return res.status(500).json({
      message:"intertnal; servewr error!"
    })
  }
}