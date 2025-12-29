import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Search, User, Menu, X, ShieldCheck, LogOut, ChevronRight } from "lucide-react";

const UserNavbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  // Scroll Logic State
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsOpen(false);
  };

  // Handle Scroll Behavior
  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;

      // Don't hide if mobile menu is open
      if (isOpen) {
        setIsVisible(true);
        return;
      }

      if (currentScrollY === 0) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling Down -> Hide
        setIsVisible(false);
      } else {
        // Scrolling Up -> Show
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY, isOpen]);

  return (
    <>
      {/* NAVBAR CONTAINER 
        - translate-y-0 = Visible
        - -translate-y-full = Hidden
      */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ease-in-out border-b border-slate-200/60
        ${isVisible ? "translate-y-0" : "-translate-y-full"}
        ${isOpen ? "bg-white" : "bg-white/80 backdrop-blur-md shadow-sm"}
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* LOGO */}
            <div
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => navigate("/")}
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-blue-200 shadow-lg group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-800">
                Jan<span className="text-blue-600">Nyaya</span>
              </h1>
            </div>

            {/* DESKTOP MENU */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => navigate("/trackComplaint")}
                className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md transition-all flex items-center gap-2 text-sm font-medium"
              >
                <Search className="h-4 w-4" /> 
                Track Status
              </button>

              <div className="h-6 w-px bg-slate-200 mx-2"></div>

              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="text-right hidden lg:block">
                      <p className="text-sm font-semibold text-slate-700 leading-none">{user.name}</p>
                      <p className="text-xs text-slate-500 mt-1">Verified User</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md border-2 border-white ring-2 ring-slate-100">
                      {user.name ? user.name[0].toUpperCase() : <User className="w-4 h-4" />}
                    </div>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-full transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate("/auth")}
                  className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all hover:scale-105"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* MOBILE TOGGLE */}
            <button
              className="md:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        {/* We use overflow-hidden to animate height if needed, or simple opacity/display */}
        <div 
          className={`md:hidden bg-white border-t border-slate-100 absolute w-full transition-all duration-300 ease-in-out shadow-xl ${
            isOpen ? "opacity-100 visible top-16" : "opacity-0 invisible -top-40"
          }`}
        >
          <div className="p-4 space-y-4">
            {user && (
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                 <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    {user.name ? user.name[0].toUpperCase() : <User />}
                 </div>
                 <div>
                    <p className="font-semibold text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email || "Citizen Account"}</p>
                 </div>
              </div>
            )}

            <div className="space-y-2">
              <button
                onClick={() => { navigate("/trackComplaint"); setIsOpen(false); }}
                className="w-full flex items-center justify-between p-3 rounded-lg text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5" />
                  <span className="font-medium">Track Complaint</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              {user ? (
                 <button
                 onClick={handleLogout}
                 className="w-full flex items-center justify-between p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
               >
                 <div className="flex items-center gap-3">
                   <LogOut className="w-5 h-5" />
                   <span className="font-medium">Logout</span>
                 </div>
               </button>
              ) : (
                <button
                  onClick={() => { navigate("/auth"); setIsOpen(false); }}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium shadow-md active:scale-95 transition-transform"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Spacer to prevent content from jumping behind fixed navbar */}
      <div className="h-16"></div>
    </>
  );
};

export default UserNavbar;