import React, { useEffect, useState } from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { fetchAnalytics } from "@/api/helpers/analyticsRoutes";

export default function ComplaintsAnalytics() {
  const [complaints, setComplaints] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    fetchAnalytics().then((data) => setComplaints(data.complaints));
  }, []);

  // ================= Analytics Data ====================

  const statusCount = complaints.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(statusCount).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  const COLORS = ["#00C49F", "#FF8042", "#0088FE", "#FF0000"];

  const complaintsByCity = complaints.reduce((acc, c) => {
    acc[c.city] = (acc[c.city] || 0) + 1;
    return acc;
  }, {});

  const barData = Object.entries(complaintsByCity).map(([city, count]) => ({
    city,
    count,
  }));

  // ================= View Dialog Open ====================
  const openComplaintDialog = (cmp) => {
    setSelectedComplaint(cmp);
    setOpenDialog(true);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Complaints Analytics</h1>

      
      <div className="grid lg:grid-cols-2 gap-6">
       
        <Card>
          <CardHeader>
            <CardTitle>Complaint Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

       
        <Card>
          <CardHeader>
            <CardTitle>Complaints by City</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="city" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

    
      <Card>
        <CardHeader>
          <CardTitle>All Complaints</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left border">Type</th>
                  <th className="p-3 text-left border">Status</th>
                  <th className="p-3 text-left border">City</th>
                  <th className="p-3 text-left border">Assigned To</th>
                  <th className="p-3 text-left border">Created At</th>
                  <th className="p-3 text-left border">Actions</th>
                </tr>
              </thead>

              <tbody>
                {complaints.map((cmp) => (
                  <tr key={cmp._id} className="border-t">
                    <td className="p-3 border">{cmp.type}</td>
                    <td
                      className={`p-3 border font-semibold ${
                        cmp.status === "Resolved"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {cmp.status}
                    </td>
                    <td className="p-3 border">{cmp.city}</td>
                    <td className="p-3 border">
                      {cmp.assignedTo || "Not Assigned"}
                    </td>
                    <td className="p-3 border">
                      {new Date(cmp.createdAt).toLocaleString()}
                    </td>
                    <td className="p-3 border">
                      <Button
                        size="sm"
                        onClick={() => openComplaintDialog(cmp)}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

  
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Complaint Details</DialogTitle>
          </DialogHeader>

          {selectedComplaint && (
            <div className="space-y-2">
              <p><strong>Type:</strong> {selectedComplaint.type}</p>
              <p><strong>Status:</strong> {selectedComplaint.status}</p>
              <p><strong>City:</strong> {selectedComplaint.city}</p>
              <p><strong>Description:</strong> {selectedComplaint.description}</p>
              <p><strong>Assigned To:</strong> {selectedComplaint.assignedTo || "Not Assigned"}</p>
              <p><strong>Created:</strong> {new Date(selectedComplaint.createdAt).toLocaleString()}</p>
              <p><strong>Updated:</strong> {new Date(selectedComplaint.updatedAt).toLocaleString()}</p>

              {selectedComplaint?.images?.length > 0 && (
                <div>
                  <strong>Images:</strong>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {selectedComplaint.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="Complaint"
                        className="w-full h-32 object-cover rounded-md"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
