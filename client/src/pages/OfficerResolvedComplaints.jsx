import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion"; // Animation library
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Eye, Search, Star } from "lucide-react";
import { Input } from "@/components/ui/input"; // Assuming you have this shadcn component
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ResolvedComplaints = () => {
  const { user } = useAuth();
  const [resolvedComplaints, setResolvedComplaints] = useState([]);
  const [officerRatings, setOfficerRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [searchParams, setSearchParams] = useState("");

  useEffect(() => {
    if (!user?._id) return;

    const fetchResolvedComplaints = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/registerOfficer/resolvedComplaints/${user._id}`,
          { withCredentials: true }
        );

        const officer = res.data.resolvedComplaints;
        setResolvedComplaints(officer.resolvedComplaints || []);
        setOfficerRatings(officer.ratings || []);
      } catch (err) {
        console.error("Error fetching resolved complaints:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResolvedComplaints();
  }, [user]);

  // Enhanced Search Logic: Case insensitive and checks multiple fields
  const filteredComplaints = resolvedComplaints.filter((complaint) => {
    const searchLower = searchParams.toLowerCase();
    return (
      (complaint.city && complaint.city.toLowerCase().includes(searchLower)) ||
      (complaint.type && complaint.type.toLowerCase().includes(searchLower)) ||
      (complaint.category && complaint.category.toLowerCase().includes(searchLower)) ||
      (complaint._id && complaint._id.includes(searchParams))
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 py-8"
    >
      {/* Header Section: Title on Left, Search on Right */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-blue-700 tracking-tight">
          Resolved Complaints
        </h2>

        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Search by city, type, or ID..."
            type="text"
            value={searchParams}
            onChange={(e) => setSearchParams(e.target.value)}
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        {resolvedComplaints.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p>You have not resolved any complaints yet.</p>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <Search className="w-8 h-8 mb-2 text-gray-300" />
            <p>No results found matching "{searchParams}"</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Resolved On</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <AnimatePresence>
                {filteredComplaints.map((complaint) => {
                  const complaintRatings = officerRatings.filter(
                    (r) => r.complaint.toString() === complaint._id.toString()
                  );

                  return (
                    <TableRow 
                      key={complaint._id} 
                      className="hover:bg-blue-50/50 transition-colors"
                    >
                      <TableCell className="font-medium text-gray-900">
                        {complaint.type || "—"}
                      </TableCell>
                      <TableCell>{complaint.category || "General"}</TableCell>
                      <TableCell>{complaint.city || "N/A"}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                          Resolved
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(complaint.updatedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <button
                              className="inline-flex items-center space-x-1 px-3 py-1.5 text-sm font-medium rounded-md bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all shadow-sm"
                              onClick={() => setSelectedRatings(complaintRatings)}
                            >
                              <Eye size={16} />
                              <span>View</span>
                            </button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <Star className="text-yellow-500 w-5 h-5 fill-current" />
                                Ratings & Feedback
                              </DialogTitle>
                            </DialogHeader>

                            <div className="max-h-[60vh] overflow-y-auto pr-1">
                              {selectedRatings.length > 0 ? (
                                <div className="mt-2 space-y-4">
                                  {selectedRatings.map((r) => (
                                    <motion.div 
                                      initial={{ opacity: 0, scale: 0.95 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      key={r._id} 
                                      className="border border-gray-100 rounded-lg p-4 bg-gray-50/50"
                                    >
                                      <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center">
                                          {[1, 2, 3, 4, 5].map((i) => (
                                            <Star
                                              key={i}
                                              size={16}
                                              className={`${
                                                i <= r.rating
                                                  ? "text-yellow-400 fill-current"
                                                  : "text-gray-200"
                                              }`}
                                            />
                                          ))}
                                        </div>
                                        <span className="text-xs text-gray-400">
                                          {new Date(r.createdAt).toLocaleDateString()}
                                        </span>
                                      </div>
                                      <p className="text-sm text-gray-700 italic">
                                        "{r.comment || "No comment provided."}"
                                      </p>
                                    </motion.div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-8">
                                  <p className="text-gray-500 text-sm">
                                    No feedback provided for this complaint yet.
                                  </p>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </AnimatePresence>
            </TableBody>
          </Table>
        )}
      </div>
    </motion.div>
  );
};

export default ResolvedComplaints;