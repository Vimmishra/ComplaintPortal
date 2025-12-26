import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const OfficerRegister = () => {
  const [officerId, setOfficerId] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(null); // 🔥 IMPORTANT
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  // ================= STEP 1 → SEND OTP =================
  const handleOfficerCheck = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/registerOfficer/registerOfficer`,
        { officerId },
        { withCredentials: true }
      );

      setMessage(res.data.message);
      setIsVerified(res.data.isVerified); // 🔥 BACKEND FLAG
      setIsOtpSent(true);
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

 
  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      setMessage("");


      console.log("FRONTEND isVerified:", isVerified);



      // ✅ ALREADY VERIFIED → SIGN IN
      if (isVerified === true) {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/registerOfficer/signInVerify`,
          { officerId, otp },
          { withCredentials: true }


        );


      


        localStorage.setItem("token", res.data.token);
        login(res.data);
        navigate("/officerDetails");
        return;
      }

      // ✅ FIRST TIME → VERIFY OFFICER
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/registerOfficer/verifyOtp`,
        { officerId, otp }
      );

      setMessage(res.data.message);

      // After verification → user must sign in again
      setTimeout(() => {
        setIsOtpSent(false);
        setOtp("");
        setMessage("Verification complete. Please sign in.");
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-center mb-4">
          Officer Sign In / Verify
        </h2>

        {message && (
          <p className="bg-blue-100 text-blue-700 p-2 rounded mb-3 text-center">
            {message}
          </p>
        )}

        {/* ================= STEP 1 ================= */}
        {!isOtpSent && (
          <>
            <input
              type="text"
              placeholder="Enter Officer ID"
              value={officerId}
              onChange={(e) => setOfficerId(e.target.value)}
              className="w-full p-2 border rounded"
            />

            <button
              onClick={handleOfficerCheck}
              disabled={loading}
              className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Sending OTP..." : "Continue"}
            </button>
          </>
        )}

        {/* ================= STEP 2 ================= */}
        {isOtpSent && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 border rounded mt-3"
            />

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full mt-4 bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default OfficerRegister;
