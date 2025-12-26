import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", otp: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const {login,} = useAuth()

  const navigate = useNavigate();

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setOtpSent(false);
    setMessage("");
    setForm({ name: "", email: "", password: "", otp: "" });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/signUp`,
        { name: form.name, email: form.email, password: form.password },
        { withCredentials: true }
      );

      setOtpSent(true);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // VERIFY OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/verify-otp`, {
        email: form.email,
        otp: form.otp,
      });

      sessionStorage.setItem("token", res.data.token);
      setMessage("OTP Verified! Signed in successfully 🎉");
      setOtpSent(false);
    } catch (err) {
      setMessage(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  // SIGN IN
  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/signin`,
        { email: form.email, password: form.password },
        { withCredentials: true }
      );

      sessionStorage.setItem("token", res.data.token);
console.log("signin:",res.data.user.role)

login(res.data);

      if(res.data.user.role === "admin"){
      navigate("/adminDashBoard");
      return
      }

      navigate("/chat")

    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-linear-to-br from-gray-900 via-gray-800 to-black">
      
      <div className="w-[380px] backdrop-blur-xl bg-white/10 shadow-2xl border border-white/20 
                      p-8 rounded-3xl text-white animate-fadeIn">

        {/* Header */}
        <h2 className="text-3xl font-bold text-center mb-2 tracking-wide">
          {otpSent ? "OTP Verification" : isSignUp ? "Create Account" : "Welcome Back"}
        </h2>

        <p className="text-center text-gray-300 mb-6 text-sm">
          {otpSent
            ? "Enter the OTP sent to your email"
            : isSignUp
            ? "Start your journey with us"
            : "Sign in for Admin to continue"}
        </p>

        {/* SIGN UP FORM */}
        {isSignUp && !otpSent && (
          <form onSubmit={handleRegister} className="space-y-4">
            
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-300" size={18} />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-3 pl-10 bg-white/10 border border-gray-500/30 
                           rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-300" size={18} />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                className="w-full p-3 pl-10 bg-white/10 border border-gray-500/30 
                           rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-300" size={18} />
              <input
                type="password"
                name="password"
                placeholder="Create password"
                value={form.password}
                onChange={handleChange}
                className="w-full p-3 pl-10 bg-white/10 border border-gray-500/30 
                           rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold 
                         transition-all duration-200 shadow-lg"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Register"}
            </button>
          </form>
        )}

        {/* OTP FORM */}
        {isSignUp && otpSent && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <input
              type="text"
              name="otp"
              placeholder="Enter 6-digit OTP"
              value={form.otp}
              onChange={handleChange}
              className="w-full p-3 bg-white/10 border border-gray-500/30 rounded-lg 
                         text-white placeholder-gray-300 focus:ring-2 focus:ring-green-400"
              required
            />

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-semibold"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        {/* SIGN IN FORM */}
        {!isSignUp && !otpSent && (
          <form onSubmit={handleSignIn} className="space-y-4">

            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-300" size={18} />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-3 pl-10 bg-white/10 border border-gray-500/30 
                           rounded-lg text-white placeholder-gray-300"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-300" size={18} />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full p-3 pl-10 bg-white/10 border border-gray-500/30 
                           rounded-lg text-white placeholder-gray-300"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold shadow-lg"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        )}

        {/* MESSAGE */}
        {message && (
          <p className="text-center mt-4 text-sm text-green-400">{message}</p>
        )}

        {/* SWITCH MODE */}
        <div className="text-center mt-5">
          <button onClick={toggleMode} className="text-gray-300 text-sm hover:text-white transition">
            {otpSent
              ? "← Back to Register"
              : isSignUp
              ? "Already have an account? Sign In"
              : "New user? Create Account"}
          </button>
        </div>

        {/* EXTRA LINKS */}
        <div className="mt-6 text-center space-y-1">
          <p className="text-xs text-gray-400">Or continue as:</p>

          <div className="flex justify-center gap-4 mt-2">
            <button
              onClick={() => navigate("/addemployee")}
              className="text-blue-400 hover:text-blue-500 text-sm"
            >
              Sign in as Employee
            </button>

            <button
              onClick={() => navigate("/registerOfficer")}
              className="text-yellow-400 hover:text-yellow-500 text-sm"
            >
              Sign in as Officer
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;
