"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/hooks/use-toast"
import { AlertTriangle, Trash2, Loader2 } from "lucide-react"

export function AccountDeletion() {
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmationText, setConfirmationText] = useState("")
  const [acknowledgeWarnings, setAcknowledgeWarnings] = useState({
    dataLoss: false,
    irreversible: false,
    subscriptions: false,
  })

  const requiredText = "DELETE MY ACCOUNT"
  const isConfirmationValid = confirmationText === requiredText
  const allWarningsAcknowledged = Object.values(acknowledgeWarnings).every(Boolean)
  const canDelete = isConfirmationValid && allWarningsAcknowledged

  const handleDeleteAccount = async () => {
    if (!canDelete) return

    setIsDeleting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Account deletion initiated",
        description: "Your account deletion request has been processed. You will receive a confirmation email.",
      })

      // Reset form
      setConfirmationText("")
      setAcknowledgeWarnings({
        dataLoss: false,
        irreversible: false,
        subscriptions: false,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again or contact support.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleWarningChange = (warning: keyof typeof acknowledgeWarnings, checked: boolean) => {
    setAcknowledgeWarnings((prev) => ({ ...prev, [warning]: checked }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
        <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
        <div>
          <h4 className="font-medium text-destructive">Warning: This action cannot be undone</h4>
          <p className="text-sm text-destructive/80 mt-1">
            Deleting your account will permanently remove all your data, settings, and access to our services.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Before you delete your account, please note:</h4>

        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="data-loss"
              checked={acknowledgeWarnings.dataLoss}
              onCheckedChange={(checked) => handleWarningChange("dataLoss", checked as boolean)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="data-loss" className="text-sm font-normal">
                I understand that all my data, including files, settings, and history will be permanently deleted
              </Label>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="irreversible"
              checked={acknowledgeWarnings.irreversible}
              onCheckedChange={(checked) => handleWarningChange("irreversible", checked as boolean)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="irreversible" className="text-sm font-normal">
                I understand that this action is irreversible and I will not be able to recover my account
              </Label>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="subscriptions"
              checked={acknowledgeWarnings.subscriptions}
              onCheckedChange={(checked) => handleWarningChange("subscriptions", checked as boolean)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="subscriptions" className="text-sm font-normal">
                I understand that any active subscriptions will be cancelled and I may still be charged for the current
                billing period
              </Label>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmation">
          Type <code className="bg-muted px-1 py-0.5 rounded text-sm">{requiredText}</code> to confirm
        </Label>
        <Input
          id="confirmation"
          value={confirmationText}
          onChange={(e) => setConfirmationText(e.target.value)}
          placeholder="Type the confirmation text"
          className={confirmationText && !isConfirmationValid ? "border-destructive" : ""}
        />
        {confirmationText && !isConfirmationValid && (
          <p className="text-sm text-destructive">Please type the exact text: {requiredText}</p>
        )}
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" disabled={!canDelete || isDeleting} className="w-full">
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting Account...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete My Account
              </>
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and remove all your data from our
              servers.
              <br />
              <br />
              <strong>This includes:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>All your personal information and settings</li>
                <li>All uploaded files and documents</li>
                <li>Your account history and activity</li>
                <li>Any active subscriptions or services</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Yes, delete my account"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
