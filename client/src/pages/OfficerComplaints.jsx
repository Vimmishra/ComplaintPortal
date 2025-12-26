import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion"; 

import {
  Loader2,
  AlertTriangle,
  Eye,
  X,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Building,
  MapPin,
  Phone,
  FileText
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const OfficerComplaints = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [remarks, setRemarks] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  
  // New State for Image Viewer
  const [viewImage, setViewImage] = useState(null);

  const navigate = useNavigate();

  // For confirm resolve dialog
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [resolveId, setResolveId] = useState(null);

  const updateStatus = async (complaintId) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/registerOfficer/updateStatus/${complaintId}`
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setRemarks(e.target.value);
  };

  const markAsResolved = async () => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/registerOfficer/resolved/${resolveId}/${user._id}`,
        {
          remarks,
        }
      );
      setConfirmDialog(false);
      setSelectedComplaint(null);

      // refresh list
      setComplaints((prev) =>
        prev.map((c) =>
          c._id === resolveId ? { ...c, status: "Resolved" } : c
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!user?._id) return;

    const getAllComplaints = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/registerOfficer/complaints/${user._id}`
        );

        if (res.data?.complaints?.complaints) {
          setComplaints(res.data.complaints.complaints);
        } else {
          setComplaints([]);
        }

        setLoading(false);
      } catch (err) {
        setError("Failed to load complaints.");
        setLoading(false);
      }
    };

    getAllComplaints();
  }, [user]);

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gray-50/50">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Officer Dashboard</h1>
        <p className="text-gray-500">Manage and resolve assigned complaints.</p>
      </motion.div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center h-64 text-blue-600">
          <Loader2 className="animate-spin h-8 w-8 mr-2" /> 
          <span className="text-lg">Loading complaints...</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="mt-3 p-4 bg-red-100 border border-red-200 text-red-700 rounded-lg flex items-center gap-2"
        >
          <AlertTriangle className="h-5 w-5" /> {error}
        </motion.div>
      )}

      {/* TABLE */}
      {!loading && complaints.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white shadow-sm border rounded-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Verified</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                <AnimatePresence>
                  {complaints.map((c, index) => (
                    <motion.tr 
                      key={c._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{c.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{c.userName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{c.department}</td>

                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          c.status === "Resolved" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                        }`}>
                          {c.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {c.verified ? (
                          <div className="flex items-center justify-center text-green-600">
                            <CheckCircle size={18} className="mr-1" />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center text-amber-500">
                            <AlertTriangle size={18} className="mr-1" />
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center items-center gap-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedComplaint(c);
                              updateStatus(c._id);
                            }}
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            <Eye size={16} className="mr-2" /> Details
                          </Button>

                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() =>
                              navigate("/complaint-chat", {
                                state: {
                                  userPhone: user._id,
                                  officerId: c.number,
                                  complaintId: c._id,
                                },
                              })
                            }
                          >
                            Chat
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {!loading && complaints.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No complaints found</h3>
          <p className="text-gray-500">Good job! All caught up.</p>
        </div>
      )}

      {/* VIEW DETAILS MODAL (Custom Framer Modal) */}
      <AnimatePresence>
        {selectedComplaint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-5xl max-h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b bg-gray-50">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Complaint Details</h2>
                    <p className="text-sm text-gray-500">ID: {selectedComplaint._id}</p>
                </div>
                <button
                  className="p-2 bg-white hover:bg-gray-100 rounded-full transition-colors border shadow-sm"
                  onClick={() => setSelectedComplaint(null)}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body - SCROLLABLE */}
              <div className="overflow-y-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* LEFT SIDE: Complaint Details */}
                  <div className="space-y-6">
                    <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                      <h3 className="text-sm font-semibold text-blue-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                        <FileText size={16}/> Complaint Info
                      </h3>
                      <div className="space-y-3">
                          <div>
                            <span className="text-xs text-gray-500 block">Category</span>
                            <span className="font-medium text-gray-900">{selectedComplaint.type}</span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 block">Description</span>
                            <p className="text-gray-700 leading-relaxed">{selectedComplaint.description}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-xs text-gray-500 block mb-1">City</span>
                                <div className="flex items-center gap-1 text-gray-800 font-medium">
                                    <MapPin size={14} className="text-gray-400"/> {selectedComplaint.city}
                                </div>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 block mb-1">Date</span>
                                <div className="flex items-center gap-1 text-gray-800 font-medium">
                                    <Clock size={14} className="text-gray-400"/> 
                                    {new Date().toLocaleDateString()} 
                                </div>
                            </div>
                          </div>
                      </div>
                    </div>

                    {/* Media Section */}
                    {(selectedComplaint.images?.length > 0 || selectedComplaint.video) && (
                        <div>
                            <h3 className="font-semibold mb-3 text-gray-900">Evidence Media</h3>
                            {selectedComplaint.images?.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 mb-4">
                                {selectedComplaint.images.map((img, i) => (
                                <img
                                    key={i}
                                    src={img}
                                    alt="Evidence"
                                    onClick={() => setViewImage(img)} // ADDED CLICK HANDLER
                                    className="w-full h-24 rounded-lg border object-cover cursor-pointer hover:opacity-90 transition-opacity hover:scale-105 transform duration-200"
                                />
                                ))}
                            </div>
                            )}
                            {selectedComplaint.video && (
                            <div className="rounded-lg overflow-hidden border bg-black">
                                <video src={selectedComplaint.video} controls className="w-full max-h-48" />
                            </div>
                            )}
                        </div>
                    )}

                      {/* TIMELINE */}
                      {selectedComplaint.timeline?.length > 0 && (
                      <div className="pt-4 border-t">
                        <h3 className="font-semibold mb-3 text-gray-900">Progress Timeline</h3>
                        <div className="relative pl-4 border-l-2 border-gray-200 space-y-6">
                          {selectedComplaint.timeline.map((t, i) => (
                            <div key={i} className="relative">
                                <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-blue-500 ring-4 ring-white"></div>
                                <p className="font-medium text-gray-900 text-sm">{t.status}</p>
                                <p className="text-xs text-gray-500">{new Date(t.time).toLocaleString()}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* RIGHT SIDE: Employee/User Details & Actions */}
                  <div className="space-y-6">
                    
                    {/* Status Card */}
                    <div className="bg-white border rounded-lg p-5 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Current Status</h3>
                        <div className="flex justify-between items-center">
                            <span className={`px-4 py-1.5 rounded-full font-medium text-sm ${
                                selectedComplaint.status === 'Resolved' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                                {selectedComplaint.status}
                            </span>
                            
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Verification:</span>
                                {selectedComplaint.verified ? (
                                    <span className="flex items-center gap-1 text-green-600 font-bold text-sm">
                                        <CheckCircle size={16} /> Verified
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-red-500 font-bold text-sm">
                                        <XCircle size={16} /> Unverified
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Involved Parties */}
                    <div className="bg-gray-50 rounded-lg p-5 border">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <User size={16} /> Involved Parties
                        </h3>
                        
                        <div className="space-y-4">
                            <div className="flex gap-4 justify-between items-center pb-3 border-b border-gray-200">
                                <div>
                                    <span className="text-xs text-gray-500 uppercase">Assigned Employee</span>
                                    <p className="font-medium text-gray-900">{selectedComplaint.empName}</p>
                                </div>

                                  <div>
                                    <span className="text-xs text-gray-500 uppercase">Employee ID</span>
                                    <p className="font-medium text-gray-900">{selectedComplaint.empId}</p>
                                </div>

                                  <div>
                                    <span className="text-xs text-gray-500 uppercase">Active complaints on employee</span>
                                    <p className="font-medium text-gray-900">{selectedComplaint.activeComplaintsOfEmployee}</p>
                                </div>

                                <div className="text-right">
                                     <span className="text-xs text-gray-500 uppercase">Department</span>
                                     <div className="flex items-center justify-end gap-1 text-gray-800">
                                        <Building size={14} className="text-gray-400" /> {selectedComplaint.department}
                                     </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <div>
                                    <span className="text-xs text-gray-500 uppercase">Reported By</span>
                                    <p className="font-medium text-gray-900">{selectedComplaint.userName}</p>
                                </div>
                                <div className="text-right">
                                     <span className="text-xs text-gray-500 uppercase">Contact</span>
                                     <div className="flex items-center justify-end gap-1 text-gray-800">
                                        <Phone size={14} className="text-gray-400" /> {selectedComplaint.number}
                                     </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions Area */}
                    <div className="pt-6 mt-6 border-t">
                        <h3 className="font-semibold mb-3 text-gray-900">Actions</h3>
                        <div className="flex flex-col gap-3">
                            <Button 
                                className="w-full bg-green-600 hover:bg-green-700 h-11 text-md shadow-md transition-all hover:shadow-lg"
                                onClick={() => {
                                    setResolveId(selectedComplaint._id);
                                    setConfirmDialog(true);
                                }}
                            >
                                <CheckCircle className="mr-2 h-5 w-5" /> Mark as Resolved
                            </Button>
                            
                            <Button 
                                variant="outline" 
                                className="w-full border-gray-300 hover:bg-gray-50"
                                onClick={() => setSelectedComplaint(null)}
                            >
                                Close Details
                            </Button>
                        </div>
                    </div>

                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

       {/* FULL SCREEN IMAGE VIEWER */}
       <AnimatePresence>
        {viewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            onClick={() => setViewImage(null)} // Close on background click
          >
            <button
              className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              onClick={() => setViewImage(null)}
            >
              <X size={32} />
            </button>
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              src={viewImage}
              alt="Full screen evidence"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()} // Prevent close when clicking the image itself
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONFIRM RESOLVE DIALOG (ShadCN) */}
      <Dialog open={confirmDialog} onOpenChange={setConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Confirm Resolution</DialogTitle>
            <DialogDescription>
              Are you sure you want to mark this complaint as resolved? This action will update the citizen status.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
             <label className="text-sm font-medium text-gray-700 mb-2 block">Resolution Remarks</label>
             <Input 
                type="text" 
                placeholder="E.g. Issue fixed, citizen satisfied..." 
                onChange={handleChange} 
                className="w-full"
            />
          </div>

          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setConfirmDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={markAsResolved}>
              Yes, Resolve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OfficerComplaints;