import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { 
  Menu, X, Briefcase, Star, LogOut, User, 
  LayoutDashboard, FilePlus, Search, ChevronDown 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const EmployeeNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Unified Navigation Items
  const navItems = [
   
    { name: "My Ratings", path: "/employeeRatingdetails", icon: <Star size={18} /> },
   
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* LOGO */}
            <Link to="/employeeDetails" className="flex items-center gap-2 group">
              <div className="bg-blue-600 text-white p-1.5 rounded-lg group-hover:bg-blue-700 transition">
                <Briefcase size={20} />
              </div>
              <span className="text-xl font-bold text-gray-800 tracking-tight">
                Employee<span className="text-blue-600">Portal</span>
              </span>
            </Link>

            {/* DESKTOP NAVIGATION */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                    }`
                  }
                >
                  {item.icon}
                  {item.name}
                </NavLink>
              ))}

              <div className="h-6 w-px bg-gray-300 mx-3"></div>

              {/* PROFILE DROPDOWN */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition outline-none"
                >
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200">
                    {user?.name?.charAt(0) || <User size={16} />}
                  </div>
                  <span className="max-w-[100px] truncate">{user?.name || "Employee"}</span>
                  <ChevronDown size={14} className={`transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 py-1 overflow-hidden"
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
            </div>

            {/* MOBILE HAMBURGER */}
            <div className="md:hidden flex items-center gap-4">
               {/* Mobile Avatar (Static) */}
               <Link to="/profile" className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                    {user?.name?.charAt(0)}
               </Link>
               
               <button 
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="text-gray-600 hover:text-blue-600"
               >
                {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white border-b border-gray-200 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-4 space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileOpen(false)}
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

                <Link
                  to="/profile"
                  onClick={() => setIsMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                >
                   <User size={18} /> My Profile
                </Link>

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
      
      {/* Spacer to prevent content hiding behind fixed navbar */}
      <div className="h-16" />
    </>
  );
};

export default EmployeeNavbar;