import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import React, { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, MessageSquare } from "lucide-react";

const EmployeeRatingDetails = () => {
  const { user } = useAuth();
  const empId = user?._id;

  const [comments, setComments] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!empId) return;

    const getAllComments = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/add/employeeComments/${empId}`
        );

        setComments(res.data.comments || []);
        setAvgRating(res.data.avgRating || 0);
        setTotalRatings(res.data.totalRatings || 0);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getAllComments();
  }, [empId]);

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.round(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-muted-foreground"
        }`}
      />
    ));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Loading ratings...</p>
      </div>
    );
  }

  return (
    <div className="bg-muted/40 min-h-screen p-4 sm:p-6 lg:p-10">
      <Card className="mx-auto w-full max-w-2xl lg:max-w-none lg:min-h-screen">
        <CardHeader className="border-b">
          <CardTitle className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xl font-semibold">Employee Ratings</span>
            <Badge variant="secondary" className="text-sm">
              {totalRatings} Ratings
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 lg:p-10">
          {/* Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div className="text-center sm:text-left">
              <p className="text-5xl font-bold">{avgRating.toFixed(1)}</p>
              <p className="text-sm text-muted-foreground mt-1">
                out of 5
              </p>
            </div>

            <div>
              <div className="flex gap-1 justify-center sm:justify-start">
                {renderStars(avgRating)}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Based on {totalRatings} people
              </p>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Comments */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <h4 className="font-semibold text-lg">All Comments</h4>
            </div>

            {comments.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No comments available
              </p>
            ) : (
              <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-2">
                {comments.map((comment, index) => (
                  <div
                    key={index}
                    className="rounded-xl border bg-background p-4 hover:shadow-sm transition"
                  >
                    <p className="text-sm">
                      <span className="font-medium mr-1">
                        #{index + 1}
                      </span>
                      {comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeRatingDetails;
