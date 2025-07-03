"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { formatDistanceToNow } from "date-fns"
import { Activity, LogIn, LogOut, Settings, Shield, CreditCard, UserIcon } from "lucide-react"
import type { User, ActivityLog } from "@/types/admin"

interface ActivityLogsModalProps {
  user: User
  open: boolean
  onClose: () => void
}

// Mock activity logs - replace with actual API call
const generateMockLogs = (userId: string): ActivityLog[] => {
  const actions = [
    { action: "login", details: "User logged in", icon: LogIn },
    { action: "logout", details: "User logged out", icon: LogOut },
    { action: "profile_update", details: "Updated profile information", icon: UserIcon },
    { action: "password_change", details: "Changed password", icon: Shield },
    { action: "settings_update", details: "Updated account settings", icon: Settings },
    { action: "subscription_change", details: "Changed subscription plan", icon: CreditCard },
  ]

  return Array.from({ length: 20 }, (_, i) => {
    const randomAction = actions[Math.floor(Math.random() * actions.length)]
    return {
      id: `${i + 1}`,
      userId,
      action: randomAction.action,
      details: randomAction.details,
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    }
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export function ActivityLogsModal({ user, open, onClose }: ActivityLogsModalProps) {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (open) {
      setIsLoading(true)
      // Simulate API call
      setTimeout(() => {
        setLogs(generateMockLogs(user.id))
        setIsLoading(false)
      }, 500)
    }
  }, [open, user.id])

  const getActionIcon = (action: string) => {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      login: LogIn,
      logout: LogOut,
      profile_update: UserIcon,
      password_change: Shield,
      settings_update: Settings,
      subscription_change: CreditCard,
    }
    return iconMap[action] || Activity
  }

  const getActionBadge = (action: string) => {
    const colorMap: Record<string, string> = {
      login: "bg-green-100 text-green-800",
      logout: "bg-gray-100 text-gray-800",
      profile_update: "bg-blue-100 text-blue-800",
      password_change: "bg-orange-100 text-orange-800",
      settings_update: "bg-purple-100 text-purple-800",
      subscription_change: "bg-yellow-100 text-yellow-800",
    }

    return (
      <Badge className={colorMap[action] || "bg-gray-100 text-gray-800"}>
        {action.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
      </Badge>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Activity Logs - {user.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">Recent activity and audit trail for {user.email}</div>

          <ScrollArea className="h-[500px] pr-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-muted-foreground">Loading activity logs...</div>
              </div>
            ) : (
              <div className="space-y-4">
                {logs.map((log, index) => {
                  const IconComponent = getActionIcon(log.action)
                  return (
                    <div key={log.id}>
                      <div className="flex items-start gap-3 p-3 rounded-lg border">
                        <div className="p-2 rounded-full bg-muted">
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getActionBadge(log.action)}
                              <span className="text-sm font-medium">{log.details}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground space-y-1">
                            <div>IP Address: {log.ipAddress}</div>
                            <div>Time: {new Date(log.timestamp).toLocaleString()}</div>
                            <div className="truncate">User Agent: {log.userAgent}</div>
                          </div>
                        </div>
                      </div>
                      {index < logs.length - 1 && <Separator className="my-2" />}
                    </div>
                  )
                })}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
