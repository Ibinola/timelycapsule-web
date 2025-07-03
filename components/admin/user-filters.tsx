"use client"

import { useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, Download, RefreshCw } from "lucide-react"
import type { User, UserFilters as UserFiltersType } from "@/types/admin"

interface UserFiltersProps {
  filters: UserFiltersType
  onFiltersChange: (filters: UserFiltersType) => void
  users: User[]
  onFilteredUsersChange: (users: User[]) => void
}

export function UserFilters({ filters, onFiltersChange, users, onFilteredUsersChange }: UserFiltersProps) {
  // Apply filters whenever filters or users change
  useEffect(() => {
    let filtered = [...users]

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.phone.includes(filters.search),
      )
    }

    // Status filter
    if (filters.status !== "all") {
      filtered = filtered.filter((user) => user.status === filters.status)
    }

    // Role filter
    if (filters.role !== "all") {
      filtered = filtered.filter((user) => user.role === filters.role)
    }

    // Date range filter
    if (filters.dateRange !== "all") {
      const now = new Date()
      const filterDate = new Date()

      switch (filters.dateRange) {
        case "today":
          filterDate.setHours(0, 0, 0, 0)
          break
        case "week":
          filterDate.setDate(now.getDate() - 7)
          break
        case "month":
          filterDate.setMonth(now.getMonth() - 1)
          break
        case "year":
          filterDate.setFullYear(now.getFullYear() - 1)
          break
      }

      filtered = filtered.filter((user) => new Date(user.dateJoined) >= filterDate)
    }

    onFilteredUsersChange(filtered)
  }, [filters, users, onFilteredUsersChange])

  const handleExportCSV = () => {
    // Create CSV content
    const headers = ["Name", "Email", "Phone", "Status", "Role", "Date Joined", "Last Active"]
    const csvContent = [
      headers.join(","),
      ...users.map((user) =>
        [
          `"${user.name}"`,
          `"${user.email}"`,
          `"${user.phone}"`,
          user.status,
          user.role,
          user.dateJoined,
          user.lastActive,
        ].join(","),
      ),
    ].join("\n")

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `users-export-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleReset = () => {
    onFiltersChange({
      search: "",
      status: "all",
      role: "all",
      dateRange: "all",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name, email, or phone..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select
            value={filters.status}
            onValueChange={(value) => onFiltersChange({ ...filters, status: value as any })}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="banned">Banned</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.role} onValueChange={(value) => onFiltersChange({ ...filters, role: value as any })}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="moderator">Moderator</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.dateRange}
            onValueChange={(value) => onFiltersChange({ ...filters, dateRange: value as any })}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={handleReset}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset Filters
        </Button>
        <Button variant="outline" onClick={handleExportCSV}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>
    </div>
  )
}
