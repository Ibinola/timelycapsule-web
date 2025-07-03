"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Clock, CheckCircle, FileText, Users } from "lucide-react"
import type { Collaborator, CollaboratorStatus } from "./group-capsule-creator"

interface CollaboratorStatusTrackerProps {
  collaborators: Collaborator[]
  onStatusUpdate: (id: string, status: CollaboratorStatus) => void
}

export function CollaboratorStatusTracker({ collaborators, onStatusUpdate }: CollaboratorStatusTrackerProps) {
  const getStatusIcon = (status: CollaboratorStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "accepted":
        return <CheckCircle className="h-4 w-4" />
      case "contributed":
        return <FileText className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: CollaboratorStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "accepted":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "contributed":
        return "bg-green-100 text-green-800 border-green-200"
    }
  }

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase()
  }

  const pendingCount = collaborators.filter((c) => c.status === "pending").length
  const acceptedCount = collaborators.filter((c) => c.status === "accepted").length
  const contributedCount = collaborators.filter((c) => c.status === "contributed").length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Collaborator Status
        </CardTitle>
        <CardDescription>Track the progress of your invited collaborators</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Status Summary */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{acceptedCount}</div>
              <div className="text-sm text-gray-600">Accepted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{contributedCount}</div>
              <div className="text-sm text-gray-600">Contributed</div>
            </div>
          </div>

          {/* Collaborator List */}
          <div className="space-y-3">
            {collaborators.map((collaborator) => (
              <div key={collaborator.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">{getInitials(collaborator.email)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">{collaborator.email}</div>
                    <div className="text-xs text-gray-500">
                      Invited {collaborator.invitedAt.toLocaleDateString()}
                      {collaborator.acceptedAt && (
                        <span> • Accepted {collaborator.acceptedAt.toLocaleDateString()}</span>
                      )}
                      {collaborator.contributedAt && (
                        <span> • Contributed {collaborator.contributedAt.toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(collaborator.status)}>
                    {getStatusIcon(collaborator.status)}
                    <span className="ml-1 capitalize">{collaborator.status}</span>
                  </Badge>
                  {/* Demo buttons to simulate status changes */}
                  {collaborator.status === "pending" && (
                    <Button size="sm" variant="outline" onClick={() => onStatusUpdate(collaborator.id, "accepted")}>
                      Accept
                    </Button>
                  )}
                  {collaborator.status === "accepted" && (
                    <Button size="sm" variant="outline" onClick={() => onStatusUpdate(collaborator.id, "contributed")}>
                      Contribute
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
