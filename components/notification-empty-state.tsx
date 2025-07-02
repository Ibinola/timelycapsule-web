"use client"

import { Bell, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NotificationEmptyStateProps {
  filter: string
  onCreateCapsule?: () => void
}

export function NotificationEmptyState({ filter, onCreateCapsule }: NotificationEmptyStateProps) {
  const getEmptyStateContent = () => {
    switch (filter) {
      case "unread":
        return {
          icon: <Bell className="h-16 w-16 text-gray-300" />,
          title: "All caught up!",
          description: "You have no unread notifications. Great job staying on top of things!",
          showButton: false,
        }
      case "read":
        return {
          icon: <Bell className="h-16 w-16 text-gray-300" />,
          title: "No read notifications",
          description: "Once you read some notifications, they'll appear here.",
          showButton: false,
        }
      default:
        return {
          icon: <Sparkles className="h-16 w-16 text-gray-300" />,
          title: "No notifications yet",
          description:
            "Create your first time capsule to start receiving notifications about openings, deliveries, and more.",
          showButton: true,
        }
    }
  }

  const content = getEmptyStateContent()

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-6">{content.icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{content.title}</h3>
      <p className="text-gray-500 mb-8 max-w-md">{content.description}</p>
      {content.showButton && (
        <Button onClick={onCreateCapsule} className="bg-blue-600 hover:bg-blue-700">
          <Sparkles className="h-4 w-4 mr-2" />
          Create Your First Capsule
        </Button>
      )}
    </div>
  )
}
