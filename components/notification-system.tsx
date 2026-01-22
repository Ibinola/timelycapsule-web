"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, X, CheckCircle, Clock, Users, Mail } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Notification } from "@/types/notification"


const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "capsule_received",
    title: "New Contribution",
    message: "Sarah added a memory to 'Team Q4 Retrospective'",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    isRead: false,
    priority: "medium"
  },
  {
    id: "2",
    type: "system",
    title: "Invitation Sent",
    message: "5 invitations sent for 'Wedding Memories' capsule",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    isRead: false,
    priority: "low"
  },
  {
    id: "3",
    type: "capsule_opened",
    title: "Capsule Unlocked",
    message: "'Graduation Memories' has been unlocked and is ready to view",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    isRead: true,
    capsuleId: "grad-capsule-123",
    priority: "high"
  },
  {
    id: "4",
    type: "reminder",
    title: "Contribution Reminder",
    message: "Don't forget to contribute to 'Project Milestone' capsule",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    isRead: true,
    priority: "medium"
  },
]

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Fetch notifications from API on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true)
        const userId = 'demo-user' // In production, get from auth context
        const response = await fetch(`/api/notifications?userId=${userId}`)
        if (response.ok) {
          const data = await response.json()
          setNotifications(data.data || mockNotifications)
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  const unreadCount = notifications.filter((n: Notification) => !n.isRead).length

  const markAsRead = async (id: string) => {
    try {
      // Update local state immediately for better UX
      setNotifications((prev: Notification[]) => 
        prev.map((n: Notification) => (n.id === id ? { ...n, isRead: true } : n))
      )
      
      // Then update backend
      await fetch(`/api/notifications/${id}?action=markRead`, { method: 'PATCH' })
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((n: Notification) => !n.isRead)
      
      // Update local state immediately
      setNotifications((prev: Notification[]) => 
        prev.map((n: Notification) => ({ ...n, isRead: true }))
      )
      
      // Then update backend for each notification
      await Promise.all(
        unreadNotifications.map((n: Notification) => 
          fetch(`/api/notifications/${n.id}?action=markRead`, { method: 'PATCH' })
        )
      )
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }

  const removeNotification = async (id: string) => {
    try {
      // Update local state immediately
      setNotifications((prev: Notification[]) => prev.filter((n: Notification) => n.id !== id))
      
      // Then update backend
      await fetch(`/api/notifications/${id}`, { method: 'DELETE' })
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "capsule_received":
        return <CheckCircle className="h-4 w-4" />
      case "capsule_opened":
        return <Users className="h-4 w-4" />
      case "capsule_expiring":
        return <Clock className="h-4 w-4" />
      case "system":
        return <Mail className="h-4 w-4" />
      case "reminder":
        return <Clock className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "capsule_received":
        return "bg-green-100 text-green-800"
      case "capsule_opened":
        return "bg-purple-100 text-purple-800"
      case "capsule_expiring":
        return "bg-orange-100 text-orange-800"
      case "system":
        return "bg-blue-100 text-blue-800"
      case "reminder":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative bg-transparent">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all read
              </Button>
            )}
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No notifications</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer border-l-4 ${
                    (notification as Notification).isRead ? "border-transparent" : "border-blue-500 bg-blue-50"
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <Badge className={getNotificationColor(notification.type)}>
                        {getNotificationIcon(notification.type)}
                      </Badge>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{notification.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-2">{formatTimestamp(notification.timestamp)}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeNotification(notification.id)
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="p-4 border-t">
            <Button variant="outline" size="sm" className="w-full bg-transparent">
              View All Notifications
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
