import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function AIChatBot() {
 
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I'm your AI assistant. Let's start your complaint. type complaint to" },
  ]);
  const [input, setInput] = useState("");
  const userId = "12345"; // unique per session
  const messagesEndRef = useRef(null);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { from: "user", text: input }]);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/chat/chatbot`,
        { userId, message: input }
      );

      setMessages((prev) => [
        ...prev,
        { from: "bot", text: res.data.reply },
      ]);

      setInput("");
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { from: "bot", text: "AI server error" }]);
    }
  };

  const uploadFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    let form = new FormData();
    form.append("media", file);
    form.append("userId", userId);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/chat/chatbot`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const newMessages = [{ from: "bot", text: res.data.reply }];

      if (res.data.fileUrl) {
        if (res.data.fileType === "image") {
          newMessages.push({ from: "bot", image: res.data.fileUrl });
        } else if (res.data.fileType === "video") {
          newMessages.push({ from: "bot", video: res.data.fileUrl });
        }
      }

      setMessages((prev) => [...prev, ...newMessages]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { from: "bot", text: "Media upload failed" }]);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col">

      {/* Header */}
      <header className="bg-blue-600 text-white p-4 text-xl font-bold shadow-md">
        AI Complaint Assistant
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[75%] p-3 rounded-lg shadow-md ${
              msg.from === "bot"
                ? "bg-white border border-gray-300"
                : "bg-blue-500 text-white ml-auto"
            }`}
          >
            {msg.text && <p>{msg.text}</p>}

            {msg.image && (
              <img
                src={msg.image}
                alt="uploaded"
                className="mt-2 rounded-lg max-h-64 border"
              />
            )}

            {msg.video && (
              <video controls className="mt-2 rounded-lg w-full max-h-64">
                <source src={msg.video} type="video/mp4" />
              </video>
            )}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 border-t bg-white flex items-center gap-2">
        <input
          type="text"
          className="flex-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>

      {/* File Upload */}
      <div className="p-3 border-t bg-gray-50">
        <label className="block p-2 border border-gray-400 rounded-lg cursor-pointer bg-white">
          Upload Image/Video
          <input type="file" className="hidden" onChange={uploadFile} />
        </label>
      </div>
    </div>
  );
}
