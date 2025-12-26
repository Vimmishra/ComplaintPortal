import mongoose from "mongoose";

const MessageSchema  = new mongoose.Schema({
    senderId: {type:mongoose.Schema.Types.ObjectId, ref:"User"},
    recieverId: {type:mongoose.Schema.Types.ObjectId, ref:"User"},
    text:{
        type:"String",
        required:true
    },

    isRead:{type:Boolean,default:false}

   
},
 {timestamps:true}
)


export default mongoose.model("Message",MessageSchema)