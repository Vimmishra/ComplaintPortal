import React from "react";
import { 
  Users, 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  BarChart3, 
  CheckCircle2, 
  ArrowRight,
  LayoutGrid
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const AdminDashBoard = () => {
  const navigate = useNavigate();

  const dashboardItems = [
    { 
      category: "Personnel",
      items: [
        { 
          title: "All Employees", 
          desc: "Manage government staff",
          icon: Users, 
          route: "/employeeList", 
          color: "text-blue-600", 
          bg: "bg-blue-100",
          border: "hover:border-blue-200"
        },
        { 
          title: "Officers List", 
          desc: "View registered officers",
          icon: ShieldCheck, 
          route: "/officersList", 
          color: "text-indigo-600", 
          bg: "bg-indigo-100",
          border: "hover:border-indigo-200"
        },
      ]
    },
    {
      category: "Performance & Analytics",
      items: [
        { 
          title: "Top Performers", 
          desc: "Highest rated staff",
          icon: TrendingUp, 
          route: "/topRatedEmployees", 
          color: "text-emerald-600", 
          bg: "bg-emerald-100",
          border: "hover:border-emerald-200"
        },
        { 
          title: "Complaint Analytics", 
          desc: "Statistical overview",
          icon: BarChart3, 
          route: "/complaintAnalytics", 
          color: "text-purple-600", 
          bg: "bg-purple-100",
          border: "hover:border-purple-200"
        },
        { 
            title: "Resolved Cases", 
            desc: "Successfully closed",
            icon: CheckCircle2, 
            route: "/resolvedComplaintsAnalytics", 
            color: "text-teal-600", 
            bg: "bg-teal-100",
            border: "hover:border-teal-200"
          },
      ]
    },
    {
      category: "Alerts & Attention",
      items: [
        { 
          title: "Low Rated Staff", 
          desc: "Performance concerns",
          icon: TrendingDown, 
          route: "/lowRatedEmployees", 
          color: "text-orange-600", 
          bg: "bg-orange-100",
          border: "hover:border-orange-200"
        },
        { 
          title: "High Complaint Rate", 
          desc: "Most reported staff",
          icon: AlertTriangle, 
          route: "/mostComplaintEmployees", 
          color: "text-red-600", 
          bg: "bg-red-100",
          border: "hover:border-red-200"
        },
      ]
    }
  ];

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back. Here is an overview of your system.</p>
          </div>
         
        </div>

        {/* Dashboard Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {dashboardItems.map((section, sectionIdx) => (
            <div key={sectionIdx} className="space-y-4">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider ml-1">
                {section.category}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {section.items.map((card, index) => (
                  <motion.div 
                    key={index} 
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className={`h-full cursor-pointer border shadow-sm hover:shadow-lg transition-all duration-300 group ${card.border}`}
                      onClick={() => navigate(card.route)}
                    >
                      <CardContent className="p-6 flex flex-col justify-between h-full gap-4">
                        <div className="flex justify-between items-start">
                          <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
                            <card.icon size={24} />
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400">
                             <ArrowRight size={20} />
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                            {card.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {card.desc}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashBoard;