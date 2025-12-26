import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea"; // Shadcn Textarea
import { Star } from "lucide-react"; // lucide-react icons

const RateOfficer = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const backendURL = `${import.meta.env.VITE_API_URL}`; // replace with your backend URL
  const { officerId, complaintId } = useParams();

  const submitRating = async () => {
    if (!rating || rating < 1 || rating > 5) {
      setMessage("Please provide a valid rating between 1 and 5");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/rateOfficer/${officerId}/rate/${complaintId}`,
        { rating, comment },
        { withCredentials: true }
      );

      setMessage(res.data.message);
      setRating(0);
      setHover(0);
      setComment("");
    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.message || "Something went wrong, try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto border rounded-xl shadow-lg mt-16 bg-white sm:p-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Rate Officer
      </h2>

      {/* Star Rating */}
      <div className="mb-6 text-center">
        <label className="block mb-2 font-medium text-gray-700 text-lg">
          Rating
        </label>
        <div className="flex justify-center space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={40}
              className={`cursor-pointer transition-transform duration-200 ${
                star <= (hover || rating)
                  ? "text-yellow-400 scale-110"
                  : "text-gray-300"
              }`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            />
          ))}
        </div>
      </div>

      {/* Shadcn Textarea for Comment */}
      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-700 text-lg">
          Comment
        </label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your comment..."
          className="w-full border rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          rows={5}
        />
      </div>

      {message && (
        <p className="mb-4 text-center text-sm text-red-500">{message}</p>
      )}

      <button
        onClick={submitRating}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium text-lg hover:bg-blue-700 transition duration-300"
      >
        {loading ? "Submitting..." : "Submit Rating"}
      </button>
    </div>
  );
};

export default RateOfficer;
