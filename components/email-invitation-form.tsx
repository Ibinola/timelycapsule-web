"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, X, Mail } from "lucide-react"

interface EmailInvitationFormProps {
  onInvitesSent: (emails: string[]) => void
}

export function EmailInvitationForm({ onInvitesSent }: EmailInvitationFormProps) {
  const [emails, setEmails] = useState<string[]>([""])
  const [isLoading, setIsLoading] = useState(false)

  const addEmailField = () => {
    setEmails([...emails, ""])
  }

  const removeEmailField = (index: number) => {
    if (emails.length > 1) {
      setEmails(emails.filter((_, i) => i !== index))
    }
  }

  const updateEmail = (index: number, value: string) => {
    const newEmails = [...emails]
    newEmails[index] = value
    setEmails(newEmails)
  }

  const validateEmails = () => {
    const validEmails = emails.filter((email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return email.trim() !== "" && emailRegex.test(email.trim())
    })
    return validEmails
  }

  const handleSendInvites = async () => {
    const validEmails = validateEmails()

    if (validEmails.length === 0) {
      alert("Please enter at least one valid email address")
      return
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    onInvitesSent(validEmails)
    setEmails([""])
    setIsLoading(false)
  }

  const validEmailCount = validateEmails().length

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {emails.map((email, index) => (
          <div key={index} className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor={`email-${index}`} className="sr-only">
                Email {index + 1}
              </Label>
              <Input
                id={`email-${index}`}
                type="email"
                placeholder="colleague@company.com"
                value={email}
                onChange={(e) => updateEmail(index, e.target.value)}
              />
            </div>
            {emails.length > 1 && (
              <Button type="button" variant="outline" size="icon" onClick={() => removeEmailField(index)}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={addEmailField} className="flex-1 bg-transparent">
          <Plus className="h-4 w-4 mr-2" />
          Add Another Email
        </Button>
      </div>

      <div className="pt-2">
        <Button onClick={handleSendInvites} disabled={validEmailCount === 0 || isLoading} className="w-full">
          <Mail className="h-4 w-4 mr-2" />
          {isLoading ? "Sending Invites..." : `Send Invites (${validEmailCount})`}
        </Button>
      </div>
    </div>
  )
}
