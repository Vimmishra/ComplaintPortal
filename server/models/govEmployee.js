import mongoose from "mongoose";

const GovEmplyeeSchema = new mongoose.Schema({
    name:{type: String, required:true},
    email:{type:String},
     department: {type:String ,required:true},
    designation:{type:String,required:true},
    city:{type:String,required:true},
     phone:{type:String,required:true},
    empId:{type:String,required:true}
})

export default mongoose.model("GovEmpData", GovEmplyeeSchema)