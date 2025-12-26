import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Star, Download } from "lucide-react";
import { fetchAnalytics } from "@/api/helpers/analyticsRoutes";
import * as XLSX from "xlsx";

export default function TopRatedEmployees() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchAnalytics().then((data) => setEmployees(data.topRatedEmployees));
  }, []);

  // Function to download Excel
  const downloadExcel = () => {
    // Prepare data for Excel
    const excelData = employees.map((emp) => ({
      EmpId: emp.empId,
      Name: emp.name,
      Department: emp.department,
      Rating: emp.avgRating,
    }));

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "TopRatedEmployees");

    // Trigger download
    XLSX.writeFile(workbook, "TopRatedEmployees.xlsx");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Top Rated Employees</h1>
        <button
          onClick={downloadExcel}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          <Download className="w-4 h-4" /> Download Excel
        </button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>EmpId</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Rating</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((emp) => (
              <TableRow key={emp._id}>
                <TableCell>{emp.empId}</TableCell>
                <TableCell className="flex items-center gap-2">
                  <Star className="text-yellow-500" />
                  {emp.name}
                </TableCell>
                <TableCell>{emp.department}</TableCell>
                <TableCell>{emp.avgRating}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
