import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({
    name: {type:String,required:true},
    email:{type:String},
    department: {type:String ,required:true},
    designation:{type:String,required:true},
    city:{type:String,required:true},
    empId:{type:String,required:true},
    phone:{type:String},
    qrCode:{type:String,required:true},
    imageUrl:{type:String,default: "",},

     totalRatings: { type: Number, default: 0 }, 
  ratingCount: { type: Number, default: 0 },
  avgRating:{type:Number, default:0},

comments:[{type:String}],

role:{type:String,default:"employee"},

ratedBy: {
  type: [String],  
  default: []
},


    otp:{type:String},
    isVerify: {type:Boolean, default:false},

    complaints: {
      type: [String],
      default: [],
    },

       activeComplaints: {
      type: [String],
      default: [],
    },


    totalComplaints:{type:Number, default:0}
})

export default mongoose.model("Employee", EmployeeSchema);