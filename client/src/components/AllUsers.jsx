import React, { useEffect, useState } from "react";
import { fetchAnalytics } from "@/api/analytics";
import { Card, CardContent } from "@/components/ui/card";

export default function AllUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchAnalytics().then((data) => setUsers(data.users));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {users.map((u) => (
          <Card key={u._id}>
            <CardContent className="p-4">
              <h2 className="font-semibold">{u.name}</h2>
              <p>Phone: {u.number}</p>
              <p>City: {u.city}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
