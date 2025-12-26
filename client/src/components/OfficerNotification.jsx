import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bell, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { io } from "socket.io-client";

// Connect to socket
const socket = io(`${import.meta.env.VITE_API_URL}`, { withCredentials: true });

const OfficerNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  // Mark all notifications as read on mount
  useEffect(() => {
    if (!user?._id) return;

    const markRead = async () => {
      try {
        await axios.patch(
          `${import.meta.env.VITE_API_URL}/api/registerOfficer/mark-read/${user._id}`,
          {},
          { withCredentials: true }
        );

        // Tell navbar/badge to reset via socket
        socket.emit("join", user._id); // make sure user is in their room
      } catch (error) {
        console.log("Error marking notifications read:", error);
      }
    };

    markRead();
  }, [user]);

  // Fetch notifications + live updates
  useEffect(() => {
    if (!user?._id) return;

    socket.emit("join", user._id); // join private room

    fetchNotifications();

    // Listen for new notifications
    socket.on("newNotification", (msg) => {
      if (msg.recieverId === user._id) {
        setNotifications((prev) => [msg, ...prev]);
      }
    });

    // Listen for notifications read event (badge reset)
    socket.on("notificationsRead", () => {
      // Optionally, you could also mark local notifications as read
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
    });

    return () => {
      socket.off("newNotification");
      socket.off("notificationsRead");
    };
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/registerOfficer/notification/${user._id}`,
        { withCredentials: true }
      );

      setNotifications(Array.isArray(res.data.messages) ? res.data.messages : []);
    } catch (error) {
      console.log("Error fetching notifications", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="max-w-3xl mx-auto p-5 mt-5">
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-4">
        <Bell className="text-yellow-600" /> Officer Notifications
      </h1>

      {loading && (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin h-8 w-8 text-green-600" />
        </div>
      )}

      {!loading && notifications.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No notifications from admin yet.
        </div>
      )}

      <div className="space-y-4">
        {!loading &&
          notifications.map((note) => (
            <div
              key={note._id}
              className={`bg-white shadow-sm border rounded-lg p-4 hover:shadow-md transition ${
                note.isRead ? "opacity-70" : ""
              }`}
            >
              <p className="text-gray-800 font-medium">{note.text}</p>
              <p className="text-gray-500 text-sm mt-1">
                {formatDate(note.createdAt)}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default OfficerNotification;
