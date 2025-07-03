"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserTable } from "@/components/admin/user-table"
import { UserFilters } from "@/components/admin/user-filters"
import { UserStats } from "@/components/admin/user-stats"
import { BulkActions } from "@/components/admin/bulk-actions"
import { UserProfileModal } from "@/components/admin/user-profile-modal"
import { EditUserModal } from "@/components/admin/edit-user-modal"
import { DeleteUserModal } from "@/components/admin/delete-user-modal"
import { ActivityLogsModal } from "@/components/admin/activity-logs-modal"
import type { User, UserFilters as UserFiltersType, UserStatus } from "@/types/admin"

// Mock data - replace with actual API calls
const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    status: "active",
    role: "user",
    dateJoined: "2024-01-15",
    lastActive: "2024-01-20T10:30:00Z",
    avatar: "/placeholder.svg?height=40&width=40",
    address: "123 Main St, New York, NY 10001",
    dateOfBirth: "1990-05-15",
    emailVerified: true,
    twoFactorEnabled: true,
    loginCount: 45,
    subscriptionPlan: "Pro",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 987-6543",
    status: "inactive",
    role: "admin",
    dateJoined: "2024-01-10",
    lastActive: "2024-01-18T14:20:00Z",
    avatar: "/placeholder.svg?height=40&width=40",
    address: "456 Oak Ave, Los Angeles, CA 90210",
    dateOfBirth: "1985-08-22",
    emailVerified: true,
    twoFactorEnabled: false,
    loginCount: 128,
    subscriptionPlan: "Enterprise",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    phone: "+1 (555) 456-7890",
    status: "banned",
    role: "user",
    dateJoined: "2024-01-05",
    lastActive: "2024-01-12T09:15:00Z",
    avatar: "/placeholder.svg?height=40&width=40",
    address: "789 Pine St, Chicago, IL 60601",
    dateOfBirth: "1992-12-03",
    emailVerified: false,
    twoFactorEnabled: false,
    loginCount: 12,
    subscriptionPlan: "Free",
  },
  // Add more mock users...
  ...Array.from({ length: 47 }, (_, i) => ({
    id: `${i + 4}`,
    name: `User ${i + 4}`,
    email: `user${i + 4}@example.com`,
    phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    status: ["active", "inactive", "banned"][Math.floor(Math.random() * 3)] as UserStatus,
    role: ["user", "admin", "moderator"][Math.floor(Math.random() * 3)] as "user" | "admin" | "moderator",
    dateJoined: new Date(2024, 0, Math.floor(Math.random() * 30) + 1).toISOString().split("T")[0],
    lastActive: new Date(2024, 0, Math.floor(Math.random() * 30) + 1).toISOString(),
    avatar: "/placeholder.svg?height=40&width=40",
    address: `${Math.floor(Math.random() * 999) + 1} Street ${i + 4}, City, State`,
    dateOfBirth: new Date(
      1980 + Math.floor(Math.random() * 25),
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1,
    )
      .toISOString()
      .split("T")[0],
    emailVerified: Math.random() > 0.3,
    twoFactorEnabled: Math.random() > 0.6,
    loginCount: Math.floor(Math.random() * 200),
    subscriptionPlan: ["Free", "Pro", "Enterprise"][Math.floor(Math.random() * 3)],
  })),
]

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [filters, setFilters] = useState<UserFiltersType>({
    search: "",
    status: "all",
    role: "all",
    dateRange: "all",
  })

  // Modal states
  const [viewingUser, setViewingUser] = useState<User | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)
  const [showActivityLogs, setShowActivityLogs] = useState<User | null>(null)

  // Calculate stats
  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    inactive: users.filter((u) => u.status === "inactive").length,
    banned: users.filter((u) => u.status === "banned").length,
  }

  // Handle user actions
  const handleUserUpdate = (updatedUser: User) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)))
    setFilteredUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)))
    setEditingUser(null)
  }

  const handleUserDelete = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId))
    setFilteredUsers((prev) => prev.filter((u) => u.id !== userId))
    setDeletingUser(null)
  }

  const handleStatusChange = (userId: string, newStatus: UserStatus) => {
    const updatedUser = users.find((u) => u.id === userId)
    if (updatedUser) {
      handleUserUpdate({ ...updatedUser, status: newStatus })
    }
  }

  const handleBulkStatusChange = (userIds: string[], newStatus: UserStatus) => {
    setUsers((prev) => prev.map((u) => (userIds.includes(u.id) ? { ...u, status: newStatus } : u)))
    setFilteredUsers((prev) => prev.map((u) => (userIds.includes(u.id) ? { ...u, status: newStatus } : u)))
    setSelectedUsers([])
  }

  const handleBulkDelete = (userIds: string[]) => {
    setUsers((prev) => prev.filter((u) => !userIds.includes(u.id)))
    setFilteredUsers((prev) => prev.filter((u) => !userIds.includes(u.id)))
    setSelectedUsers([])
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Administration</h1>
          <p className="text-muted-foreground">Manage and monitor user accounts</p>
        </div>
      </div>

      {/* Stats Cards */}
      <UserStats stats={stats} />

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Search, filter, and manage user accounts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <UserFilters
            filters={filters}
            onFiltersChange={setFilters}
            users={users}
            onFilteredUsersChange={setFilteredUsers}
          />

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <BulkActions
              selectedCount={selectedUsers.length}
              onStatusChange={(status) => handleBulkStatusChange(selectedUsers, status)}
              onDelete={() => handleBulkDelete(selectedUsers)}
              onExport={() => {
                const selectedUserData = filteredUsers.filter((u) => selectedUsers.includes(u.id))
                // Export logic would go here
                console.log("Exporting users:", selectedUserData)
              }}
            />
          )}

          {/* User Table */}
          <UserTable
            users={filteredUsers}
            selectedUsers={selectedUsers}
            onSelectionChange={setSelectedUsers}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onView={setViewingUser}
            onEdit={setEditingUser}
            onDelete={setDeletingUser}
            onStatusChange={handleStatusChange}
            onViewActivity={setShowActivityLogs}
          />
        </CardContent>
      </Card>

      {/* Modals */}
      {viewingUser && (
        <UserProfileModal
          user={viewingUser}
          open={!!viewingUser}
          onClose={() => setViewingUser(null)}
          onEdit={() => {
            setEditingUser(viewingUser)
            setViewingUser(null)
          }}
        />
      )}

      {editingUser && (
        <EditUserModal
          user={editingUser}
          open={!!editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleUserUpdate}
        />
      )}

      {deletingUser && (
        <DeleteUserModal
          user={deletingUser}
          open={!!deletingUser}
          onClose={() => setDeletingUser(null)}
          onConfirm={() => handleUserDelete(deletingUser.id)}
        />
      )}

      {showActivityLogs && (
        <ActivityLogsModal
          user={showActivityLogs}
          open={!!showActivityLogs}
          onClose={() => setShowActivityLogs(null)}
        />
      )}
    </div>
  )
}
