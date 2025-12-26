// helpers/socket.js
import { Server } from "socket.io";
import Message from "../models/Message.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST", "DELETE", "PATCH"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join private room
    socket.on("join", (userId) => {
      console.log("User joined room:", userId);
      socket.join(userId);
    });

    // Handle private message
    socket.on("privateMessage", async (data) => {
      const { senderId, recieverId, text } = data;

      if (!senderId || !recieverId || !text) {
        console.log("Invalid message data:", data);
        return;
      }

      const message = new Message({
        senderId,
        recieverId,
        text,
        isRead: false,
      });

      const savedMessage = await message.save();

      // Emit to receiver
      io.to(recieverId).emit("newNotification", savedMessage);
      io.to(recieverId).emit("privateMessage", savedMessage);

      console.log("Message saved:", savedMessage);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

// Function to get global io instance anywhere
export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};
