import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const FeedBackPage = () => {
  const { empId, } = useParams();          // ✅ Correct Destructuring
  const navigate = useNavigate();

  const [emp, setEmp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getEmployeeDetails = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/add/feedback/${empId}`
        );

        setEmp(res.data.employee);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getEmployeeDetails();
  }, [empId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading employee details...
      </div>
    );
  }

  if (!emp) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-lg">
        No employee found!
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white p-6 rounded-2xl shadow-lg">

        {/* Employee Card */}
        <div className="text-center mb-6">
          <img
            src={emp.imageUrl || "https://via.placeholder.com/120"}
            alt="Employee"
            className="w-28 h-28 mx-auto rounded-full object-cover shadow"
          />

          <h2 className="text-2xl font-bold text-gray-800 mt-3">
            {emp.name}
          </h2>

          <p className="text-gray-600">{emp.designation}</p>
          <p className="text-gray-500 text-sm">{emp.department}</p>
           <p className="text-gray-500 text-sm">Rating: {emp.avgRating}⭐</p>

        </div>

        {/* Buttons Section */}
        <div className="space-y-4">

          {/* Rating Button */}
          <button
            onClick={() => navigate(`/rating/${empId}`)}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-xl text-lg shadow-md transition"
          >
            ⭐ Give Rating
          </button>

          {/* Complaint Button */}
          <button
            onClick={() => navigate(`/complaint/${empId}`)}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl text-lg shadow-md transition"
          >
            📝 File Complaint
          </button>
        </div>

      </div>
    </div>
  );
};

export default FeedBackPage;
