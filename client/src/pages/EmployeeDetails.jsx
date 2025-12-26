// EmployeeDetails.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ShieldCheck, Upload, User as UserIcon, Star } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const EmployeeDetails = () => {
  const [employee, setEmployee] = useState(null);
  const [photo, setPhoto] = useState(null);
  const backendURL = `${import.meta.env.VITE_API_URL}`;
  const { user } = useAuth();

  const fetchEmployee = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/auth/checkAuth`, {
        withCredentials: true,
      });
      setEmployee(res.data.user);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);



  const downloadQrCode = () => {
  if (!employee?.qrCode) return;

  const link = document.createElement("a");
  link.href = employee.qrCode;
  link.download = `${employee.name || "employee"}-qr-code.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


  const uploadPhoto = async () => {
    if (!photo) return;

    const formData = new FormData();
    formData.append("image", photo);
    formData.append("Id", employee._id); // ensure backend expects "empId"

    try {
      const res = await axios.patch(
        `${backendURL}/api/add/uploadImage`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      alert("Profile photo updated!");
      fetchEmployee();
    } catch (err) {
      console.log(err);
      alert("Upload failed");
    }
  };

  if (!employee)
    return <p className="text-center text-gray-300 mt-10">Loading...</p>;

  // Helper to render star icons
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={"full" + i} className="text-yellow-400" />);
    }
    if (halfStar) {
      stars.push(
        <Star
          key={"half"}
          className="text-yellow-400"
          style={{ clipPath: "inset(0 50% 0 0)" }} // simple half star effect
        />
      );
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={"empty" + i} className="text-gray-500" />);
    }
    return stars;
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-900 p-6">
      <div className="max-w-lg w-full bg-white/10 border border-white/20 p-8 rounded-3xl text-white backdrop-blur-xl relative">

        <h2 className="text-3xl font-bold text-center mb-4">Employee Details</h2>

        {/* PROFILE IMAGE */}
        <div className="flex flex-col items-center mb-6">
          {employee.imageUrl ? (
            <img
              src={employee.imageUrl}
              alt="Profile"
              className="w-28 h-28 rounded-full border-2 border-white/30 shadow-md"
            />
          ) : (
            <div className="w-28 h-28 flex items-center justify-center bg-black/30 rounded-full border border-white/30">
              <UserIcon size={40} className="text-gray-300" />
            </div>
          )}

          {/* --- FILE UPLOAD INPUT --- */}
          <input
            type="file"
            className="mt-4"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
          />

          <button
            onClick={uploadPhoto}
            disabled={!photo}
            className="mt-3 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg disabled:bg-gray-500"
          >
            <Upload size={18} />
            Upload Photo
          </button>
        </div>

        {/* VERIFIED EMPLOYEE BOX */}
        <div className="bg-white/10 p-5 rounded-2xl border border-white/20 relative">
          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-green-300">
            <ShieldCheck size={22} /> Verified Employee
          </h3>

          {/* RATING */}
          <div className="absolute top-5 right-5 flex items-center gap-1">
            {renderStars(employee.avgRating || 0)}
            <span className="ml-1 text-sm text-gray-300">{employee.avgRating?.toFixed(1)}</span>
          </div>

          <p><strong>Name:</strong> {employee.name}</p>
          <p><strong>Employee ID:</strong> {employee.empId}</p>
          <p><strong>Department:</strong> {employee.department}</p>
          <p><strong>Designation:</strong> {employee.designation}</p>
          <p><strong>Phone:</strong> {employee.phone}</p>

        <p className="mt-4 mb-2 font-medium text-gray-300">QR Code</p>

<img
  src={employee.qrCode}
  alt="Employee QR Code"
  className="w-40 h-40 mx-auto border border-white/20 p-2 rounded-xl"
/>

<button
  onClick={downloadQrCode}
  className="mt-3 w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium transition"
>
  Download QR Code
</button>

        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
