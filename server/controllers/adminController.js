import { officerAssignedComplaintMail } from "../helpers/nodemailer.js";
import { officerAssignedComplaint, sendAssignedMessage } from "../helpers/twilio.js";
import Complaint from "../models/Complaint.js";
import Employee from "../models/Employee.js";
import Officer from "../models/Officer.js";
import User from "../models/User.js";



export const complaintVerifiedByAdmin = async(req,res)=>{
    try{

        const {complaintId} = req.params;
        const complaint = await Complaint.findOneAndUpdate({_id: complaintId},
             {verified:true, status:"Verified"},{new:true});

        if(!complaint){
            return res.status(401).json({
                message:"cannot update complaint"
            })
        }

        return res.status(201).json({
            message:"complaint marked as verified!"
        })

    }

    catch(err){
        console.log(err)
        return res.status(500).json({
            message:"internal server error"
        })
    }
} 


export const deleteComplaintByAdmin = async (req, res) => {
  try {
    const { complaintId } = req.params;

    if (!complaintId) {
      return res.status(400).json({
        message: "complaintId not provided",
      });
    }

    const deletedComplaint = await Complaint.findByIdAndDelete(complaintId);

    if (!deletedComplaint) {
      return res.status(404).json({
        message: "Complaint not found!",
      });
    }

    console.log("deleted success")


    return res.status(200).json({
      message: "Complaint deleted successfully!",
    });


  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};




export const assignComplaintToOfficer = async(req,res)=>{
    try{

        const {complaintId} = req.params;

        const complaint = await Complaint.findOne({_id:complaintId});
        
        if(!complaint){
            console.log("no complaint found !");

            return res.status(401).json({
                message:"no complaints found with this id"
            })
        }


        const officer = await Officer.findOne({city: complaint.city, department: complaint.department});

        if(!officer){
            console.log("no officer found with this specification", complaint.city, complaint.department)
            return res.status(401).json({
                message:"no officer found with this city and department"
            })
        }



        complaint.assignedTo = officer._id || null

         await  officer.complaints.push(complaint._id);

         officer.assignedComplaints += 1;

         complaint.status = "Assigned"

         await complaint.save()

         await officer.save();

         await sendAssignedMessage(complaint.number, complaint._id)

         await officerAssignedComplaintMail(officer.email, officer.name)

         await officerAssignedComplaint(officer.phone)

        return res.status(201).json({
            message:"complaint assigned successfully!",
            assignedComoplaints: officer

        }) 


    }

    catch(err){
        console.log(err)
        return res.status(500).json({
            message:"internal server error!"
        })
    }
}



export const getAllAnalytics = async(req,res)=>{
  try{

    const complaints = await Complaint.find();
    
    const allEmployees = await Employee.find();

    const complaintsResolved  = await Complaint.countDocuments({resolved: true})

    const topRatedEmployees = await Employee.find({avgRating: {$gte:4}});

    const lowRatedEmployees = await Employee.find({avgRating: {$lte:2}});

const mostComplaintedEmployees = await Employee.find({
  $expr: { $gte: [ { $size: "$complaints" }, 10 ] }
});

    const officers = await  Officer.find().populate("complaints");

    const users = await User.find();


    if(!complaints || !allEmployees || ! topRatedEmployees || !lowRatedEmployees ||
       !mostComplaintedEmployees || !officers || !users){
      return res.status(404).json({
      message:"could not found data!"
      })
    }


    return res.status(200).json({
      message:"all data fetched successfully!",
      complaints: complaints,
      allEmployees: allEmployees,
      topRatedEmployees:topRatedEmployees,
      lowRatedEmployees: lowRatedEmployees,
      mostComplaintedEmployees: mostComplaintedEmployees,
      officers:officers,
      complaintsResolved:complaintsResolved,
      users:users
    })

  }

  catch(err){
    console.log(err)
    return res.status(500).json({
      message:"internal server error"
    })
  }
}



export const allResolvedComplaints = async(req,res)=>{
  try{

    const resolvedComplaints = await Complaint.find({status: "Resolved"});

    if(!resolvedComplaints){
      return res.status(401).json({
        message:"no resolved complaints found!"
      })
    }

    return res.status(200).json({
      message:"fetched resolved complaints successfully!",
      resolvedComplaints: resolvedComplaints
    })

  }

  catch(err){
    console.log(err)
    return res.status(500).json({
      message:"internal server error!"
    })
  }
}