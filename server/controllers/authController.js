import jwt from "jsonwebtoken"
import User from "../models/User.js"
import bcrypt from "bcryptjs"
import { sendMail } from "../helpers/nodemailer.js"
import Officer from "../models/Officer.js"
import Employee from "../models/Employee.js"




const jwtSign = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET, {expiresIn: "7d"})
}

const otpStore = new Map()

export const register = async (req,res)=>{

    try{

    
    const {name,email,password}= req.body;

    if(!name || !email || !password){
        console.log("all fields are required!");
        return res.status(401).json({
            message:"all fields are required!"
        })
    }


    const exists = await User.findOne({email});

    if(exists){
        console.log("user already exists");
        return res.status(400).json({
            message:"email already registered with us!"
        })
    }


   const hashPassword = await bcrypt.hash(password, 10)

    const generatedOtp = Math.floor(100000 + Math.random() * 900000);
    console.log(generatedOtp)


    otpStore.set(email, {name, otp:generatedOtp, password:hashPassword});

    await sendMail(email,generatedOtp)

    return res.status(201).json({
        message:`otp send to ${email}`
    })


    }

    catch(err){
        console.log(err);
    }
}



export const verifyOtp = async(req,res)=>{
    try{

        const {otp,email} = req.body;

     const otpData = otpStore.get(email)

        if(!email || !otp){
            console.log("no email or otp for otp verification!")
            return res.status(400).json({
                message:"cannot find email or otp for verification"
            })
        }

        const genOtp = otpData.otp ;

        if(parseInt(otp) !== genOtp ){

            console.log("otp mismatch");

            return res.status(400).json({
                message:"otp mismatch"
            })
        }


        const newUser  = new User({name: otpData.name,email, password: otpData.password, otpVerified:true});

        await newUser.save();

        otpStore.delete(email)

        const token  = jwtSign(newUser._id);

        return res.status(201).json({
            message:"otp verified succcessfully",
            user:newUser,
            token,

        })

        


    }
    catch(err){
        console.log(err)
    }
}


export const signIn = async(req,res)=>{

    const {email,password} = req.body;

    if(!email || !password){
        console.log("please provide email and passsword");
        return res.status(401).json({
            message:"please provide email and password!"
        })
    }


    const user  = await User.findOne({email});

    if(!user){
        return res.status(400).json({
            message:"email not found!"
        })
    }

const checkPassword = await bcrypt.compare(password,user.password);

if(!checkPassword){
    console.log("password not matched")
    return res.status(400).json({
        message:"Password not match!"
    })
}


const token =  jwtSign(user._id)

  res.cookie("token", token, {
    httpOnly: true,
    secure: false, // true if using HTTPS
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });


return res.status(201).json({
    message:"sigIn successfull!",
    user:user,
    token
})



}


export const checkAuth = async (req, res) => {
  try {
    // 1️⃣ Get token (cookie or localStorage token via header)
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token found" });
    }

    // 2️⃣ Verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user = null;

    // 3️⃣ Check user in all collections
    user =
      (await User.findById(decoded.id).select("-password")) ||
      (await Officer.findById(decoded.id)) ||
      (await Employee.findById(decoded.id));
     

    if (!user) {
      return res.status(401).json({ message: "User not found!" });
    }

    return res.status(200).json({
      message: "Authenticated successfully",
      user,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};





export const allUsers = async (req, res) => {
  try {
    // Fetch all users, sorted by newest first
    const users = await User.find().sort({ createdAt: -1 });

    if (users.length === 0) {
      console.log("No users found");
      return res.status(404).json({
        message: "No users found in database",
      });
    }

    return res.status(200).json({
      message: "All users fetched successfully",
      users:users,
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};



export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (err) {
    console.log("Logout error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
