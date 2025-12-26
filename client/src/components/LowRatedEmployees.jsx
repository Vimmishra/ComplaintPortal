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
import { TrendingDown } from "lucide-react";
import { fetchAnalytics } from "@/api/helpers/analyticsRoutes";

export default function LowRatedEmployees() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchAnalytics().then((data) => setEmployees(data.lowRatedEmployees));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-red-600">
        Low Rated Employees
      </h1>

      {/* ===================== DESKTOP TABLE ===================== */}
      <div className="hidden md:block rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Rating</TableHead>
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
                  <TrendingDown className="text-red-500 h-4 w-4" />
                  {emp.name}
                </TableCell>

                <TableCell className="text-red-600 font-semibold">
                  {emp.avgRating}
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
            <Card className="border-red-500">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2 font-semibold">
                  <TrendingDown className="text-red-500" />
                  {emp.name}
                </div>

                <p>
                  <span className="font-medium">Rating:</span>{" "}
                  <span className="text-red-600">{emp.avgRating}</span>
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
}
