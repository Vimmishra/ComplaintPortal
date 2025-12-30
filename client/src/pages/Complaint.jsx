import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { CheckCircle, Copy, ClipboardCheck } from "lucide-react";
import toast from "react-hot-toast";

const ComplaintForm = () => {
  const [form, setForm] = useState({
    userName: "",
    number: "",
    type: "",
    description: "",
  });

  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const { empId } = useParams();

  const [successId, setSuccessId] = useState("");
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImages = (e) => setImages([...e.target.files]);
  const handleVideo = (e) => setVideo(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.type || !form.description) {
     toast.error("complaint type and description required!")
      return;
    }

     if (!form.number || !form.userName) {
     toast.error("Phone number and userName required!")
      return;
    }

    const fd = new FormData();
    fd.append("userName", form.userName);
    fd.append("number", form.number);
    fd.append("type", form.type);
    fd.append("description", form.description);

    images.forEach((img) => fd.append("images", img));
    if (video) fd.append("video", video);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/complaint/${empId}`,
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const compId = res.data?.complaintId || res.data?.complaint?._id;
      setSuccessId(compId);

      setForm({ userName: "", number: "", type: "", description: "" });
      setImages([]);
      setVideo(null);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong")
    }
  };

  // -------------------------------------------------------
  // VERIFY OTP API CALL
  // -------------------------------------------------------
  const handleVerifyOtp = async () => {
    if (!otp.trim()) return alert("Enter OTP");

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/verify-otp`, {
        complaintId: successId,
        otp,
      });

      setOtpVerified(true);
      toast.success("OTP Verified successfully!")
    } catch (err) {
      console.log(err);
      toast.error("Incorrect OTP!")
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(successId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200 p-4">
      <div className="w-full max-w-xl">

        {/* SUCCESS CARD + OTP VERIFY */}
        {successId && (
          <div className="bg-blue-100 border border-blue-300 text-blue-900 p-4 rounded-xl shadow-md mb-6">
            <div className="flex items-center gap-2">
              <CheckCircle size={22} className="text-blue-700" />
              <h3 className="font-semibold text-lg">
                Complaint Submitted! Verify Your Number
              </h3>
            </div>

            <p className="mt-2 text-gray-700">
              Your Complaint ID:
              <span className="font-semibold ml-1">{successId}</span>
            </p>

            <button
              onClick={handleCopy}
              className="mt-3 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition shadow-md"
            >
              {copied ? (
                <>
                  <ClipboardCheck size={18} /> Copied!
                </>
              ) : (
                <>
                  <Copy size={18} /> Copy Complaint ID
                </>
              )}
            </button>

            {!otpVerified ? (
              <>
                <p className="mt-4 text-sm text-gray-600">
                  We have sent an OTP to your phone number. Please enter it below.
                </p>

                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-full p-3 mt-3 border rounded-lg"
                />

                <button
                  onClick={handleVerifyOtp}
                  className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg shadow-md"
                >
                  Verify OTP
                </button>
              </>
            ) : (
              <p className="mt-4 text-green-700 font-semibold">
                ✅ OTP Verified — Your complaint is now fully registered.
              </p>
            )}
          </div>
        )}

        {/* FORM */}
        {!successId && (
          <form
            onSubmit={handleSubmit}
            className="w-full bg-white p-6 rounded-2xl shadow-lg border border-gray-300"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Register Your Complaint
            </h2>

            <p className="text-sm text-gray-600 mb-4 bg-blue-50 p-2 rounded-lg border border-blue-200">
              🔒 Your <strong>name and phone number will be kept private</strong>.
            </p>

            {/* Inputs */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">Your Name</label>
              <input
                type="text"
                name="userName"
                value={form.userName}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Phone Number</label>
              <input
                type="text"
                name="number"
                value={form.number}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Complaint Type</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="" disabled>Select complaint type</option>
                <option value="corruption">Corruption/Missuse of Authority</option>
                <option value="rude">Rude Behaviour</option>
                <option value="absent">Absent on Duty</option>
                 <option value="bribe">Asking for bribe</option>
                  <option value="listing">Didn't listening </option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe your complaint..."
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Uploads */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">Upload Images(optional)</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImages}
                className="w-full border p-2 rounded-lg"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Upload Video(optional)</label>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideo}
                className="w-full border p-2 rounded-lg"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold p-3 rounded-lg shadow-md mt-2"
            >
              Submit Complaint
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ComplaintForm;
