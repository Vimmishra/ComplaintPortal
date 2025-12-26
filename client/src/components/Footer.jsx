import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Footer = () => {

  const navigate = useNavigate()
  return (
    <footer className="bg-gray-900 text-gray-300 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

       
        <div>
          <div className="flex items-center gap-3 mb-3">
            <img
              src="https://cdn-icons-png.flaticon.com/512/942/942748.png"
              alt="logo"
              className="w-10 h-10"
            />
            <h2 className="text-xl font-semibold text-white">
              Jan Nyaya
            </h2>
          </div>
          <p className="text-sm text-gray-400">
            A digital platform to raise, track, and resolve complaints
            transparently using modern technology.
          </p>
        </div>

       
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Dashboard</li>
            <li className="hover:text-white cursor-pointer">Raise Complaint</li>
            <li className="hover:text-white cursor-pointer">Track Status</li>
            <li className="hover:text-white cursor-pointer">Help & Support</li>
          </ul>
        </div>

        
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            Connect With Us
          </h3>

          <div className="flex gap-4 mb-4">
            <img
              src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
              alt="facebook"
              className="w-6 h-6 hover:scale-110 transition"
            />

            <Link to="https://www.instagram.com/vimmishra/">
            <img
              src="https://cdn-icons-png.flaticon.com/512/733/733558.png"
              alt="instagram"
              className="w-6 h-6 hover:scale-110 transition"
            />
            </Link>

         <Link to="https://github.com/Vimmishra">
            <img
              src="https://cdn-icons-png.flaticon.com/512/733/733609.png"
              alt="github"
              className="w-6 h-6 hover:scale-110 bg-white transition"
            />
            </Link>

          <Link to="https://www.linkedin.com/in/vimalmishra21/">
             <img
              src="https://cdn-icons-png.flaticon.com/512/733/733561.png"

              alt="linkedin"
              className="w-6 h-6 hover:scale-110 transition"
            />


            </Link>
          </div>

          
          <img
            src="https://cdn.iconscout.com/icon/free/png-256/support-1850783-1569114.png"
            alt="support"
            className="w-16 opacity-80"
          />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 py-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Jan Nyaya. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
