"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Home, Users, BarChart3, Settings, Upload, FileText, Bell, HelpCircle } from "lucide-react"

interface ResponsiveSidebarProps {
  onItemClick?: () => void
}

export function ResponsiveSidebar({ onItemClick }: ResponsiveSidebarProps) {
  const navigationItems = [
    { icon: Home, label: "Dashboard", href: "/" },
    { icon: Users, label: "Users", href: "/users" },
    { icon: BarChart3, label: "Analytics", href: "/analytics" },
    { icon: FileText, label: "Reports", href: "/reports" },
    { icon: Upload, label: "Media", href: "/media" },
  ]

  const settingsItems = [
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: Bell, label: "Notifications", href: "/notifications" },
    { icon: HelpCircle, label: "Help", href: "/help" },
  ]

  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div className="flex h-14 items-center border-b border-sidebar-border px-4">
        <h2 className="text-lg font-semibold text-sidebar-foreground">Menu</h2>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-2 py-4">
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                className="w-full justify-start h-11 px-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                onClick={onItemClick}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </div>

          <Separator className="my-4 bg-sidebar-border" />

          <div className="space-y-1">
            {settingsItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                className="w-full justify-start h-11 px-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                onClick={onItemClick}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
