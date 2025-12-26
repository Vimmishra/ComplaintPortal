import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const OfficerBulkUploader = () => {

    const {user} = useAuth();

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/add/bulkOfficer`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(res.data.message + " (" + res.data.count + " records)");
    } catch (err) {
      console.error(err);
      setMessage("Upload failed");
    }
  };

  return (


    <div className="p-4 max-w-md mx-auto">
        {user.role === "admin" && (
            <div>
      <h2 className="text-xl font-bold mb-4">Upload Officer Excel</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} className="mb-4" />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Upload
      </button>
      {message && <p className="mt-2 text-green-600">{message}</p>}
      </div>
        )}
    </div>


  );
};

export default OfficerBulkUploader;
