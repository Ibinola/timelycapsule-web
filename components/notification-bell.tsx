"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Bell, Check, X } from "lucide-react"

const notifications = [
  {
    id: 1,
    title: "Bitcoin vault matured",
    message: "Your Bitcoin vault has reached maturity. Claim your rewards now.",
    time: "2 hours ago",
    type: "success",
    read: false,
  },
  {
    id: 2,
    title: "Market alert",
    message: "ETH price has increased by 5% in the last hour.",
    time: "4 hours ago",
    type: "info",
    read: false,
  },
  {
    id: 3,
    title: "Yield payment received",
    message: "You received $45.32 in yield from your USDT vault.",
    time: "1 day ago",
    type: "success",
    read: true,
  },
]

export function NotificationBell() {
  const [notificationList, setNotificationList] = useState(notifications)
  const unreadCount = notificationList.filter((n) => !n.read).length

  const markAsRead = (id: number) => {
    setNotificationList((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const removeNotification = (id: number) => {
    setNotificationList((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notificationList.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">No notifications</div>
          ) : (
            notificationList.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b hover:bg-muted/50 ${!notification.read ? "bg-muted/20" : ""}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{notification.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{notification.message}</div>
                    <div className="text-xs text-muted-foreground mt-2">{notification.time}</div>
                  </div>
                  <div className="flex gap-1">
                    {!notification.read && (
                      <Button size="sm" variant="ghost" onClick={() => markAsRead(notification.id)}>
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => removeNotification(notification.id)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
