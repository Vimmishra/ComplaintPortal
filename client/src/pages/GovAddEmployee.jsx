import React, { useState } from "react";
import axios from "axios";

const GovAddEmployee = () => {
  const [formData, setFormData] = useState({
    name: "",
    email:"",
    department: "",
    designation: "",
    phone: "",
    city: "",
    empId: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addEmployee = async () => {
    setLoading(true);
    setMsg("");

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/add/addGovEmployee`,
        formData
      );
      setMsg("Employee added successfully!");
      setFormData({
        name: "",
        email:"",
        department: "",
        designation: "",
        phone: "",
        city: "",
        empId: "",
      });
    } catch (err) {
      setMsg("Something went wrong!");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addEmployee();
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-4xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center lg:text-left">
          Add Government Employee
        </h2>

        {msg && (
          <p className="mb-4 text-center text-sm font-medium text-green-600">
            {msg}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          
          <div>
            <label className="block text-gray-600 mb-1">Employee Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleOnChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400"
              placeholder="Enter employee name"
              required
            />
          </div>



          <div>
            <label className="block text-gray-600 mb-1">Employee Email</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleOnChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400"
              placeholder="Enter employee name"
              required
            />
          </div>


          
          <div>
            <label className="block text-gray-600 mb-1">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleOnChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400"
              placeholder="Enter department"
              required
            />
          </div>

          
          <div>
            <label className="block text-gray-600 mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleOnChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400"
              placeholder="Enter phone number"
              required
            />
          </div>

          
          <div>
            <label className="block text-gray-600 mb-1">Designation</label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleOnChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400"
              placeholder="Enter designation"
              required
            />
          </div>

         
          <div>
            <label className="block text-gray-600 mb-1">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleOnChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400"
              placeholder="Enter city"
              required
            />
          </div>

        
          <div>
            <label className="block text-gray-600 mb-1">Employee ID</label>
            <input
              type="text"
              name="empId"
              value={formData.empId}
              onChange={handleOnChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400"
              placeholder="Enter unique employee ID"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {loading ? "Adding..." : "Add Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GovAddEmployee;
