"use client";

import UserScreen, { User } from "./AdminUsersTable";
import { userApi } from "@/app/api/users";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function UsersPage() {
  // Properly type the users state
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userApi.getUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        // Consider adding error state to show to users
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <UserScreen data={users} />
    </div>
  );
}
