"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCheck, Settings } from "lucide-react"
import { NotificationBell } from "../components/notification-bell"
import { NotificationCard } from "../components/notification-card"
import { NotificationEmptyState } from "../components/notification-empty-state"
import type { Notification, NotificationFilter } from "../types/notification"

// Mock data for demonstration
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "capsule_opened",
    title: "Time Capsule Opened!",
    message: 'Your "Memories from 2020" capsule has been automatically opened and delivered to recipients.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    isRead: false,
    capsuleId: "cap_123",
    actionType: "view",
    priority: "high",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    type: "capsule_received",
    title: "New Capsule Received",
    message: 'Sarah Johnson sent you a time capsule titled "Our College Days". It will open on December 25, 2024.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    isRead: false,
    capsuleId: "cap_456",
    actionType: "view",
    priority: "medium",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    type: "capsule_expiring",
    title: "Capsule Expiring Soon",
    message: 'Your "Birthday Wishes 2023" capsule will expire in 3 days. Make sure recipients have accessed it.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    isRead: true,
    capsuleId: "cap_789",
    actionType: "view",
    priority: "medium",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    type: "system",
    title: "Account Security Update",
    message: "We've updated our security features. Your account now has enhanced protection for your time capsules.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    isRead: true,
    actionType: "none",
    priority: "low",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "5",
    type: "reminder",
    title: "Capsule Opening Tomorrow",
    message: 'Don\'t forget! Your "New Year Resolutions 2024" capsule opens tomorrow at 12:00 PM.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    isRead: false,
    capsuleId: "cap_101",
    actionType: "open",
    priority: "high",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>("all")
  const [showBellDemo, setShowBellDemo] = useState(true)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add a new notification (10% chance every 10 seconds)
      if (Math.random() < 0.1) {
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: "capsule_received",
          title: "New Capsule Received",
          message: `You received a new time capsule from a friend!`,
          timestamp: new Date(),
          isRead: false,
          capsuleId: `cap_${Date.now()}`,
          actionType: "view",
          priority: "medium",
          avatar: "/placeholder.svg?height=40&width=40",
        }
        setNotifications((prev) => [newNotification, ...prev])
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const filteredNotifications = notifications.filter((notification) => {
    switch (activeFilter) {
      case "unread":
        return !notification.isRead
      case "read":
        return notification.isRead
      default:
        return true
    }
  })

  const unreadCount = notifications.filter((n) => !n.isRead).length
  const readCount = notifications.filter((n) => n.isRead).length

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
    )
  }

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
  }

  const handleNotificationAction = (notification: Notification, action: string) => {
    console.log(`Action: ${action} on notification:`, notification)
    // Handle capsule actions here
    if (!notification.isRead) {
      handleMarkAsRead(notification.id)
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with Bell Demo */}
        {showBellDemo && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Notification Bell Component</h2>
                  <p className="text-gray-600">
                    This bell would typically be placed in your app's header or navigation bar.
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <NotificationBell
                    notifications={notifications}
                    onNotificationClick={handleNotificationClick}
                    onViewAll={() => setShowBellDemo(false)}
                  />
                  <Button variant="outline" size="sm" onClick={() => setShowBellDemo(false)}>
                    Hide Demo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Notification Page */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">Notifications</CardTitle>
                <p className="text-gray-600 mt-1">Stay updated with your time capsule activities</p>
              </div>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                    className="flex items-center space-x-2 bg-transparent"
                  >
                    <CheckCheck className="h-4 w-4" />
                    <span>Mark all as read</span>
                  </Button>
                )}
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={activeFilter} onValueChange={(value) => setActiveFilter(value as NotificationFilter)}>
              <div className="px-6 pb-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all" className="flex items-center space-x-2">
                    <span>All</span>
                    <Badge variant="secondary" className="text-xs">
                      {notifications.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="unread" className="flex items-center space-x-2">
                    <span>Unread</span>
                    {unreadCount > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {unreadCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="read" className="flex items-center space-x-2">
                    <span>Read</span>
                    <Badge variant="secondary" className="text-xs">
                      {readCount}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
              </div>

              <Separator />

              <TabsContent value="all" className="mt-0">
                <div className="p-6">
                  {filteredNotifications.length > 0 ? (
                    <div className="space-y-4">
                      {filteredNotifications.map((notification) => (
                        <NotificationCard
                          key={notification.id}
                          notification={notification}
                          onMarkAsRead={handleMarkAsRead}
                          onAction={handleNotificationAction}
                        />
                      ))}
                    </div>
                  ) : (
                    <NotificationEmptyState
                      filter={activeFilter}
                      onCreateCapsule={() => console.log("Navigate to create capsule")}
                    />
                  )}
                </div>
              </TabsContent>

              <TabsContent value="unread" className="mt-0">
                <div className="p-6">
                  {filteredNotifications.length > 0 ? (
                    <div className="space-y-4">
                      {filteredNotifications.map((notification) => (
                        <NotificationCard
                          key={notification.id}
                          notification={notification}
                          onMarkAsRead={handleMarkAsRead}
                          onAction={handleNotificationAction}
                        />
                      ))}
                    </div>
                  ) : (
                    <NotificationEmptyState
                      filter={activeFilter}
                      onCreateCapsule={() => console.log("Navigate to create capsule")}
                    />
                  )}
                </div>
              </TabsContent>

              <TabsContent value="read" className="mt-0">
                <div className="p-6">
                  {filteredNotifications.length > 0 ? (
                    <div className="space-y-4">
                      {filteredNotifications.map((notification) => (
                        <NotificationCard
                          key={notification.id}
                          notification={notification}
                          onMarkAsRead={handleMarkAsRead}
                          onAction={handleNotificationAction}
                        />
                      ))}
                    </div>
                  ) : (
                    <NotificationEmptyState
                      filter={activeFilter}
                      onCreateCapsule={() => console.log("Navigate to create capsule")}
                    />
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
