import mongoose from "mongoose";

const ComplaintMessageSchema = new mongoose.Schema({
    senderPhone: {
      type: String,
      required: true,
    },
    officerId:{type:String },
    message:{type:String, required:true},
    complaint:{type:mongoose.Schema.Types.ObjectId, ref:"Complaint"}
})


export default mongoose.model("ComplaintMessage", ComplaintMessageSchema);