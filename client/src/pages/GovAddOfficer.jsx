import React, { useState } from "react";
import axios from "axios";

const GovernmentAddOfficer = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    officerId: "",
    city:"",
    department:"",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/registerOfficer/registerbyGov`, form);

      setMessage(res.data.message);
      setForm({ name: "", email: "", phone: "", officerId: "", city:"", department:"" });
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white shadow-lg p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Add Officer (Government Panel)
        </h2>

        {message && (
          <p className="bg-blue-100 text-blue-700 p-2 rounded mb-3 text-center">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Officer Name"
            className="w-full p-2 border rounded"
            value={form.name}
            onChange={handleChange}
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
            value={form.email}
            onChange={handleChange}
          />

          <input
            name="phone"
            type="text"
            placeholder="Phone Number"
            className="w-full p-2 border rounded"
            value={form.phone}
            onChange={handleChange}
          />

          <input
            name="officerId"
            type="text"
            placeholder="Officer ID"
            className="w-full p-2 border rounded"
            value={form.officerId}
            onChange={handleChange}
          />




 <input
            name="city"
            type="text"
            placeholder="City"
            className="w-full p-2 border rounded"
            value={form.city}
            onChange={handleChange}
          />




           <input
            name="department"
            type="text"
            placeholder="Department"
            className="w-full p-2 border rounded"
            value={form.department}
            onChange={handleChange}
          />





          <button
            type="submit"
            className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
          >
            Add Officer
          </button>
        </form>
      </div>
    </div>
  );
};

export default GovernmentAddOfficer;
