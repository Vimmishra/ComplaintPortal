import React, { useState } from "react";
import {
  X,
  Phone,
  User,
  Building2,
  CheckCircle,
  Trash2,
  MapPin,
  AlertCircle,
  Briefcase,
  Star,
  QrCode,
  Image as ImageIcon,
  Video,
  PlayCircle,
  Maximize2
} from "lucide-react";
import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ComplaintModal = ({ complaint, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [openVerify, setOpenVerify] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  
  // State for Full Screen Media Viewer
  const [mediaViewer, setMediaViewer] = useState({ open: false, url: null, type: null });

  if (!complaint) return null;

  const emp = complaint.employeeDetails;

  // --- DATA NORMALIZATION FOR MEDIA ---
  // This handles both cases: if 'image' is a single string OR if 'images' is an array
  const imageList = Array.isArray(complaint.images) && complaint.images.length > 0 
    ? complaint.images 
    : complaint.image 
      ? [complaint.image] 
      : [];

  const hasMedia = imageList.length > 0 || complaint.video;

  // --- ACTIONS ---

  const deleteComplaint = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/deleteComplaint/${complaint._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error deleting complaint");
    } finally {
      setLoading(false);
      setOpenDelete(false);
    }
  };

  const verifyComplaint = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/admin/verifyComplaint/${complaint._id}`,
        { verified: true, status: "Verified" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await AssignComplaintToOfficer();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error verifying complaint");
    } finally {
      setLoading(false);
      setOpenVerify(false);
    }
  };

  const AssignComplaintToOfficer = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/assignComplaint/${complaint._id}`
      );
    } catch (err) {
      console.log(err);
    }
  };

  // --- RENDER HELPERS ---

  const StatusBadge = ({ status, verified }) => {
    if (verified) return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">Verified</span>;
    return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">{status || "Pending"}</span>;
  };

  return (
    <>
      {/* --- MAIN MODAL BACKDROP --- */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200">
        <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          
          {/* HEADER */}
          <div className="p-6 border-b flex justify-between items-start bg-gray-50">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                Complaint Details
                <StatusBadge status={complaint.status} verified={complaint.verified} />
              </h1>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                <span className="font-mono text-xs bg-gray-200 px-2 py-0.5 rounded">ID: {complaint._id.slice(-6).toUpperCase()}</span>
                <span>•</span>
                <span>{new Date(complaint.createdAt || Date.now()).toLocaleDateString()}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* ACTION BUTTONS */}
              {!complaint.verified && (
                <Button 
                  onClick={() => setOpenVerify(true)}
                  className="bg-green-600 hover:bg-green-700 text-white gap-2 shadow-sm"
                >
                  <CheckCircle size={18} /> Verify & Assign
                </Button>
              )}
              
              <Button 
                variant="destructive" 
                onClick={() => setOpenDelete(true)}
                className="bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 gap-2"
              >
                <Trash2 size={18} /> Delete
              </Button>

              <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors ml-2">
                <X size={24} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* SCROLLABLE CONTENT */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* === LEFT COLUMN: COMPLAINT INFO & MEDIA === */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col gap-6">
                  
                  {/* Basic Info */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4 border-b pb-3">
                      <AlertCircle className="text-blue-500" size={20} />
                      Incident Report
                    </h2>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                              <span className="text-xs text-gray-400 uppercase font-bold tracking-wider block mb-1">Type</span>
                              <span className="font-medium text-gray-800">{complaint.type}</span>
                          </div>


 <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                              <span className="text-xs text-gray-400 uppercase font-bold tracking-wider block mb-1">UserName</span>
                              <span className=" flex items-center gap-1 font-medium text-gray-800"><User size={14} className="text-red-400"/> {complaint.userName}</span>
                          </div>


                          
 <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                              <span className="text-xs text-gray-400 uppercase font-bold tracking-wider block mb-1">User Number</span>
                              <span className= " flex items-center gap-1 font-medium text-gray-800"><Phone size={14} className="text-red-400"/> {complaint.number}</span>
                          </div>


                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                              <span className="text-xs text-gray-400 uppercase font-bold tracking-wider block mb-1">Location</span>
                              <span className="font-medium text-gray-800 flex items-center gap-1">
                                  <MapPin size={14} className="text-red-400"/> {complaint.city}
                              </span>
                          </div>
                      </div>

                      <div>
                        <span className="text-xs text-gray-400 uppercase font-bold tracking-wider block mb-2">Description</span>
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap min-h-[100px]">
                          {complaint.description}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Media Section (Gallery) */}
                  {hasMedia ? (
                    <div className="border-t pt-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                         Attached Evidence
                         <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-full">
                           {imageList.length + (complaint.video ? 1 : 0)} Items
                         </span>
                      </h3>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        
                        {/* Render All Images */}
                        {imageList.map((imgUrl, index) => (
                          <div 
                            key={index}
                            className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border cursor-pointer hover:shadow-md transition-all"
                            onClick={() => setMediaViewer({ open: true, url: imgUrl, type: 'image' })}
                          >
                            <img 
                              src={imgUrl} 
                              alt={`Evidence ${index + 1}`} 
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                <div className="bg-white/90 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 shadow-sm">
                                  <Maximize2 size={14} className="text-gray-700"/>
                                </div>
                            </div>
                            <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded flex items-center gap-1">
                                <ImageIcon size={8} /> IMG {index + 1}
                            </div>
                          </div>
                        ))}

                        {/* Render Video if exists */}
                        {complaint.video && (
                          <div 
                            className="group relative aspect-square bg-gray-900 rounded-lg overflow-hidden border cursor-pointer hover:shadow-md transition-all"
                            onClick={() => setMediaViewer({ open: true, url: complaint.video, type: 'video' })}
                          >
                            <video 
                              src={complaint.video} 
                              className="w-full h-full object-cover opacity-80"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <PlayCircle size={32} className="text-white opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                            </div>
                            <div className="absolute bottom-1 left-1 bg-red-600/80 text-white text-[9px] px-1.5 py-0.5 rounded flex items-center gap-1">
                                <Video size={8} /> VIDEO
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="border-t pt-4">
                        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-gray-400">
                             <ImageIcon size={28} className="mb-2 opacity-50" />
                             <span className="text-xs">No media evidence attached</span>
                        </div>
                    </div>
                  )}

                </div>
              </div>

              {/* === RIGHT COLUMN: EMPLOYEE INFO === */}
              <div className="space-y-6">
                 {emp ? (
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full relative overflow-hidden">
                        {/* Decorative Background Element */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full z-0 opacity-50"></div>

                        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4 border-b pb-3 relative z-10">
                            <User className="text-blue-500" size={20} />
                            Reported Employee
                        </h2>

                        <div className="flex flex-col md:flex-row gap-6 relative z-10">
                            {/* Avatar / QR Column */}
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold border-4 border-white shadow-sm">
                                    {emp.name?.charAt(0)}
                                </div>
                              
                            </div>

                            {/* Details Column */}
                            <div className="flex-1 space-y-3">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{emp.name}</h3>
                                    <p className="text-sm text-gray-500 font-mono">{emp.empId}</p>
                                </div>

                                <div className="space-y-2 text-sm text-gray-600 mt-2">
                                    <div className="flex items-center gap-2">
                                        <Building2 size={16} className="text-gray-400"/>
                                        <span>{emp.department}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Briefcase size={16} className="text-gray-400"/>
                                        <span>{emp.designation}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone size={16} className="text-gray-400"/>
                                        <span>{emp.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} className="text-gray-400"/>
                                        <span>{emp.city}</span>
                                    </div>
                                </div>

                                <div className="pt-3 mt-2 border-t flex items-center gap-4">
                                     <div className="flex items-center gap-1.5 bg-amber-50 px-2 py-1 rounded text-amber-700 text-sm font-medium">
                                        <Star size={14} fill="currentColor" />
                                        {emp.avgRating || "N/A"}
                                     </div>
                                     <span className="text-xs text-gray-400">
                                        Based on {emp.totalRatings || 0} reviews
                                     </span>
                                </div>
                            </div>
                        </div>
                    </div>
                 ) : (
                    <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-gray-400 h-full">
                        <User size={48} className="mb-2 opacity-50" />
                        <p>No specific employee linked to this complaint.</p>
                    </div>
                 )}
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="bg-gray-50 p-4 border-t text-center text-xs text-gray-400">
            Complaint Reference ID: {complaint._id}
          </div>

        </div>
      </div>

      {/* --- FULL SCREEN MEDIA VIEWER OVERLAY --- */}
      {mediaViewer.open && (
        <div className="fixed inset-0 z-60 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
            <button 
                onClick={() => setMediaViewer({ open: false, url: null, type: null })}
                className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors z-50"
            >
                <X size={32} />
            </button>

            <div className="w-full h-full flex items-center justify-center max-w-7xl max-h-[90vh]">
                {mediaViewer.type === 'image' ? (
                    <img 
                        src={mediaViewer.url} 
                        alt="Full Screen Evidence" 
                        className="max-w-full max-h-full object-contain rounded-md shadow-2xl"
                    />
                ) : (
                    <video 
                        src={mediaViewer.url} 
                        controls 
                        autoPlay
                        className="max-w-full max-h-full object-contain rounded-md shadow-2xl"
                    />
                )}
            </div>
        </div>
      )}

      {/* --- CONFIRMATION DIALOGS --- */}
      
      {/* Verify Dialog */}
      <Dialog open={openVerify} onOpenChange={setOpenVerify}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Complaint</DialogTitle>
            <DialogDescription>
              Are you sure you want to verify this complaint? This will officially register it and assign it to the appropriate officer for resolution.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenVerify(false)}>Cancel</Button>
            <Button onClick={verifyComplaint} disabled={loading} className="bg-green-600 hover:bg-green-700">
              {loading ? "Verifying..." : "Confirm Verify"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Complaint</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently remove the complaint record from the database.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDelete(false)}>Cancel</Button>
            <Button variant="destructive" onClick={deleteComplaint} disabled={loading}>
              {loading ? "Deleting..." : "Delete Permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ComplaintModal;