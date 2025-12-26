import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { fetchAnalytics } from "@/api/helpers/analyticsRoutes";

const MostComplaintsEmployee = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchAnalytics().then((data) =>
      setEmployees(data.mostComplaintedEmployees)
    );
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-orange-600">
        Employees with Most Complaints
      </h1>

      {/* ===================== DESKTOP TABLE ===================== */}
      <div className="hidden md:block rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
                 <TableHead>EmployeeId</TableHead>
              <TableHead>Employee Name</TableHead>
              <TableHead>Total Complaints</TableHead>
                 <TableHead>Active Complaints</TableHead>
              <TableHead>Department</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {employees.map((emp, index) => (
              <motion.tr
                key={emp._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="border-b"
              >



                <TableCell className="flex items-center gap-2 font-medium">
                  <AlertTriangle className="text-orange-500 h-4 w-4" />
                  {emp.empId}
                </TableCell>

                <TableCell className=" items-center gap-2 font-medium">
                 
                  {emp.name}
                </TableCell>

                <TableCell className="font-semibold text-orange-600">
                  {emp.complaints.length}
                </TableCell>

                <TableCell className="font-semibold text-orange-600">
                  {emp.activeComplaints.length}
                </TableCell>

                <TableCell>{emp.department}</TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ===================== MOBILE CARDS ===================== */}
      <div className="md:hidden space-y-4">
        {employees.map((emp, index) => (
          <motion.div
            key={emp._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.08 }}
          >
            <Card className="border-orange-500">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2 font-semibold">
                  <AlertTriangle className="text-orange-500" />
                  {emp.name}
                </div>

                <p>
                  <span className="font-medium">Total Complaints:</span>{" "}
                  <span className="text-orange-600 font-semibold">
                    {emp.totalComplaints}
                  </span>
                </p>


                <p>
                  <span className="font-medium">Active Complaints:</span>{" "}
                  <span className="text-orange-600 font-semibold">
                    {emp.activeComplaints}
                  </span>
                </p>

                <p>
                  <span className="font-medium">Department:</span>{" "}
                  {emp.department}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MostComplaintsEmployee;
