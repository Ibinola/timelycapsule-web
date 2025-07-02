"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, ExternalLink, Clock, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Notification } from "../types/notification"

interface NotificationCardProps {
  notification: Notification
  onMarkAsRead?: (id: string) => void
  onAction?: (notification: Notification, action: string) => void
}

export function NotificationCard({ notification, onMarkAsRead, onAction }: NotificationCardProps) {
  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
      return diffInMinutes < 1 ? "Just now" : `${diffInMinutes} minutes ago`
    }
    if (diffInHours < 24) return `${diffInHours} hours ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`
    return date.toLocaleDateString()
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "capsule_opened":
        return "bg-green-100 text-green-800"
      case "capsule_received":
        return "bg-blue-100 text-blue-800"
      case "capsule_expiring":
        return "bg-orange-100 text-orange-800"
      case "system":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-purple-100 text-purple-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "capsule_opened":
        return "🎉"
      case "capsule_received":
        return "📦"
      case "capsule_expiring":
        return "⏰"
      case "system":
        return "⚙️"
      default:
        return "🔔"
    }
  }

  const getPriorityIcon = (priority: string) => {
    if (priority === "high") {
      return <AlertCircle className="h-4 w-4 text-red-500" />
    }
    return null
  }

  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-md",
        !notification.isRead && "ring-2 ring-blue-100 bg-blue-50/30",
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={notification.avatar || "/placeholder.svg"} />
            <AvatarFallback className="text-lg">{getTypeIcon(notification.type)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-semibold text-gray-900 truncate">{notification.title}</h3>
                {getPriorityIcon(notification.priority)}
                {!notification.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className={cn("text-xs", getTypeColor(notification.type))}>
                  {notification.type.replace("_", " ")}
                </Badge>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-3 leading-relaxed">{notification.message}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                {formatTimestamp(notification.timestamp)}
              </div>

              <div className="flex items-center space-x-2">
                {!notification.isRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onMarkAsRead?.(notification.id)}
                    className="text-xs h-7 px-2"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Mark as read
                  </Button>
                )}

                {notification.actionType === "view" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAction?.(notification, "view")}
                    className="text-xs h-7 px-3"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View Capsule
                  </Button>
                )}

                {notification.actionType === "open" && (
                  <Button
                    size="sm"
                    onClick={() => onAction?.(notification, "open")}
                    className="text-xs h-7 px-3 bg-green-600 hover:bg-green-700"
                  >
                    Open Capsule
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
