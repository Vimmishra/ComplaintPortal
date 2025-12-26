import express from "express";
import multer from "multer";
import Complaint from "../models/Complaint.js";
import Employee from "../models/Employee.js";
import { uploadMediaToCloudinary } from "../helpers/cloudinary.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();
const upload = multer({ dest: "uploads/" });


const genAI = new GoogleGenerativeAI("AIzaSyBIqxXrIkr7Xo5dSam4lPiZmo9C0DGNcV0");

const chatState = {};

export const aiChatBot = async (req, res) => {
  try {
    const { userId, message } = req.body;
    const { empId } = req.params;

    console.log("Received request:", { userId, message, empId, file: req.file?.originalname });

    if (!userId || (!message && !req.file)) {
      console.log("Missing userId or message/file");
      return res.status(400).json({ reply: "Missing userId or message/file" });
    }

   
    if (!chatState[userId]) {
      chatState[userId] = {
        complaintData: {
          type: "",
          description: "",
          userName: "",
          number: "",
          city: "",
          department: "",
          empId: empId || "",
          images: [],
          video: "",
        },
        step: "filling",
        chat: null,
      };
      console.log("Initialized new chat session for user:", userId);
    }

    const state = chatState[userId];

    
    if (req.file) {
      console.log("Uploading media:", req.file.originalname);
      const uploaded = await uploadMediaToCloudinary(req.file.path);
      console.log("Media uploaded to Cloudinary:", uploaded.secure_url);

      if (req.file.mimetype.startsWith("image")) {
        state.complaintData.images.push(uploaded.secure_url);
        console.log("Added image to complaintData:", state.complaintData.images);
      } else if (req.file.mimetype.startsWith("video")) {
        state.complaintData.video = uploaded.secure_url;
        console.log("Added video to complaintData:", state.complaintData.video);
      }

      return res.json({
        reply: " Media received! Continue your complaint or type 'done' to submit.",
      });
    }

   
    if (message.toLowerCase() === "done") {
      console.log("Submitting final complaint for user:", userId);
      const saved = await Complaint.create({
        ...state.complaintData,
        status: "Received",
      });

      console.log("Complaint saved:", saved._id);

      
      if (state.complaintData.empId) {
        const emp = await Employee.findOne({ empId: state.complaintData.empId });
        if (emp) {
          emp.complaints.push(saved._id);
          await emp.save();
          console.log(`Linked complaint ${saved._id} to employee ${emp.empId}`);
        }
      }


      chatState[userId] = null;
      console.log("Chat session reset for user:", userId);

      return res.json({
        reply: `✅ Complaint registered!\nYour Complaint ID: ${saved._id}`,
        complaintId: saved._id,
      });
    }

    if (!state.chat) {
      console.log("Starting new Gemini chat instance for user:", userId);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      state.chat = model.startChat({
        history: [
          {
            role: "user", 
            parts: [
              {
                text: `
You are an AI assistant that collects complaint details step-by-step.

After every user message, ALWAYS return a JSON object strictly in this format:

{
  "type": "",
  "description": "",
  "userName": "",
  "empId":"",
  "number": "",
  "city": "",
  "department": "",
  "images": "",
  "nextQuestion": "Ask the next missing field from the user."
}

Rules:
- Fill fields only when the user clearly provides them.
- make employeeId(empId) optional for user,as sometimes employees refuse to tell thier Id to users.
- Unknown fields must remain "" (empty string).
- Ask ONLY ONE short question at a time.
- Be polite and simple.
- Tell user to say "done" whenever all details are complete.
`,
              },
            ],
          },
        ],
      });
    }

    // ------------------- SEND USER MESSAGE TO GEMINI -------------------
    console.log("Sending message to Gemini AI:", message);
    const result = await state.chat.sendMessage(message);
    const aiText = result.response.text();
    console.log("Received response from Gemini:", aiText);

   let extracted = {};
try {
  // Remove code fences and trim
  const cleanText = aiText.replace(/```(?:json)?/g, "").trim();
  extracted = JSON.parse(cleanText);
  console.log("Parsed JSON from AI:", extracted);
} catch (err) {
  console.log("Failed to parse AI JSON:", err);
  console.log("AI raw response:", aiText);
  return res.json({
    reply: "⚠ AI response error. Please answer again.",
  });
}

    // ------------------- UPDATE complaintData FROM AI JSON -------------------
    const fields = ["type", "description", "userName", "number", "city", "department"];
    fields.forEach((f) => {
      if (extracted[f] && extracted[f].trim() !== "") {
        state.complaintData[f] = extracted[f];
        console.log(`Updated complaintData[${f}]:`, extracted[f]);
      }
    });

    // ------------------- SEND NEXT QUESTION -------------------
    console.log("Next question to user:", extracted.nextQuestion || "Please continue.");
    return res.json({
      reply: extracted.nextQuestion || "Please continue.",
      complaintData: state.complaintData, // For debugging
    });
  } catch (err) {
    console.error("AI Error:", err);
    return res.status(500).json({ reply: "Server error, try again." });
  }
};

// Route
router.post("/chat/:empId", upload.single("media"), aiChatBot);

export default router;
