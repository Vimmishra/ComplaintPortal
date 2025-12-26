import React, { useEffect, useState } from "react";
import { fetchAnalytics } from "@/api/analytics";
import { Card, CardContent } from "@/components/ui/card";

export default function AllOfficers() {
  const [officers, setOfficers] = useState([]);

  useEffect(() => {
    fetchAnalytics().then((data) => setOfficers(data.officers));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Government Officers</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {officers.map((off) => (
          <Card key={off._id}>
            <CardContent className="p-4">
              <h2 className="font-semibold">{off.name}</h2>
              <p>Department: {off.department}</p>
              <p>Phone: {off.phone}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
