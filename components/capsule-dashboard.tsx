"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Search, Calendar, Users, Clock, CheckCircle, Lock, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface CapsuleData {
  id: string
  title: string
  description: string
  openDate: string
  createdAt: string
  status: "active" | "sealed" | "opened"
  collaboratorCount: number
  contributedCount: number
  category: string
}

const mockCapsules: CapsuleData[] = [
  {
    id: "1",
    title: "Team Q4 Retrospective",
    description: "Looking back at our achievements and challenges",
    openDate: "2025-01-01",
    createdAt: "2024-12-01",
    status: "active",
    collaboratorCount: 8,
    contributedCount: 5,
    category: "Work",
  },
  {
    id: "2",
    title: "Sarah's Wedding Memories",
    description: "Collecting wishes and memories for the happy couple",
    openDate: "2025-06-15",
    createdAt: "2024-11-15",
    status: "sealed",
    collaboratorCount: 25,
    contributedCount: 25,
    category: "Personal",
  },
  {
    id: "3",
    title: "Class of 2024 Graduation",
    description: "Preserving our college memories",
    openDate: "2029-05-20",
    createdAt: "2024-05-20",
    status: "opened",
    collaboratorCount: 45,
    contributedCount: 42,
    category: "Education",
  },
]

export function CapsuleDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredCapsules = mockCapsules.filter((capsule) => {
    const matchesSearch =
      capsule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      capsule.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || capsule.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800"
      case "sealed":
        return "bg-yellow-100 text-yellow-800"
      case "opened":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Clock className="h-4 w-4" />
      case "sealed":
        return <Lock className="h-4 w-4" />
      case "opened":
        return <CheckCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const calculateProgress = (contributed: number, total: number) => {
    return total > 0 ? (contributed / total) * 100 : 0
  }

  // Statistics
  const totalCapsules = mockCapsules.length
  const activeCapsules = mockCapsules.filter((c) => c.status === "active").length
  const sealedCapsules = mockCapsules.filter((c) => c.status === "sealed").length
  const openedCapsules = mockCapsules.filter((c) => c.status === "opened").length

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Capsules</p>
                <p className="text-2xl font-bold">{totalCapsules}</p>
              </div>
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-blue-600">{activeCapsules}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sealed</p>
                <p className="text-2xl font-bold text-yellow-600">{sealedCapsules}</p>
              </div>
              <Lock className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Opened</p>
                <p className="text-2xl font-bold text-green-600">{openedCapsules}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search capsules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("all")}
              >
                All
              </Button>
              <Button
                variant={statusFilter === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("active")}
              >
                Active
              </Button>
              <Button
                variant={statusFilter === "sealed" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("sealed")}
              >
                Sealed
              </Button>
              <Button
                variant={statusFilter === "opened" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("opened")}
              >
                Opened
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Capsules List */}
      <div className="space-y-4">
        {filteredCapsules.map((capsule) => (
          <Card key={capsule.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{capsule.title}</h3>
                    <Badge className={getStatusColor(capsule.status)}>
                      {getStatusIcon(capsule.status)}
                      <span className="ml-1 capitalize">{capsule.status}</span>
                    </Badge>
                    <Badge variant="outline">{capsule.category}</Badge>
                  </div>

                  <p className="text-gray-600 mb-4">{capsule.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Opens: {new Date(capsule.openDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{capsule.collaboratorCount} collaborators</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>
                        {capsule.contributedCount}/{capsule.collaboratorCount} contributed
                      </span>
                    </div>
                  </div>

                  {capsule.status === "active" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>
                          {Math.round(calculateProgress(capsule.contributedCount, capsule.collaboratorCount))}%
                        </span>
                      </div>
                      <Progress value={calculateProgress(capsule.contributedCount, capsule.collaboratorCount)} />
                    </div>
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    {capsule.status === "active" && (
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Capsule
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Capsule
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCapsules.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No capsules found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
