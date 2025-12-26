import cron from "node-cron";
import Complaint from "../models/Complaint.js";
import Officer from "../models/Officer.js";
import { officerAssignedComplaint, sendAssignedMessage } from "../helpers/twilio.js";

export const assignComplaintAutomatically = () => {

    console.log("cron job initialised...")
  // Run every midnight at 00:00
  cron.schedule("0 0 * * *", async () => {
    try {
      console.log("Auto assigning complaints...");

      const twoDaysAgo = new Date();

      twoDaysAgo.setDate(twoDaysAgo.getDate() -2);
     

      const complaints = await Complaint.find({
        createdAt: { $lte: twoDaysAgo },
        status: "Received", 
        
      });

      if(!complaints){
        console.log("no complaints found")
      }

      for (const complaint of complaints) {
        const officer = await Officer.findOne({
          department: complaint.department,
          city: complaint.city,
        });

        if (!officer) {
          console.log(
            `No officer found for ${complaint.department}, ${complaint.city}`
          );
          continue;
        }

        // ✅ update officer
        officer.complaints.push(complaint._id);
        officer.assignedComplaints =
          (officer.assignedComplaints || 0) + 1;

        // ✅ update complaint
        complaint.status = "Assigned";
        complaint.assignedTo = [officer._id];
        complaint.verified = true;


        await sendAssignedMessage(complaint.number, complaint._id);
        await officerAssignedComplaint(officer.phone)

        await officer.save()
        await complaint.save();
      }

    } catch (err) {
      console.error("Cron error:", err);
    }
  });
};
