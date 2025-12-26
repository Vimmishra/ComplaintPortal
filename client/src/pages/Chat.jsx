import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import io from "socket.io-client";

const socket = io(`${import.meta.env.VITE_API_URL}`);

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const { user } = useAuth();

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/allUsers`, {
          withCredentials: true,
        });

        console.log("user",user)
        setUsers(res.data.users);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  // Load previous messages
  const openChat = async (u) => {
    setSelectedUser(u);

    console.log(user._id)

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/messages/${user._id}/${u._id}`
      );
      setMessages(res.data);
    } catch (error) {
      console.log("Error loading messages", error);
    }
  };

  // Receive live messages
  useEffect(() => {
    socket.on("privateMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => socket.off("privateMessage");
  }, []);

  // Send message
  const sendMessage = () => {
    if (!text.trim()) return;

    const msg = {
      senderId: user._id,
      recieverId: selectedUser._id,
      text,
    };

    socket.emit("privateMessage", msg);

    setMessages((prev) => [...prev, { senderId: user._id, text }]);
    setText("");
  };






  return (
    <div className="h-screen w-full flex bg-gray-100">
      
      {/* USERS LIST */}
      <div className="w-1/3 bg-white shadow-md p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Users</h2>

        {users.map((u) => (
            <div
              key={u._id}
              onClick={() => openChat(u)}
              className={`p-3 rounded-lg mb-2 cursor-pointer transition 
                ${selectedUser?._id === u._id ? "bg-blue-100" : "hover:bg-gray-100"}`}
            >
              <p className="text-lg font-medium">{u.name}</p>
            </div>
          ))}
      </div>

      {/* CHAT WINDOW */}
      <div className="w-2/3 flex flex-col">
        {selectedUser ? (
          <>
            {/* HEADER */}
            <div className="p-4 bg-white shadow flex items-center">
              <h2 className="text-xl font-semibold">
                Chat with {selectedUser.name}
              </h2>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {messages.map((msg, index) => {
                const isMine = msg.senderId === user._id;

                return (
                  <div
                    key={index}
                    className={`flex mb-3 ${isMine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`px-4 py-2 max-w-xs rounded-lg text-white
                        ${isMine ? "bg-blue-600" : "bg-gray-600"}`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* INPUT BAR */}
            <div className="p-4 bg-white flex items-center gap-3 shadow-lg">
              <input
                type="text"
                placeholder="Type your message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-1 p-3 border rounded-lg focus:outline-blue-500"
              />

              <button
                onClick={sendMessage}
                className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1">
            <h2 className="text-xl font-semibold text-gray-500">
              Select a user to start chatting
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
