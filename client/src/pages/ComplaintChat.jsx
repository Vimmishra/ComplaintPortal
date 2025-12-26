import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";

const socket = io(`${import.meta.env.VITE_API_URL}`, {
  withCredentials: true,
});

const ComplaintChat = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { complaintId, officerId, userPhone } = state || {};

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const chatEndRef = useRef(null);

  // Safety check
  useEffect(() => {
    if (!complaintId || !officerId || !userPhone) navigate("/");
  }, [complaintId, officerId, userPhone, navigate]);

  // Join complaint room
  useEffect(() => {
    socket.emit("joinComplaintChat", { complaintId });
    console.log("Joined complaint room:", complaintId);
  }, [complaintId]);

  // Load previous messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/complaintmessages/${complaintId}/${userPhone}/${officerId}`
        );
        setMessages(res.data);
      } catch (err) {
        console.log("Failed to load messages:", err);
      }
    };
    loadMessages();
  }, [complaintId, userPhone, officerId]);

  // Listen for new messages
  useEffect(() => {
    socket.on("complaintMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("complaintMessage");
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const sendMessage = () => {
    if (!text.trim()) return;

    socket.emit("complaintMessage", {
      complaintId,
      senderPhone: userPhone,
      officerId,
      message: text,
    });

    setText("");
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Complaint Chat</h2>

      <div className="border rounded-lg h-96 overflow-y-auto p-3 space-y-2 bg-gray-50">
        {messages.map((m, i) => {
          const isUser = m.senderPhone === userPhone;

          return (
            <div
              key={i}
              className={`p-2 rounded-lg max-w-xs text-sm wrap-break-words ${
                isUser
                  ? "ml-auto bg-blue-600 text-white"
                  : "mr-auto bg-gray-700 text-white"
              }`}
            >
              {m.message}
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      <div className="flex gap-2 mt-3">
        <input
          className="flex-1 border rounded px-3 py-2"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ComplaintChat;
