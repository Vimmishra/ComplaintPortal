import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import User from "./models/User.js";
import Message from "./models/Message.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"



import authRoutes from "./routes/authRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import ratingRoutes from "./routes/ratingRoutes.js";
import addOfficerRoutes from "./routes/addOfficerRoutes.js";
import chatgptRoutes from "./routes/chatgptRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import UserRoutes from "./routes/userRoutes.js";
import Complaint from "./models/Complaint.js";
import ComplaintMessage from "./models/ComplaintMessage.js";
import { assignComplaintAutomatically } from "./cron/AutoAssignComplaintToOfficer.js";


dotenv.config();
const app = express();



app.use(express.json());

app.use(cookieParser())
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // frontend URL
    methods: ["GET", "POST", "DELETE","PATCH"],
    credentials: true, // allow cookies/auth headers
  })
);

// ✅ MongoDB connection
mongoose.connect("mongodb+srv://vm45231_db_user:avengers2121@cluster0.zmoqwhs.mongodb.net/")
 .then(() => {
    console.log("MongoDB connected");

    // 🔥 START CRON ONLY AFTER DB CONNECTS
    assignComplaintAutomatically();
  })
.catch((err)=> console.log(err))



// ✅ REST APIs

app.use("/api/auth", authRoutes)

app.use("/api/add", employeeRoutes)

app.use("/api/user", complaintRoutes)

app.use("/api/ratings", ratingRoutes)

app.use("/api/registerOfficer", addOfficerRoutes);

app.use("/api/chat", chatgptRoutes)

app.use("/api/admin", adminRoutes)

app.use("/api/user", UserRoutes)



app.get("/api/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.get("/api/messages/:senderId/:recieverId", async (req, res) => {
  const { senderId, recieverId } = req.params;
  const messages = await Message.find({
    $or: [
      { senderId, recieverId },
      { senderId: recieverId, recieverId: senderId },
    ],
  });
  res.json(messages);
});

// ✅ Socket.io setup
const server = http.createServer(app);

const io = new Server(server,{
  cors:{origin: process.env.FRONTEND_URL,
  methods:["GET","POST","DELETE","PATCH"],
  credentials:true,
  },
})

app.set("io", io);

io.on("connection", (socket)=>{
  console.log("user connected successfully!",socket.id)



socket.on("join",(userId)=>{
  socket.join(userId)
  console.log("user joined with id:", userId)
})






//complaintMessage user and officer socket.io:

// ✅ User joins complaint-specific chat room
socket.on("joinComplaintChat", ({ complaintId, userPhone }) => {
  const roomId = `complaint_${complaintId}`;
  socket.join(roomId);
  console.log(`🟢 User with phone ${userPhone} joined complaint room:`, roomId);
});

// ✅ Load previous messages
app.get("/api/complaintmessages/:complaintId/:userPhone/:officerId", async (req, res) => {
  try {
    const { complaintId, userPhone, officerId } = req.params;
    console.log(`📥 Fetching messages for complaintId: ${complaintId}, userPhone: ${userPhone}, officerId: ${officerId}`);

    const messages = await ComplaintMessage.find({ complaint: complaintId }).sort({ createdAt: 1 });

    console.log(`📤 ${messages.length} messages fetched`);
    res.json(messages);
  } catch (err) {
    console.log("❌ Failed to load messages", err);
    res.status(500).json({ message: "Failed to load messages" });
  }
});

// ✅ Send message
socket.on("complaintMessage", async (data) => {
  try {
    const { complaintId, senderPhone, officerId, message } = data;
    console.log("✉️ Received message:", data);

    if (!complaintId || !senderPhone || !officerId || !message) {
      console.log("❌ Invalid complaint message data", data);
      return;
    }

    // Optional safety check
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      console.log("❌ Complaint not found");
      return;
    }

    

    const complaintMessage = new ComplaintMessage({ complaint: complaintId, senderPhone, officerId, message });
    const savedMessage = await complaintMessage.save();

    const roomId = `complaint_${complaintId}`;
    io.to(roomId).emit("complaintMessage", savedMessage);

    console.log("✅ Complaint message saved and emitted to room:", roomId, savedMessage);
  } catch (err) {
    console.log("❌ Error sending complaint message", err);
  }
});








//admin and officer
socket.on("privateMessage", async (data) => {
  const { senderId, recieverId, text } = data;

  if (!text || !senderId || !recieverId) {
    console.log("Invalid message data:", data);
    return;
  }

  const message = new Message({
    senderId,
    recieverId,
    text,
    isRead: false
  });

  const savedMessage = await message.save();

  // send notification
  io.to(recieverId).emit("newNotification", savedMessage);

  // send actual message
  io.to(recieverId).emit("privateMessage", savedMessage);

  console.log("Message saved:", savedMessage);
});



socket.on("disconnect",()=>{
  console.log("user disconnected", socket.id)
})


})

const PORT = process.env.BACKEND_URL

server.listen(PORT, () => console.log("Server running on port ", PORT));
