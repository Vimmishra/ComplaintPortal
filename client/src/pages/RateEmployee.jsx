import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const RateEmployee = () => {
  const { empId } = useParams();

  const [employee, setEmployee] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [number, setNumber] = useState("");
  const [otp, setOtp] = useState("");

  const [step, setStep] = useState(1); // 1 = rate, 2 = verify otp
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Load employee details
  useEffect(() => {
    const getEmployeeDetails = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/add/feedback/${empId}`
        );
        setEmployee(res.data.employee);
      } catch (err) {
        console.error(err);
      }
    };

    getEmployeeDetails();
  }, [empId]);

  // ⭐ STEP 1 — Send OTP
  const submitRating = async () => {
    if (!rating || !number) {
      return setMsg("Rating and phone number are required");
    }

    try {
      setLoading(true);
      setMsg("");

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/ratings/rate-employee/${empId}`,
        { rating, comment, number }
      );

      setMsg(res.data.message);
      setStep(2);
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // 🔐 STEP 2 — Verify OTP
  const verifyOtp = async () => {
    if (!otp) return setMsg("OTP required");

    try {
      setLoading(true);
      setMsg("");

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/ratings/verify-number`,
        { otp, number }
      );

      setMsg(res.data.message);
      setStep(3);
    } catch (err) {
      setMsg(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl px-6 py-8">

        {/* Employee Info */}
        {employee && (
          <>
            <h1 className="text-3xl font-bold text-center">
              Rate {employee.name}
            </h1>

            <div className="text-center text-gray-600 mt-2 space-y-1">
              <p>Department: {employee.department}</p>
              <p>Designation: {employee.designation}</p>

              <p className="font-semibold text-yellow-500">
                ⭐ {employee.avgRating || 0} / 5
              </p>
            </div>
          </>
        )}

        {/* Message */}
        {msg && (
          <p className="text-center text-blue-600 font-medium mt-4">{msg}</p>
        )}

        {/* ⭐ STEP 1 — Rating */}
        {step === 1 && (
          <>
            {/* Stars */}
            <div className="flex justify-center mt-6 gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-4xl transition-transform
                    ${star <= rating ? "text-yellow-400 scale-110" : "text-gray-300"}
                  `}
                >
                  ★
                </button>
              ))}
            </div>

            {/* Comment */}
            <div className="mt-6">
              <label className="block mb-1 font-medium">Comment</label>
              <select
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-3 rounded-xl border"
              >
                <option value="">Choose comment</option>
                <option value="Very helpful">Very helpful</option>
                <option value="Solved my issue quickly">Solved my issue quickly</option>
                <option value="Needs improvement">Needs improvement</option>
                <option value="Unprofessional behavior">Unprofessional behavior</option>
                
              </select>
            </div>

            {/* Phone */}
            <input
              type="tel"
              placeholder="Enter phone number"
              className="w-full mt-4 p-3 border rounded-xl"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />

            <button
              onClick={submitRating}
              disabled={loading}
              className="w-full mt-6 py-3 rounded-xl bg-blue-600 text-white font-semibold"
            >
              {loading ? "Sending OTP..." : "Submit Rating"}
            </button>
          </>
        )}

        {/* 🔐 STEP 2 — OTP */}
        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full mt-6 p-3 border rounded-xl"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full mt-4 py-3 rounded-xl bg-green-600 text-white font-semibold"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {/* ✅ Success */}
        {step === 3 && (
          <p className="text-center text-green-600 font-bold mt-6">
            ⭐ Rating submitted successfully!
          </p>
        )}
      </div>
    </div>
  );
};

export default RateEmployee;
