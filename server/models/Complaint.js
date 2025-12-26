import mongoose from "mongoose";


const ComplaintSchema = new mongoose.Schema({
    type: {type:String, },
    description:{type:String,},
    empId: {type:String,},
    city: {type:String,},
    empName: {type:String,},
    department:{type:String,},
     userName: {type:String,},
     number:{type:String,},
     images: [{ type: String,  }],
    video:{type:String, },
    verified: {type:Boolean, default:false},
 

 
    assignedTo:{type: mongoose.Schema.Types.ObjectId, ref: 'Officer',default:null},

   
    otp :{type:String},
    OtpVerified:{type:Boolean, default:false},

    resolved:{type:Boolean,default:false},

    resolvedBy: [{ type: mongoose.Schema.Types.ObjectId,
                ref: "Officer"}],

    remarks:{type:String},

 status: {
    type: String,
    enum: ["Received", "Under-Review", "verified", "Assigned", "In Progress", "Resolved"],
    default: "Received"
  },
  

  timeline: [
    {
      status: String,
      time: Date
    }
  ],


  rating:{type:Number,deafult:0},


  activeComplaintsOfEmployee: {type:Number,default:0},
    

}, {timestamps:true})


export default mongoose.model("Complaint", ComplaintSchema)
