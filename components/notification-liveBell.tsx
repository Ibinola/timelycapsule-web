"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Bell, BellRing } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Notification } from "../types/notification"

interface NotificationBellProps {
  notifications: Notification[]
  onNotificationClick?: (notification: Notification) => void
  onViewAll?: () => void
}

export function NotificationBell({ notifications, onNotificationClick, onViewAll }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false)
  const unreadCount = notifications.filter((n) => !n.isRead).length
  const recentNotifications = notifications.slice(0, 5)

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const getNotificationIcon = (type: string) => {
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

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative p-2 hover:bg-gray-100">
          {unreadCount > 0 ? (
            <BellRing className="h-5 w-5 text-blue-600" />
          ) : (
            <Bell className="h-5 w-5 text-gray-600" />
          )}
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} new
              </Badge>
            )}
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {recentNotifications.length > 0 ? (
            <div className="divide-y">
              {recentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 hover:bg-gray-50 cursor-pointer transition-colors",
                    !notification.isRead && "bg-blue-50 border-l-4 border-l-blue-500",
                  )}
                  onClick={() => {
                    onNotificationClick?.(notification)
                    setIsOpen(false)
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-lg">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{notification.title}</p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(notification.timestamp)}</p>
                    </div>
                    {!notification.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No notifications yet</p>
            </div>
          )}
        </div>

        {notifications.length > 5 && (
          <div className="p-3 border-t bg-gray-50">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-blue-600 hover:text-blue-700"
              onClick={() => {
                onViewAll?.()
                setIsOpen(false)
              }}
            >
              View all notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
