import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, User, MapPin, Phone, Building, Star, 
  MessageSquare, Info, X, Clock, Shield 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import io from "socket.io-client";

const socket = io(`${import.meta.env.VITE_API_URL}`);

const OfficersList = () => {
  const [officers, setOfficers] = useState([]);
  const [selectedOfficer, setSelectedOfficer] = useState(null); // For Chat
  const [viewOfficer, setViewOfficer] = useState(null); // For Details Modal
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const { user } = useAuth();
  const [avgTime, setAvgtime] = useState(null);
  const [loadingTime, setLoadingTime] = useState(false);
  
  // Ref for auto-scrolling chat
  const scrollRef = useRef(null);

  // Fetch Avg Resolve Time
  const getAvgResolveTime = async (officerId) => {
    setLoadingTime(true);
    setAvgtime(null); 
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/registerOfficer/avgResolveTime/${officerId}`);
      setAvgtime(res.data.avgTimeDays);
    } catch (err) {
      console.log(err);
      setAvgtime("N/A");
    } finally {
      setLoadingTime(false);
    }
  };

  const handleOpenDetails = (officer) => {
    setViewOfficer(officer);
    getAvgResolveTime(officer._id);
  };

  // Fetch officers
  useEffect(() => {
    const getAllOfficers = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/registerOfficer/allofficers`
        );
        
        if (Array.isArray(res.data)) {
           setOfficers(res.data);
        } else if (res.data.officers && Array.isArray(res.data.officers)) {
           setOfficers(res.data.officers);
        } else {
           setOfficers([]); 
        }

      } catch (err) {
        console.error("Error fetching officers:", err);
      }
    };
    getAllOfficers();
  }, []);

  // Open chat with officer
  const openChat = async (officer) => {
    setSelectedOfficer(officer);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/messages/${user._id}/${officer._id}`
      );
      setMessages(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return;
    socket.on("privateMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });
    return () => socket.off("privateMessage");
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const sendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() || !selectedOfficer) return;

    const msg = {
      senderId: user._id,
      recieverId: selectedOfficer._id,
      text,
    };

    socket.emit("privateMessage", msg);
    setMessages((prev) => [...prev, { senderId: user._id, text }]);
    setText("");
  };

  return (
    <div className="flex flex-col md:flex-row h-[85vh] gap-6 p-6 bg-gray-50/50 rounded-xl relative">
      
      {/* LEFT SIDE: Officers Table */}
      <div className="w-full md:w-2/3 flex flex-col gap-4 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50/50">
           <h2 className="text-xl font-bold text-gray-800 tracking-tight">Available Officers</h2>
           <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
             {officers.length} Registered
           </span>
        </div>

        <div className="overflow-x-auto overflow-y-auto h-full scrollbar-thin scrollbar-thumb-gray-200">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3">Officer Name</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3">Contact</th>
                <th className="px-6 py-3 text-center">Stats</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {officers.map((officer) => (
                <tr 
                  key={officer._id} 
                  className={`hover:bg-gray-50 transition-colors ${selectedOfficer?._id === officer._id ? 'bg-blue-50/60' : ''}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                        {officer.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{officer.name}</div>
                        <div className="text-xs text-gray-400">#{officer.officerId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Building size={14} className="text-gray-400" />
                      {officer.department}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 text-gray-500 text-xs">
                      <div className="flex items-center gap-2">
                        <MapPin size={12} /> {officer.city}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={12} /> {officer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                         <span className="px-2 py-0.5 rounded text-xs bg-orange-50 text-orange-600 border border-orange-100" title="Active Complaints">
                            {officer.complaints?.length || 0} A
                         </span>
                         <span className="px-2 py-0.5 rounded text-xs bg-green-50 text-green-600 border border-green-100" title="Resolved Complaints">
                            {officer.resolvedComplaints?.length || 0} R
                         </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 text-gray-600 border-gray-200 hover:text-blue-600 hover:border-blue-200"
                        onClick={() => handleOpenDetails(officer)}
                      >
                        <Info size={14} className="mr-1" /> Details
                      </Button>
                      <Button 
                        size="sm"
                        className={`h-8 px-3 ${selectedOfficer?._id === officer._id ? 'bg-blue-600' : 'bg-gray-900 hover:bg-gray-800'}`}
                        onClick={() => openChat(officer)}
                      >
                        <MessageSquare size={14} className="mr-1" /> Chat
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RIGHT SIDE: Chat Interface */}
      <motion.div 
        className="w-full md:w-1/3 bg-white border rounded-xl shadow-sm flex flex-col overflow-hidden"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        {selectedOfficer ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-md z-10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center text-lg font-bold backdrop-blur-sm">
                  {selectedOfficer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold">{selectedOfficer.name}</h3>
                  <p className="text-xs text-blue-100 opacity-90">{selectedOfficer.department}</p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
                    <MessageSquare size={48} className="mb-2" />
                    <p>No messages yet.</p>
                </div>
              ) : (
                messages.map((msg, idx) => {
                    const isMe = msg.senderId === user._id;
                    return (
                        <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                        >
                        <div
                            className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                            isMe
                                ? "bg-blue-600 text-white rounded-tr-none"
                                : "bg-white text-gray-800 border rounded-tl-none"
                            }`}
                        >
                            {msg.text}
                        </div>
                        </motion.div>
                    );
                })
              )}
              <div ref={scrollRef} />
            </div>

            {/* Chat Input */}
            <div className="p-3 bg-white border-t">
              <form 
                onSubmit={sendMessage}
                className="flex gap-2 items-center bg-gray-50 p-1.5 rounded-full border focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all"
              >
                <input
                  className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-2 text-sm outline-none text-gray-700 placeholder:text-gray-400"
                  type="text"
                  placeholder="Type a message..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <Button 
                    type="submit" 
                    size="icon" 
                    className="rounded-full bg-blue-600 hover:bg-blue-700 h-9 w-9 shrink-0 shadow-sm"
                    disabled={!text.trim()}
                >
                  <Send size={16} />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-6 text-center">
            <div className="bg-gray-100 p-6 rounded-full mb-4">
                <MessageSquare size={40} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700">No Chat Selected</h3>
            <p className="text-sm text-gray-500 max-w-xs mt-2">
              Select an officer from the table to start a conversation.
            </p>
          </div>
        )}
      </motion.div>

      {/* DETAILS DIALOG / MODAL (Custom Implementation with Framer Motion) */}
      <AnimatePresence>
        {viewOfficer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewOfficer(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 bg-linear-to-br from-blue-600 to-blue-800 text-white relative">
                 <button 
                   onClick={() => setViewOfficer(null)}
                   className="absolute top-4 right-4 text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                 >
                   <X size={20} />
                 </button>
                 <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-blue-600 shadow-lg">
                      {viewOfficer.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{viewOfficer.name}</h3>
                      <p className="text-blue-100 flex items-center gap-1.5 text-sm">
                        <Shield size={14} /> {viewOfficer.department}
                      </p>
                    </div>
                 </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6">
                 {/* Stats Grid */}
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                        <div className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Avg Resolve Time</div>
                        <div className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
                          <Clock size={20} className="text-blue-500" />
                          {loadingTime ? (
                            <span className="text-sm text-gray-400 animate-pulse">Calculating...</span>
                          ) : (
                            <span>{avgTime ? `${Number(avgTime).toFixed(1)} days` : 'N/A'}</span>
                          )}
                        </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                        <div className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Rating</div>
                        <div className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
                          <Star size={20} className="text-amber-400" fill="currentColor" />
                          <span>{viewOfficer.averageRating ? viewOfficer.averageRating.toFixed(1) : 'New'}</span>
                        </div>
                    </div>
                 </div>

                 {/* Contact Details */}
                 <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">Contact Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex flex-col">
                           <span className="text-gray-500 text-xs">Phone Number</span>
                           <span className="font-medium text-gray-700">{viewOfficer.phone}</span>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-gray-500 text-xs">City / Location</span>
                           <span className="font-medium text-gray-700">{viewOfficer.city}</span>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-gray-500 text-xs">Officer ID</span>
                           <span className="font-medium text-gray-700">{viewOfficer.officerId}</span>
                        </div>

                         <div className="flex flex-col">
                           <span className="text-gray-500 text-xs">Email ID</span>
                           <span className="font-medium text-gray-700">{viewOfficer.email}</span>
                        </div>
                    </div>
                 </div>

                 <div className="pt-2">
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700" 
                      onClick={() => {
                        openChat(viewOfficer);
                        setViewOfficer(null);
                      }}
                    >
                      <MessageSquare size={16} className="mr-2" /> Send Message
                    </Button>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OfficersList;