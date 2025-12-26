import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Calendar, 
  Building, 
  User, 
  Search,
  Star,
  FileText
} from 'lucide-react';

const AllResolvedComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAllComplaints = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/resolvedComplaints`);
        setComplaints(res.data.resolvedComplaints || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    getAllComplaints();
  }, []);

  // Format Date Helper
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-green-600">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <CheckCircle size={48} className="opacity-50" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-8">
      
      {/* Page Header */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <div className="flex items-center gap-3 mb-1">
                <div className="bg-green-100 p-2 rounded-lg text-green-600">
                    <CheckCircle size={24} />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Resolved Complaints</h1>
            </div>
            <p className="text-gray-500 text-sm ml-11">
                List of all successfully closed grievances.
            </p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border shadow-sm text-sm text-gray-600 font-medium">
            Total Resolved: <span className="text-green-600 font-bold">{complaints.length}</span>
        </div>
      </div>

      {/* Table Container */}
      <div className="max-w-7xl mx-auto bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                <th className="px-6 py-4">Complaint Title</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Citizen</th>
                <th className="px-6 py-4">Resolution Note</th>
                <th className="px-6 py-4">Created At</th>
                 <th className="px-6 py-4">Resolved At</th>
                <th className="px-6 py-4">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {complaints.length > 0 ? (
                complaints.map((complaint, index) => (
                  <motion.tr 
                    key={complaint._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50/80 transition-colors group"
                  >
                    {/* Title Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <FileText size={16} />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">{complaint.type}</p>
                            <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1 mt-1">
                                <CheckCircle size={10} /> Resolved
                            </span>
                        </div>
                      </div>
                    </td>

                    {/* Department Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Building size={14} className="text-gray-400" />
                        {complaint.department || "General"}
                      </div>
                    </td>

                    {/* Citizen Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <User size={14} className="text-gray-400" />
                        {complaint.userName || "Anonymous"}
                      </div>
                    </td>

                    {/* Resolution Note Column */}
                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-sm text-gray-500 truncate" title={complaint.resolution || complaint.adminComment}>
                        {complaint.remarks || "No details provided"}
                      </p>
                    </td>

                    {/* Date Column */}
                    <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-gray-400" />
                            {formatDate(complaint.createdAt)}
                        </div>
                    </td>


                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-gray-400" />
                            {formatDate(complaint.updatedAt)}
                        </div>
                    </td>

                    {/* Rating Column */}
                    <td className="px-6 py-4">
                        {complaint.rating ? (
                            <div className="flex items-center gap-1 text-amber-500 font-bold text-sm bg-amber-50 px-2 py-1 rounded w-fit">
                                <Star size={14} fill="currentColor" />
                                {complaint.rating}
                            </div>
                        ) : (
                            <span className="text-gray-400 text-xs italic">Not rated</span>
                        )}
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                        <Search size={32} className="opacity-50" />
                        <p>No resolved complaints found in the records.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllResolvedComplaints;