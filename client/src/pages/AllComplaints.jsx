import { useEffect, useState } from "react";
import axios from "axios";
import ComplaintModal from "./ComplaintModal";

export default function ComplaintsTable() {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/allComplaints`);
        console.log(res)
        setComplaints(res.data.complaints);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);



  const updateStatus = async(complaintId)=>{

     try{

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/updateComplaint/${complaintId}`)

      console.log(res.data)

     }

     catch(err){
      console.log(err, "error while updating status of complaint")
     }
  }




  if (loading) return <div className="text-center p-5">Loading complaints...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">All Complaints</h2>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">#</th>
              <th className="p-2 border">Complaint ID</th>
              <th className="p-2 border">Employee ID</th>
              <th className="p-2 border">EmployeeName</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {complaints.map((complaint, index) => (
              <tr key={complaint._id} className="text-center">
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{complaint._id}</td>
                <td className="border p-2">{complaint.empId}</td>
                <td className="border p-2">{complaint.empName}</td>
                <td className="border p-2">{complaint.status}</td>

                <td className="border p-2">
                  <button
                    onClick={() => {setSelectedComplaint(complaint);
                                   updateStatus(complaint._id)     
                    }}
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}

            {complaints.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-600">
                  No complaints found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* VIEW MODAL */}
      {selectedComplaint && (
        <ComplaintModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
        />
      )}
    </div>
  );
}
  