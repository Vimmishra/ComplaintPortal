import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {type:String, required:true},
    email:{type:String, required:true},
    password:{type:String, },
   role: {
  type: String,
  enum: ["admin",  "user", ],
  default: "user",
},


complaints:[{}],



    otp:{type:String},
    otpVerified:{type:Boolean, default:false}
})

export default mongoose.model("User",UserSchema)