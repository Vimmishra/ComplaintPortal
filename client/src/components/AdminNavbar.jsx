import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { 
  Menu, X, ShieldAlert, UserPlus, Users, 
  FileText, Briefcase, Upload, LogOut 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

const AdminNavbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Redirect or hide if not admin
  if (!user || user.role !== "admin") return null;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { name: "Officer", path: "/addOfficer", icon: <UserPlus size={18} /> },
    { name: "Bulk Officer", path: "/bulkOfficer", icon: <Upload size={18} /> },
    { name: "Employee", path: "/addGovEmployee", icon: <UserPlus size={18} /> },
    { name: "Bulk Employee", path: "/bulkEmployee", icon: <Upload size={18} /> },
    { name: "Complaints", path: "/allcomplaints", icon: <FileText size={18} /> },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* LOGO AREA */}
            <Link to="/adminDashBoard" className="flex items-center gap-2 group">
              <div className="bg-red-600 text-white p-1.5 rounded-lg shadow-sm group-hover:bg-red-700 transition-colors">
                <ShieldAlert size={20} />
              </div>
              <span className="text-xl font-bold text-gray-800 tracking-tight">
                Admin<span className="text-red-600">Portal</span>
              </span>
            </Link>

            {/* DESKTOP MENU */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? "bg-red-50 text-red-600 shadow-sm"
                        : "text-gray-600 hover:bg-gray-100 hover:text-red-500"
                    }`
                  }
                >
                  {item.icon}
                  {item.name}
                </NavLink>
              ))}

              <div className="h-6 w-px bg-gray-300 mx-2"></div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white bg-gray-900 hover:bg-red-600 transition-colors shadow-sm"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>

            {/* MOBILE TOGGLE */}
            <button
              className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 transition"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white border-b border-gray-200 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors
                      ${
                        isActive
                          ? "bg-red-50 text-red-600"
                          : "text-gray-600 hover:bg-gray-50 hover:text-red-500"
                      }`
                    }
                  >
                    {item.icon}
                    {item.name}
                  </NavLink>
                ))}
                
                <div className="border-t border-gray-100 my-2 pt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 bg-red-50 rounded-lg font-medium hover:bg-red-100 transition"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Spacer to push content down */}
      <div className="h-16" />
    </>
  );
};

export default AdminNavbar;