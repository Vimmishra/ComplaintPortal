import express from "express";
import { aiChatBot } from "../controllers/chatgptController.js";
import multer from "multer"

const router = express.Router();

const upload = multer({ dest: "uploads/" }); // OR your custom multer config

router.post("/chatbot", upload.single("media"), aiChatBot )


export default router;