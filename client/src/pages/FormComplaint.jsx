import React, { useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UploadCloud, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const FormComplaint = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");

  const [complaintData, setComplaintData] = useState({
    userName: "",
    number: "",
    description: "",
    type: "",
    department: "",
    city: "",
    images: [],
    video: null,
  });

  const [complaintId, setComplaintId] = useState(""); // store _id after submission

  const handleChange = (e) => {
    setComplaintData({ ...complaintData, [e.target.name]: e.target.value });
    console.log("✏️ Input changed:", e.target.name, e.target.value);
  };

  const handleImageChange = (e) => {
    setComplaintData({ ...complaintData, images: Array.from(e.target.files) });
    console.log("🖼 Images selected:", e.target.files);
  };

  const handleVideoChange = (e) => {
    setComplaintData({ ...complaintData, video: e.target.files[0] });
    console.log("🎥 Video selected:", e.target.files[0]);
  };

  const submitComplaint = async () => {
    try {
      setLoading(true);
      console.log("🚀 Submitting complaint:", complaintData);

      const formData = new FormData();
      Object.keys(complaintData).forEach((key) => {
        if (key === "images") {
          complaintData.images.forEach((img) => formData.append("images", img));
        } else if (key === "video" && complaintData.video) {
          formData.append("video", complaintData.video);
        } else {
          formData.append(key, complaintData[key]);
        }
      });

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/formComplaint`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("✅ Complaint submitted response:", response.data);
      setComplaintId(response.data.data._id); // store complaintId for OTP
      setStep(2);
    } catch (error) {
      console.error("❌ Error submitting complaint:", error.response || error);
      alert("Failed to submit complaint");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    try {
      setLoading(true);
      console.log(" Verifying OTP:", otp, "for complaintId:", complaintId);

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/verify-otp`, {
        complaintId,
        otp: otp.trim(),
      });

      console.log("OTP verification response:", response.data);
      setStep(3);
      toast.success("OTP verified successfully!")
    } catch (error) {
      console.error(" OTP verification error:", error.response || error);
      toast.error("Invalid OTP!")
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-3xl">
        <Card className="rounded-2xl shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-indigo-700">Public Complaint Portal</CardTitle>
            <p className="text-sm text-muted-foreground">Register and track your complaint securely</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input name="userName" placeholder="Full Name" value={complaintData.userName} onChange={handleChange} />
                <Input name="number" placeholder="Mobile Number" value={complaintData.number} onChange={handleChange} />

                <Select onValueChange={(value) => setComplaintData({ ...complaintData, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Complaint Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rude">Rude Behaviour</SelectItem>
                    <SelectItem value="bribe">Asking for bribe</SelectItem>
                    <SelectItem value="listing">Did'nt listening</SelectItem>
                    <SelectItem value="corruption">Corrupted</SelectItem>
                     <SelectItem value="absent">Absent on duty</SelectItem>
                  </SelectContent>
                </Select>

                <Input name="department" placeholder="eg: PSPCL,TEHSIL" value={complaintData.department} onChange={handleChange} />
                <Input name="city" placeholder="City" value={complaintData.city} onChange={handleChange} />

                <Textarea
                  name="description"
                  placeholder="Describe your complaint in detail"
                  className="md:col-span-2"
                  value={complaintData.description}
                  onChange={handleChange}
                />

                <label className="flex items-center gap-2 md:col-span-2 cursor-pointer border-2 border-dashed rounded-xl p-4 text-sm text-muted-foreground">
                  <UploadCloud className="w-5 h-5" /> Upload Images (multiple)
                  <input type="file" multiple accept="image/*" hidden onChange={handleImageChange} />
                </label>

                <label className="flex items-center gap-2 md:col-span-2 cursor-pointer border-2 border-dashed rounded-xl p-4 text-sm text-muted-foreground">
                  <UploadCloud className="w-5 h-5" /> Upload Video (optional)
                  <input type="file" accept="video/*" hidden onChange={handleVideoChange} />
                </label>

                <Button className="md:col-span-2 bg-indigo-600 hover:bg-indigo-700" onClick={submitComplaint} disabled={loading}>
                  {loading ? "Submitting..." : "Submit Complaint"}
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 text-center">
                <ShieldCheck className="mx-auto text-indigo-600 w-10 h-10" />
                <h2 className="text-lg font-semibold">OTP Verification</h2>
                <p className="text-sm text-muted-foreground">An OTP has been sent to your mobile number</p>
                <Input placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
                <Button className="w-full bg-indigo-600" onClick={verifyOtp} disabled={loading}>
                  Verify OTP
                </Button>
              </div>
            )}

            {step === 3 && (
              <div className="text-center space-y-3">
                <h2 className="text-xl font-bold text-green-600">Complaint Registered Successfully 🎉</h2>
                <p className="text-sm text-muted-foreground">You can track your complaint status from your dashboard.</p>
                <Button variant="outline" onClick={() => setStep(1)}>
                  Register New Complaint
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default FormComplaint;
