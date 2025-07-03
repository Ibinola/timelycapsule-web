"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Mail, Smartphone, Bell, MessageSquare, Shield, CreditCard, Users } from "lucide-react"

interface NotificationSettings {
  email: {
    security: boolean
    marketing: boolean
    updates: boolean
    billing: boolean
    social: boolean
  }
  push: {
    security: boolean
    messages: boolean
    updates: boolean
    social: boolean
  }
  frequency: string
}

export function NotificationPreferences() {
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      security: true,
      marketing: false,
      updates: true,
      billing: true,
      social: false,
    },
    push: {
      security: true,
      messages: true,
      updates: false,
      social: true,
    },
    frequency: "immediate",
  })

  const handleEmailToggle = (type: keyof typeof settings.email, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      email: { ...prev.email, [type]: value },
    }))
  }

  const handlePushToggle = (type: keyof typeof settings.push, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      push: { ...prev.push, [type]: value },
    }))
  }

  const handleFrequencyChange = (value: string) => {
    setSettings((prev) => ({ ...prev, frequency: value }))
  }

  const handleSave = () => {
    toast({
      title: "Preferences saved",
      description: "Your notification preferences have been updated.",
    })
  }

  const notificationTypes = [
    {
      key: "security" as const,
      title: "Security Alerts",
      description: "Login attempts, password changes, and security updates",
      icon: Shield,
      important: true,
    },
    {
      key: "billing" as const,
      title: "Billing & Payments",
      description: "Invoices, payment confirmations, and billing updates",
      icon: CreditCard,
      important: false,
    },
    {
      key: "updates" as const,
      title: "Product Updates",
      description: "New features, improvements, and maintenance notifications",
      icon: Bell,
      important: false,
    },
    {
      key: "social" as const,
      title: "Social Activity",
      description: "Comments, mentions, and social interactions",
      icon: Users,
      important: false,
    },
  ]

  const pushNotificationTypes = [
    {
      key: "security" as const,
      title: "Security Alerts",
      description: "Critical security notifications",
      icon: Shield,
    },
    {
      key: "messages" as const,
      title: "Messages",
      description: "Direct messages and communications",
      icon: MessageSquare,
    },
    {
      key: "updates" as const,
      title: "App Updates",
      description: "New features and updates",
      icon: Bell,
    },
    {
      key: "social" as const,
      title: "Social Activity",
      description: "Likes, comments, and mentions",
      icon: Users,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Notifications
          </CardTitle>
          <CardDescription>Choose which email notifications you'd like to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {notificationTypes.map((type) => {
            const IconComponent = type.icon
            const isEnabled = settings.email[type.key]

            return (
              <div key={type.key} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <IconComponent className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="flex items-center gap-2">
                      <Label className="font-medium">{type.title}</Label>
                      {type.important && (
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Recommended</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </div>
                </div>
                <Switch checked={isEnabled} onCheckedChange={(checked) => handleEmailToggle(type.key, checked)} />
              </div>
            )
          })}

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <Label>Marketing Communications</Label>
                <p className="text-sm text-muted-foreground">Promotional emails, newsletters, and special offers</p>
              </div>
              <Switch
                checked={settings.email.marketing}
                onCheckedChange={(checked) => handleEmailToggle("marketing", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Push Notifications
          </CardTitle>
          <CardDescription>Manage push notifications for mobile and desktop</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {pushNotificationTypes.map((type) => {
            const IconComponent = type.icon
            const isEnabled = settings.push[type.key]

            return (
              <div key={type.key} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <IconComponent className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label className="font-medium">{type.title}</Label>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </div>
                </div>
                <Switch checked={isEnabled} onCheckedChange={(checked) => handlePushToggle(type.key, checked)} />
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Notification Frequency */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Frequency</CardTitle>
          <CardDescription>Control how often you receive non-critical notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="frequency">Email Digest Frequency</Label>
            <Select value={settings.frequency} onValueChange={handleFrequencyChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="hourly">Hourly Digest</SelectItem>
                <SelectItem value="daily">Daily Digest</SelectItem>
                <SelectItem value="weekly">Weekly Digest</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Security notifications are always sent immediately regardless of this setting
            </p>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full">
        Save Notification Preferences
      </Button>
    </div>
  )
}
