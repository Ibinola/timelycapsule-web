"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Unlock, Mail } from "lucide-react"

export function CapsuleUnlockTrigger() {
  const [capsuleId, setCapsuleId] = useState("")
  const [capsuleTitle, setCapsuleTitle] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleUnlockCapsule = async () => {
    if (!capsuleId || !capsuleTitle) {
      setMessage("Please fill in capsule ID and title")
      return
    }

    try {
      setLoading(true)
      setMessage("")

      const userId = "demo-user" // In production, get from auth context
      
      const response = await fetch("/api/capsules/unlock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          capsuleId,
          capsuleTitle,
          userId,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        if (data.alreadySent) {
          setMessage("Notification already sent for this capsule")
        } else {
          setMessage("✅ Capsule unlock notification triggered successfully!")
        }
      } else {
        setMessage(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      console.error("Error triggering capsule unlock:", error)
      setMessage("❌ Failed to trigger notification")
    } finally {
      setLoading(false)
    }
  }

  const handleSetupEmailHook = async () => {
    if (!capsuleId || !email) {
      setMessage("Please fill in capsule ID and email")
      return
    }

    try {
      setLoading(true)
      setMessage("")

      const userId = "demo-user" // In production, get from auth context
      
      const response = await fetch("/api/email-hooks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          capsuleId,
          userId,
          email,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage("✅ Email hook set up successfully!")
      } else {
        setMessage(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      console.error("Error setting up email hook:", error)
      setMessage("❌ Failed to set up email hook")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Unlock className="h-5 w-5" />
          Capsule Unlock Trigger
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="capsuleId">Capsule ID</Label>
          <Input
            id="capsuleId"
            placeholder="e.g., capsule-123"
            value={capsuleId}
            onChange={(e) => setCapsuleId(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="capsuleTitle">Capsule Title</Label>
          <Input
            id="capsuleTitle"
            placeholder="e.g., My Time Capsule"
            value={capsuleTitle}
            onChange={(e) => setCapsuleTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email (Optional)</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Button 
            onClick={handleUnlockCapsule} 
            disabled={loading}
            className="w-full"
          >
            <Lock className="h-4 w-4 mr-2" />
            {loading ? "Processing..." : "Trigger Unlock Notification"}
          </Button>

          {email && (
            <Button 
              onClick={handleSetupEmailHook} 
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              <Mail className="h-4 w-4 mr-2" />
              {loading ? "Setting up..." : "Set Email Hook"}
            </Button>
          )}
        </div>

        {message && (
          <div className={`p-3 rounded-md text-sm ${
            message.includes("✅") ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
          }`}>
            {message}
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Notifications fire exactly once per capsule</p>
          <p>• Email hooks are optional but recommended</p>
          <p>• Check the notification bell to see results</p>
        </div>
      </CardContent>
    </Card>
  )
}
