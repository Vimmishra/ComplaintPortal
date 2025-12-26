// EmployeeLogin.jsx
import React, { useState } from "react";
import axios from "axios";
import { Hash, Smartphone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const EmployeeLogin = () => {
  const [empId, setEmpId] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const {login} = useAuth()

  const backendURL = `${import.meta.env.VITE_API_URL}`;
  const navigate = useNavigate();

  const sendOtp = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        `${backendURL}/api/add/send-otp`,
        { empId },
        { withCredentials: true }
      );
      setOtpSent(true);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }

    setLoading(false);
  };


  
const verifyOtp = async () => {
  setLoading(true);
  setMessage("");

  try {
    const res = await axios.post(
      `${backendURL}/api/add/verify-otp`,
      { empId, otp },
      { withCredentials: true }
    );

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }

    login(res.data);

    setMessage("Login successful!");

    setTimeout(() => {
      navigate("/employeeDetails");
    }, 700);

  } catch (err) {
    setMessage(err.response?.data?.message || "OTP verification failed");
  }

  setLoading(false);
};



  return (
    <div className="h-screen flex justify-center items-center bg-gray-900 p-4">
      <div className="w-full max-w-lg bg-white/10 p-8 rounded-3xl border border-white/20 backdrop-blur-xl text-white">

        <h2 className="text-3xl font-bold text-center mb-2">Employee Login</h2>
        <p className="text-center text-gray-300 mb-6">
          Login using Employee ID + OTP
        </p>

        {message && (
          <p className="text-center mb-3 text-green-400">{message}</p>
        )}

        {/* EMPLOYEE ID */}
        {!otpSent && (
          <>
            <label className="font-medium text-sm">Employee ID</label>
            <div className="relative mt-1 mb-4">
              <Hash className="absolute left-3 top-3 text-gray-300" size={18} />
              <input
                type="text"
                className="w-full p-3 pl-10 bg-black/30 border border-white/20 rounded-lg text-white"
                placeholder="Enter Employee ID"
                value={empId}
                onChange={(e) => setEmpId(e.target.value)}
              />
            </div>

            <button
              onClick={sendOtp}
              disabled={!empId || loading}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        )}

        {/* OTP INPUT */}
        {otpSent && (
          <>
            <label className="block mt-4 font-medium text-sm">Enter OTP</label>
            <div className="relative mt-1 mb-4">
              <Smartphone
                className="absolute left-3 top-3 text-gray-300"
                size={18}
              />
              <input
                type="text"
                className="w-full p-3 pl-10 bg-black/30 border border-white/20 rounded-lg text-white"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <button
              onClick={verifyOtp}
              disabled={otp === "" || loading}
              className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-semibold"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeeLogin;
