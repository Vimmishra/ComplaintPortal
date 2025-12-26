import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Star } from 'lucide-react';

const OfficerDetails = () => {
  const [officer, setOfficer] = useState(null);

  useEffect(() => {
    const fetchOfficerDetails = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/checkAuth`, {
          withCredentials: true
        });
        setOfficer(res.data.user);
      } catch (err) {
        console.log(err);
      }
    };

    fetchOfficerDetails();
  }, []);

  if (!officer) {
    return <p className="text-center text-gray-500 mt-10">Loading officer details...</p>;
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-900 p-6">
      <div className="max-w-lg w-full bg-white/10 border border-white/20 p-8 rounded-3xl text-white backdrop-blur-xl">
        <h1 className="text-3xl font-bold text-center mb-6">Officer Details</h1>

        <div className="bg-white/10 p-5 rounded-2xl border border-white/20">
          <p><strong>Name:</strong> {officer.name}</p>
          <p><strong>Email:</strong> {officer.email}</p>
          <p><strong>Department:</strong> {officer.department}</p>
            <p><strong>City:</strong> {officer.city}</p>
          <p><strong>Phone:</strong> {officer.phone}</p>
          <p><strong>Total Complaints:</strong> {officer.complaints.length}</p>
          <p><strong>Complaints Resolved:</strong> {officer.complaintsResolved}</p>
          <p className='flex gap-1'><strong>Average rating:</strong> {officer.averageRating.toFixed(1)}<Star className=' mt-1 text-yellow-400 h-4 w-4'/></p>
        </div>
      </div>
    </div>
  );
};

export default OfficerDetails;
