"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { Smartphone, Monitor, Tablet, MapPin, Shield, Key } from "lucide-react"

interface SecuritySettings {
  twoFactorEnabled: boolean
  loginNotifications: boolean
  sessionTimeout: boolean
}

interface LoginSession {
  id: string
  device: string
  location: string
  lastActive: string
  current: boolean
  icon: React.ComponentType<{ className?: string }>
}

export function SecuritySettings() {
  const [settings, setSettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    loginNotifications: true,
    sessionTimeout: true,
  })

  const [sessions] = useState<LoginSession[]>([
    {
      id: "1",
      device: "MacBook Pro - Chrome",
      location: "New York, NY",
      lastActive: "Active now",
      current: true,
      icon: Monitor,
    },
    {
      id: "2",
      device: "iPhone 15 Pro - Safari",
      location: "New York, NY",
      lastActive: "2 hours ago",
      current: false,
      icon: Smartphone,
    },
    {
      id: "3",
      device: "iPad Air - Safari",
      location: "Boston, MA",
      lastActive: "1 day ago",
      current: false,
      icon: Tablet,
    },
  ])

  const handleSettingChange = (setting: keyof SecuritySettings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [setting]: value }))

    toast({
      title: "Setting updated",
      description: `${setting.replace(/([A-Z])/g, " $1").toLowerCase()} has been ${value ? "enabled" : "disabled"}.`,
    })
  }

  const handleRevokeSession = (sessionId: string) => {
    toast({
      title: "Session revoked",
      description: "The selected session has been terminated.",
    })
  }

  const handleRevokeAllSessions = () => {
    toast({
      title: "All sessions revoked",
      description: "All other sessions have been terminated. You'll need to log in again on those devices.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>Add an extra layer of security to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="2fa">Enable Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">Require a verification code in addition to your password</p>
            </div>
            <Switch
              id="2fa"
              checked={settings.twoFactorEnabled}
              onCheckedChange={(checked) => handleSettingChange("twoFactorEnabled", checked)}
            />
          </div>
          {!settings.twoFactorEnabled && (
            <Button variant="outline" className="w-full bg-transparent">
              <Key className="mr-2 h-4 w-4" />
              Set up Two-Factor Authentication
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Login Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Login Notifications</CardTitle>
          <CardDescription>Get notified when someone logs into your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="login-notifications">Email login notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive an email when your account is accessed from a new device
              </p>
            </div>
            <Switch
              id="login-notifications"
              checked={settings.loginNotifications}
              onCheckedChange={(checked) => handleSettingChange("loginNotifications", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Session Management */}
      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>Manage your active sessions across different devices</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {sessions.map((session) => {
              const IconComponent = session.icon
              return (
                <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{session.device}</p>
                        {session.current && <Badge variant="secondary">Current</Badge>}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {session.location} • {session.lastActive}
                      </div>
                    </div>
                  </div>
                  {!session.current && (
                    <Button variant="outline" size="sm" onClick={() => handleRevokeSession(session.id)}>
                      Revoke
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
          <Button variant="outline" onClick={handleRevokeAllSessions} className="w-full bg-transparent">
            Revoke All Other Sessions
          </Button>
        </CardContent>
      </Card>

      {/* Session Timeout */}
      <Card>
        <CardHeader>
          <CardTitle>Session Timeout</CardTitle>
          <CardDescription>Automatically log out after a period of inactivity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="session-timeout">Enable automatic logout</Label>
              <p className="text-sm text-muted-foreground">Log out automatically after 30 minutes of inactivity</p>
            </div>
            <Switch
              id="session-timeout"
              checked={settings.sessionTimeout}
              onCheckedChange={(checked) => handleSettingChange("sessionTimeout", checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
