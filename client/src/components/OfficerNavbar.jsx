import React, { useEffect, useState, useRef } from "react";
import { 
  Bell, Menu, X, User, LogOut, LayoutDashboard, 
  FileText, CheckCircle, ChevronDown, Shield 
} from "lucide-react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";

// Initialize socket outside component to prevent re-connections
const socket = io(`${import.meta.env.VITE_API_URL}`, { withCredentials: true });

const OfficerNavbar = () => {
  const { user, logout } = useAuth();
  const [unread, setUnread] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Socket & Notification Logic
  useEffect(() => {
    if (!user?._id) return;

    socket.emit("join", user._id);
    fetchUnreadCount();

    socket.on("newNotification", (msg) => {
      if (msg.recieverId === user._id) {
        setUnread((prev) => prev + 1);
      }
    });

    socket.on("notificationsRead", () => {
      setUnread(0);
    });

    return () => {
      socket.off("newNotification");
      socket.off("notificationsRead");
    };
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/registerOfficer/resolvedComplaints/${user._id}`,
        { withCredentials: true }
      );
      setUnread(res.data.count || 0);
    } catch (err) {
      console.log("Error fetching unread count:", err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Navigation Items Configuration
  const navItems = [
    { name: "Dashboard", path: "/officerDetails", icon: <Shield size={18} /> },
    { name: "Resolved", path: "/ResolvedComplaints", icon: <CheckCircle size={18} /> },
    { name: "Assigned", path: "/officerComplaints", icon: <FileText size={18} /> },
  ];

  return (
    <>
      {/* NAVBAR CONTAINER */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* LOGO */}
            <Link to="/officerDetails" className="flex items-center gap-2 group">
              <div className="bg-blue-600 text-white p-1.5 rounded-lg group-hover:bg-blue-700 transition">
                <Shield size={20} />
              </div>
              <span className="text-xl font-bold bg-linear-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                OfficerPanel
              </span>
            </Link>

            {/* DESKTOP NAVIGATION */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2
                      ${isActive ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"}
                    `}
                  >
                    {item.icon}
                    {item.name}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-underline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* RIGHT SECTION (Notifications & Profile) */}
            <div className="flex items-center gap-4">
              
              {/* Notifications */}
              <Link to="/officerNotification" className="relative group p-2 rounded-full hover:bg-gray-100 transition">
                <motion.div
                  animate={unread > 0 ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
                  transition={{ duration: 0.5, repeat: unread > 0 ? Infinity : 0, repeatDelay: 2 }}
                >
                  <Bell className="h-6 w-6 text-gray-600 group-hover:text-blue-600" />
                </motion.div>
                {unread > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white">
                    {unread}
                  </span>
                )}
              </Link>

              {/* Profile Dropdown (Desktop) */}
              <div className="hidden md:block relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition outline-none"
                >
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200">
                    {user?.name?.charAt(0) || <User size={16} />}
                  </div>
                  <span className="hidden lg:block">{user?.name || "Officer"}</span>
                  <ChevronDown size={14} className={`transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 py-1 focus:outline-none overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-xs text-gray-500">Signed in as</p>
                        <p className="text-sm font-semibold text-gray-900 truncate">{user?.email}</p>
                      </div>
                      
                      <button
                         onClick={handleLogout}
                         className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut size={16} /> Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white border-b border-gray-200 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-4 space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition ${
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                      }`
                    }
                  >
                    {item.icon} {item.name}
                  </NavLink>
                ))}
                
                <div className="border-t my-2 border-gray-100"></div>
                
                <div className="flex items-center gap-3 px-3 py-3 text-gray-500">
                    <User size={18} />
                    <span className="text-sm font-medium">{user?.name} ({user?.department || 'Officer'})</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-16" />
    </>
  );
};

export default OfficerNavbar;