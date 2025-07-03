"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Settings, Shield, Clock, Download, Globe, Lock, Users } from "lucide-react"

interface AdvancedSettingsProps {
  onSettingsChange: (settings: CapsuleSettings) => void
}

interface CapsuleSettings {
  privacy: "public" | "private" | "invite-only"
  allowLateContributions: boolean
  reminderFrequency: "none" | "daily" | "weekly" | "monthly"
  autoSeal: boolean
  downloadEnabled: boolean
  timezone: string
  customMessage: string
  maxFileSize: number
  allowedFileTypes: string[]
}

const defaultSettings: CapsuleSettings = {
  privacy: "invite-only",
  allowLateContributions: false,
  reminderFrequency: "weekly",
  autoSeal: true,
  downloadEnabled: true,
  timezone: "UTC",
  customMessage: "",
  maxFileSize: 10,
  allowedFileTypes: ["image", "video", "audio", "document"],
}

export function AdvancedSettings({ onSettingsChange }: AdvancedSettingsProps) {
  const [settings, setSettings] = useState<CapsuleSettings>(defaultSettings)

  const updateSetting = <K extends keyof CapsuleSettings>(key: K, value: CapsuleSettings[K]) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    onSettingsChange(newSettings)
  }

  const toggleFileType = (fileType: string) => {
    const newFileTypes = settings.allowedFileTypes.includes(fileType)
      ? settings.allowedFileTypes.filter((type) => type !== fileType)
      : [...settings.allowedFileTypes, fileType]
    updateSetting("allowedFileTypes", newFileTypes)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Advanced Settings
          </CardTitle>
          <CardDescription>Configure advanced options for your time capsule</CardDescription>
        </CardHeader>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5" />
            Privacy & Access
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="privacy">Privacy Level</Label>
            <Select value={settings.privacy} onValueChange={(value: any) => updateSetting("privacy", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span>Public - Anyone can view</span>
                  </div>
                </SelectItem>
                <SelectItem value="private">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    <span>Private - Only you can view</span>
                  </div>
                </SelectItem>
                <SelectItem value="invite-only">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Invite Only - Only invited collaborators</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="late-contributions">Allow Late Contributions</Label>
              <p className="text-sm text-gray-600">Allow collaborators to contribute after the deadline</p>
            </div>
            <Switch
              id="late-contributions"
              checked={settings.allowLateContributions}
              onCheckedChange={(checked) => updateSetting("allowLateContributions", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="download-enabled">Enable Downloads</Label>
              <p className="text-sm text-gray-600">Allow collaborators to download capsule content</p>
            </div>
            <Switch
              id="download-enabled"
              checked={settings.downloadEnabled}
              onCheckedChange={(checked) => updateSetting("downloadEnabled", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Timing & Reminders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5" />
            Timing & Reminders
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="timezone">Timezone</Label>
            <Select value={settings.timezone} onValueChange={(value) => updateSetting("timezone", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">UTC (Coordinated Universal Time)</SelectItem>
                <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                <SelectItem value="Europe/London">London (GMT)</SelectItem>
                <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="reminder-frequency">Reminder Frequency</Label>
            <Select
              value={settings.reminderFrequency}
              onValueChange={(value: any) => updateSetting("reminderFrequency", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Reminders</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-seal">Auto-Seal When Complete</Label>
              <p className="text-sm text-gray-600">Automatically seal when all collaborators contribute</p>
            </div>
            <Switch
              id="auto-seal"
              checked={settings.autoSeal}
              onCheckedChange={(checked) => updateSetting("autoSeal", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* File Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Download className="h-5 w-5" />
            File & Content Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="max-file-size">Maximum File Size (MB)</Label>
            <Input
              id="max-file-size"
              type="number"
              min="1"
              max="100"
              value={settings.maxFileSize}
              onChange={(e) => updateSetting("maxFileSize", Number.parseInt(e.target.value))}
            />
          </div>

          <div>
            <Label>Allowed File Types</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {["image", "video", "audio", "document", "archive"].map((type) => (
                <Badge
                  key={type}
                  variant={settings.allowedFileTypes.includes(type) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleFileType(type)}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="custom-message">Custom Opening Message</Label>
            <Textarea
              id="custom-message"
              placeholder="Enter a message that will be shown when the capsule opens..."
              value={settings.customMessage}
              onChange={(e) => updateSetting("customMessage", e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Settings */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">Settings are automatically saved as you make changes</p>
            <Button variant="outline">Reset to Defaults</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
