import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./index.css";
import AuthPage from "./pages/Auth";
import Chat from "./pages/Chat";
import GovAddEmployee from "./pages/GovAddEmployee";
import EmployeeRegister from "./pages/EmployeeRegister";
import ComplaintForm from "./pages/Complaint";
import RateEmployee from "./pages/RateEmployee";
import ComplaintsTable from "./pages/AllComplaints";
import GovernmentAddOfficer from "./pages/GovAddOfficer";
import OfficerRegister from "./pages/OfficerRegister";
import FeedBackPage from "./pages/FeedBackPage";
import AIChatBot from "./pages/Chatbot";
import OfficersList from "./components/OfficersList";
import OfficerComplaints from "./pages/OfficerComplaints";
import EmployeeDetails from "./pages/EmployeeDetails";
import Officerdetails from "./pages/Officerdetails";
import ComplaintTracker from "./pages/TrackComplaintStatus";
import AdminProtectedRoute from "./components/protectedRoutes/adminProtectedRoute";
import AdminDashBoard from "./pages/AdminDashBoard";
import { useAuth } from "./context/AuthContext";
import AdminNavbar from "./components/AdminNavbar";
import ComplaintsAnalytics from "./components/ComplaintAnalytics";
import UserDashboard from "./pages/UserDashboard";
import QRComplaintScan from "./components/QRComplaintScan";
import UserNavbar from "./components/UserNavbar";
import ExcelUploader from "./components/BulkEmployeeUploader";
import OfficerBulkUploader from "./components/BulkOfficerUploader";
import EmployeeNavbar from "./components/EmployeeNavbar";
import AllEmployees from "./components/AllEmployees";
import TopRatedEmployees from "./components/TopRatedEmployees";
import OfficerNavbar from "./components/OfficerNavbar";
import OfficerNotification from "./components/OfficerNotification";
import ResolvedComplaints from "./pages/OfficerResolvedComplaints";
import FormComplaint from "./pages/FormComplaint";
import EmployeeRatingDetails from "./components/EmployeeRatingDetails";
import RateOfficer from "./pages/OfficerRating";
import Footer from "./components/Footer";
import ComplaintChat from "./pages/ComplaintChat";
import LowRatedEmployees from "./components/LowRatedEmployees";
import MostComplaintsEmployee from "./components/MostComplaintsEmployee";
import AllResolvedComplaints from "./components/AllResolvedComplaints";
import OfficerProtectedRoute from "./components/protectedRoutes/OfficerProtectedRoute";
import EmployeeProtectedRoutes from "./components/protectedRoutes/EmployeeProtectedRoutes";

function App() {
  const { user, loading } = useAuth(); // include loading

  // ⏳ Wait until AuthContext finishes checking cookies/session
  if (loading) {
    return <div className="p-5 text-center text-lg font-semibold">Loading...</div>;
  }

  return (
    <Router>

      {/* NAVBARS */}
      {user?.role === "admin" && <AdminNavbar />}

      {user == null && <UserNavbar />}

       {user?.role === "employee" && <EmployeeNavbar />}
 {user?.role === "officer" && <OfficerNavbar />}

      <Routes>

        {/* Public Routes */}
       
        <Route path="/chat" element={<Chat />} />
        
     
       
        <Route path="/chatbot" element={<AIChatBot />} />




      
         <Route path="/officerDetails" element={<OfficerProtectedRoute> <Officerdetails /> </OfficerProtectedRoute>} />
      
        <Route path="/officerComplaints" element={<OfficerProtectedRoute> <OfficerComplaints /> </OfficerProtectedRoute>} />
           <Route path="/officerNotification" element={<OfficerProtectedRoute> <OfficerNotification /> </OfficerProtectedRoute>} />

             <Route path="/ResolvedComplaints" element={<OfficerProtectedRoute> <ResolvedComplaints /> </OfficerProtectedRoute>} />



             
                    <Route path="/employeeDetails" element={<EmployeeProtectedRoutes> <EmployeeDetails /></EmployeeProtectedRoutes>} />
            <Route path="/employeeRatingdetails" element={ <EmployeeProtectedRoutes> <EmployeeRatingDetails /> </EmployeeProtectedRoutes>} />


{/*user: */}

 <Route path="/feedback/:empId" element={<FeedBackPage />} />
    
        <Route path="/rating/:empId" element={<RateEmployee />} />
 <Route path="/auth" element={<AuthPage />} />
    <Route path="/complaint/:empId" element={<ComplaintForm />} />
   <Route path="/complaint-chat" element={<ComplaintChat/>} />
 <Route path="/scan-qr" element={<QRComplaintScan />} />
 <Route path="/rateOfficer/:officerId/rate/:complaintId" element={<RateOfficer />} />
  <Route path="/" element={<UserDashboard />} />
 <Route path="/formComplaint" element={<FormComplaint/>} />

  <Route path="/trackComplaint" element={<ComplaintTracker />} />





        {/* Admin Protected Routes */}

        <Route path="/officersList" element={<AdminProtectedRoute> <OfficersList /> </AdminProtectedRoute>} />

         <Route path="/topRatedEmployees" element={ <AdminProtectedRoute><TopRatedEmployees /> </AdminProtectedRoute>} />

<Route path="/employeeList" element={ <AdminProtectedRoute><AllEmployees /> </AdminProtectedRoute>} />
                  <Route path="/officerList" element={  <AdminProtectedRoute> <OfficersList /> </AdminProtectedRoute>} />



  <Route
          path="/topRatedEmployees"
          element={
            <AdminProtectedRoute>
              <TopRatedEmployees />
            </AdminProtectedRoute>
          }
        />

        
  <Route
          path="/mostComplaintEmployees"
          element={
            <AdminProtectedRoute>
              <MostComplaintsEmployee />
            </AdminProtectedRoute>
          }
        />


          <Route
          path="/resolvedComplaintsAnalytics"
          element={
            <AdminProtectedRoute>
              <AllResolvedComplaints />
            </AdminProtectedRoute>
          }
        />



          <Route
          path="/lowRatedEmployees"
          element={
            <AdminProtectedRoute>
              <LowRatedEmployees />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/addGovEmployee"
          element={
            <AdminProtectedRoute>
              <GovAddEmployee />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/addOfficer"
          element={
            <AdminProtectedRoute>
              <GovernmentAddOfficer />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/AllComplaints"
          element={
            <AdminProtectedRoute>
              <ComplaintsTable />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/AdminDashBoard"
          element={
            <AdminProtectedRoute>
              <AdminDashBoard />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/complaintAnalytics"
          element={
            <AdminProtectedRoute>
              <ComplaintsAnalytics />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/BulkEmployee"
          element={
            <AdminProtectedRoute>
              <ExcelUploader />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/BulkOfficer"
          element={
            <AdminProtectedRoute>
              <OfficerBulkUploader />
            </AdminProtectedRoute>
          }
        />

        {/* If these should be admin-only, wrap them also */}
        <Route path="/addEmployee" element={<EmployeeRegister />} />
        <Route path="/registerOfficer" element={<OfficerRegister />} />

      </Routes>



      <Footer/>
    </Router>
  );
}

export default App;
