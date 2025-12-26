import mongoose from "mongoose";


const RatingSchema = new mongoose.Schema({
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: "" },
  complaint: { type: mongoose.Schema.Types.ObjectId, ref: "Complaint" },
  createdAt: { type: Date, default: Date.now }
});


const OfficerSchema  = new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String,required:true},
    city:{type:String,required:true},
    department:{type:String,required:true},
    phone:{type:String,required:true},
    officerId: {type:String, required:true},
    assignedComplaints: {type:Number, required:true, default:0},
    complaintsResolved: {type:Number,default:0},

    complaints: [{ type: mongoose.Schema.Types.ObjectId,
            ref: "Complaint"}],

ratings:[RatingSchema],


resolvedComplaints: [{ type: mongoose.Schema.Types.ObjectId,
            ref: "Complaint"}],
    otp:{type:String},
    isVerified: {type:Boolean, default:false},

    role: {type:String, default:"officer"}

})  ;

OfficerSchema.virtual("averageRating").get(function() {
  if (this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((acc, r) => acc + r.rating, 0);
  return sum / this.ratings.length;
});


// Ensure virtuals are included in JSON output
OfficerSchema.set("toJSON", { virtuals: true });
OfficerSchema.set("toObject", { virtuals: true });


export default mongoose.model("Officer", OfficerSchema)

