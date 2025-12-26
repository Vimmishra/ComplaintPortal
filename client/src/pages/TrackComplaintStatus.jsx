import React, { useState } from "react";
import axios from "axios";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Search, 
  MapPin, 
  Calendar, 
  FileText, 
  Building2, 
  MessageSquare,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge"; // Assuming you have shadcn Badge, or remove if not
import { Separator } from "@/components/ui/separator"; // Assuming you have shadcn Separator
import { useNavigate } from "react-router-dom";

export default function ComplaintTracker() {
  const [complaintId, setComplaintId] = useState("");
  const [complaint, setComplaint] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);


  const navigate = useNavigate();

  const steps = [
    { label: "Received", key: "Received", description: "Complaint has been logged." },
    { label: "Under Review", key: "Under-Review", description: "Authorities are assessing the issue." },
    { label: "Verified", key: "verified", description: "Details have been confirmed." },
    { label: "Assigned", key: "Assigned", description: "Officer has been deployed." },
    { label: "In Progress", key: "In Progress", description: "Resolution is underway." },
    { label: "Resolved", key: "Resolved", description: "Case closed successfully." },
  ];

  const fetchComplaint = async () => {
    if (!complaintId.trim()) return;

    setLoading(true);
    setMsg("");
    setComplaint(null);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/track`, {
        complaintId,
      });

      if (res.data.success) {
        setComplaint(res.data.complaint);
      } else {
        setMsg(res.data.message);
      }
    } catch (err) {
      setMsg(err.response?.data?.message || "Error fetching complaint");
    } finally {
      setLoading(false);
    }
  };




  const currentStepIndex = complaint
    ? steps.findIndex((s) => s.key === complaint.status)
    : -1;

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col items-center py-10 px-4 sm:px-6">
      <div className="w-full max-w-3xl space-y-8">
        
        {/* Header & Search Section */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Complaint Status Portal</h1>
          <p className="text-slate-500">Enter your unique ID to track real-time progress</p>
        </div>

        <Card className="border-slate-200 shadow-xl shadow-slate-200/50 bg-white">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="e.g. CMP-2024-8839"
                  className="pl-9 h-12 text-lg"
                  value={complaintId}
                  onChange={(e) => setComplaintId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchComplaint()}
                />
              </div>
              <Button 
                onClick={fetchComplaint} 
                className="h-12 px-8 text-base bg-blue-600 hover:bg-blue-700 transition-all"
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Track Status"}
              </Button>
            </div>
            
            {msg && (
              <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">{msg}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {complaint && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Left Column: Timeline */}
            <Card className="md:col-span-1 h-fit border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Timeline</CardTitle>
                <CardDescription>Current Status History</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative border-l-2 border-slate-100 ml-3 space-y-8 pb-2">
                  {steps.map((step, index) => {
                    const isCompleted = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;

                    return (
                      <div key={step.key} className="relative pl-6 group">
                        {/* Dot Indicator */}
                        <span
                          className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 transition-colors duration-300 z-10
                            ${isCompleted 
                              ? "bg-green-600 border-green-600" 
                              : "bg-white border-slate-300"
                            } 
                            ${isCurrent ? "ring-4 ring-green-100" : ""}
                          `}
                        >
                          {isCompleted && <CheckCircle2 className="h-3 w-3 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
                        </span>

                        <div className="flex flex-col">
                          <span className={`text-sm font-semibold ${isCompleted ? "text-slate-900" : "text-slate-400"}`}>
                            {step.label}
                          </span>
                          {isCurrent && (
                            <span className="text-xs text-blue-600 font-medium mt-0.5 animate-pulse">
                              Active Stage
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
    
            {/* Right Column: Details */}
            <div className="md:col-span-2 space-y-6">
              <Card className="border-slate-200 overflow-hidden">
                <div className="bg-slate-50/50 p-6 border-b border-slate-100 flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">{complaint.type}</h2>
                    <div className="flex items-center gap-2 mt-2 text-slate-500 text-sm">
                       <MapPin className="h-4 w-4" /> 
                       {complaint.city} • ID: #{complaintId || complaint._id?.slice(-6)}
                    </div>
                  </div>
                  {complaint.assignedTo  && complaint.status !=="Resolved" && (
                    <Button
                      onClick={() => navigate("/complaint-chat", {
                        state: {
                          officerId: complaint.assignedTo?._id,
                          complaintId: complaint.id,
                          userPhone: complaint.phone
                        },
                      })}
                      className="bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200"
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Chat with Officer
                    </Button>
                  )}
                </div>

                <CardContent className="p-6 space-y-6">
                  {/* Key Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InfoItem icon={Building2} label="Department" value={complaint.department} />
                    <InfoItem icon={Calendar} label="Submitted On" value={new Date(complaint.createdAt).toLocaleDateString("en-US", { dateStyle: 'medium' })} />
                    <InfoItem icon={Clock} label="Last Updated" value={new Date(complaint.updatedAt).toLocaleString()} />
                    <InfoItem icon={FileText} label="Current Status" value={complaint.status} highlight />
                  </div>

                  <Separator className="my-4" />

                  {/* Description & Remarks */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Description</h3>
                      <p className="text-slate-600 leading-relaxed text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
                        {complaint.description}
                      </p>
                    </div>

                    {complaint.remarks && (
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1">Officer Remarks</h3>
                        <p className="text-sm text-slate-600 italic border-l-4 border-blue-500 pl-3 py-1">
                          "{complaint.remarks}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Media Gallery */}
                  {(complaint.images.length > 0 || complaint.video) && (
                    <div className="pt-2">
                      <h3 className="font-semibold text-slate-900 mb-3">Attached Evidence</h3>
                      <div className="flex flex-wrap gap-4">
                        {complaint.images.map((img, i) => (
                          <div key={i} className="group relative overflow-hidden rounded-xl border border-slate-200 w-24 h-24 sm:w-32 sm:h-32">
                            <img
                              src={img}
                              alt="evidence"
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                          </div>
                        ))}
                        {complaint.video && (
                           <div className="w-full sm:w-auto mt-2">
                             <video controls className="max-h-48 rounded-lg border border-slate-200 bg-black">
                               <source src={complaint.video} />
                             </video>
                           </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper Component for Data Points
function InfoItem({ icon: Icon, label, value, highlight = false }) {
  return (
    <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
      <div className={`p-2 rounded-md ${highlight ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
        <p className={`font-medium ${highlight ? 'text-green-700' : 'text-slate-900'}`}>
          {value || "N/A"}
        </p>
      </div>
    </div>
  );
}