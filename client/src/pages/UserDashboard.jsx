import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useSpring, useTransform } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Camera,
  Bot,
  FileEdit,
  ArrowRight,
  QrCode, // Added QrCode icon
  CheckCircle2
} from "lucide-react";
import { fetchAnalytics } from "@/api/helpers/analyticsRoutes";


const AnimatedCounter = ({ value }) => {
  const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) => Math.round(current).toLocaleString());

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
};


const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } },
};

// Scanner Line Animation for the QR Card
const scannerVariants = {
  animate: {
    top: ["10%", "90%", "10%"],
    opacity: [0.5, 1, 0.5],
    transition: { duration: 2.5, repeat: Infinity, ease: "linear" }
  }
};

const UserDashboard = () => {
  const [resolvedComplaints, setResolvedComplaints] = useState(0);

  useEffect(() => {
    fetchAnalytics().then((data) => {
        // Safe check for array
        setResolvedComplaints(data?.complaintsResolved || []);
    });
  }, []);

  const navigate = useNavigate();

  // Calculate the count based on array length
  const resolvedCount = resolvedComplaints;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      
     

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
       
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-linear-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-8 md:p-12 overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500/20 blur-3xl rounded-full" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-teal-500/20 blur-3xl rounded-full" />

          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-medium backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                System Operational • 24/7 Support
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                Empowering Voices, <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-200 to-teal-200">
                  Resolving Issues.
                </span>
              </h1>
              <p className="text-slate-300 max-w-lg text-lg leading-relaxed">
                The official platform for transparent grievance redressal. 
                Report issues instantly using AI assistance or QR scanning technology.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Button 
                  onClick={() => navigate("/scan-qr")}
                  size="lg" 
                  className="bg-emerald-500 text-white hover:bg-emerald-600 font-semibold rounded-xl border-none"
                >
                  <Camera className="mr-2 h-5 w-5" />
                  Scan QR Code
                </Button>
                <Button 
                  onClick={() => navigate("/trackComplaint")}
                  variant="outline" 
                  size="lg" 
                  className="bg-transparent border-white/30 text-white hover:bg-white/10 rounded-xl"
                >
                  Track Status
                </Button>
              </div>
            </div>

            
            <div className="relative hidden md:block group">
              <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-teal-600 rounded-2xl transform rotate-3 opacity-30 group-hover:rotate-2 transition-transform duration-500" />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black/50 aspect-video">
                <video
                  src="/video.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                />
              </div>
            </div>
          </div>
        </motion.div>

   
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Card 1: QR SCANNER (REPLACED AI CARD) */}
          <motion.div variants={itemVariants} className="md:col-span-2">
            <Card className="h-full border-emerald-100 shadow-sm hover:shadow-md transition-shadow duration-300 bg-linear-to-br from-white to-emerald-50/50 relative overflow-hidden">
              <CardHeader className="relative z-10">
                <div className="flex items-center justify-between">
                   <div className="p-2 bg-emerald-100 rounded-lg w-fit">
                      <QrCode className="w-6 h-6 text-emerald-700" />
                   </div>
                   <span className="text-xs font-bold px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md">FEATURED</span>
                </div>
                <CardTitle className="mt-4 text-xl text-slate-800">Scan & Report Instantly</CardTitle>
                <CardDescription>
                  Found a maintenance issue? Simply scan the QR code attached to the facility (streetlight, bin, road) to auto-fill location details and report immediately.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                 {/* Visual Representation of Scanning */}
                <div className="flex items-center gap-6">
                    <div className="relative w-32 h-32 bg-white rounded-xl border-2 border-slate-200 p-2 shadow-sm hidden sm:block">
                        <div className="w-full h-full bg-slate-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                             <QrCode className="text-white/20 w-16 h-16" />
                             {/* Scanning Line Animation */}
                             <motion.div 
                                variants={scannerVariants}
                                animate="animate"
                                className="absolute left-0 w-full h-1 bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)]" 
                             />
                        </div>
                    </div>
                    <div className="space-y-2 max-w-sm">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                             <CheckCircle2 size={16} className="text-emerald-600" /> Auto-detects Location
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                             <CheckCircle2 size={16} className="text-emerald-600" /> Instant Ticket Generation
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                             <CheckCircle2 size={16} className="text-emerald-600" /> No typing required for employee details
                        </div>
                    </div>
                </div>
              </CardContent>
              <CardFooter className="relative z-10">
                 <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => navigate("/scan-qr")}>
                   Open Scanner Camera <ArrowRight className="ml-2 h-4 w-4" />
                 </Button>
              </CardFooter>
              
              {/* Background decoration */}
              <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
                  <QrCode size={200} />
              </div>
            </Card>
          </motion.div>

          {/* Card 2: COUNTER CARD */}
          <motion.div variants={itemVariants}>
            <Card className="h-full border-teal-100 bg-teal-50/50 shadow-sm flex flex-col justify-between">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div className="p-2 bg-teal-100 rounded-lg w-fit">
                        <CheckCircle2 className="w-6 h-6 text-teal-700" />
                    </div>
                </div>
                <CardTitle className="mt-4 text-lg text-slate-800">Community Impact</CardTitle>
                <CardDescription>Total resolved complaints in your area.</CardDescription>
              </CardHeader>
              <CardContent>
                 <div className="text-5xl font-extrabold text-teal-700 tracking-tight">
                    <AnimatedCounter value={resolvedCount} />
                 </div>
                 <p className="text-sm text-teal-600/80 mt-2 font-medium">Issues Fixed successfully</p>
              </CardContent>
              <CardFooter>
                 <div className="w-full h-2 bg-teal-100 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="h-full bg-teal-500" 
                    />
                 </div>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Card 3: Manual Form */}
          <motion.div variants={itemVariants}>
            <Card className="h-full border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <div className="p-2 bg-orange-100 rounded-lg w-fit">
                   <FileEdit className="w-6 h-6 text-orange-700" />
                </div>
                <CardTitle className="mt-4 text-lg text-slate-800">Standard Filing</CardTitle>
                <CardDescription>
                  Use the traditional form to submit detailed documentation.
                </CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto">
                <Button variant="outline" className="w-full border-slate-300 text-slate-700" onClick={() => navigate("/formComplaint")}>
                  File Manually
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Card 4: AI COMPLAINT (Swapped to small slot) */}
          <motion.div variants={itemVariants}>
            <Card className="h-full border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <div className="p-2 bg-blue-100 rounded-lg w-fit">
                   <Bot className="w-6 h-6 text-blue-700" />
                </div>
                <CardTitle className="mt-4 text-lg text-slate-800">AI Assistant</CardTitle>
                <CardDescription>
                  Type naturally. AI will format your complaint.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => navigate("/chatbot")}>
                  Start Chat
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Card 5: Instructions */}
          <motion.div variants={itemVariants} className="md:col-span-2">
              <Card className="h-full bg-slate-900 text-white border-none shadow-xl">
                <CardHeader>
                   <CardTitle className="text-lg">Process</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     {/* Horizontal process flow since it's now col-span-2 */}
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { step: "01", title: "Capture", desc: "Scan or Click Photo" },
                            { step: "02", title: "Process", desc: "AI Verification" },
                            { step: "03", title: "Resolve", desc: "Authority Action" },
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col gap-1 p-3 rounded-lg bg-white/5 border border-white/10">
                                <span className="text-xl font-bold text-blue-400 opacity-50">{item.step}</span>
                                <h3 className="font-semibold text-sm">{item.title}</h3>
                                <p className="text-xs text-slate-400">{item.desc}</p>
                            </div>
                        ))}
                     </div>
                </CardContent>
             </Card>
          </motion.div>
        </motion.div>
      </main>
      
      {/* Footer Removed as requested */}

    </div>
  );
};

export default UserDashboard;