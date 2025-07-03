"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { AlertTriangle, Loader2 } from "lucide-react"
import type { User } from "@/types/admin"

interface DeleteUserModalProps {
  user: User
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

export function DeleteUserModal({ user, open, onClose, onConfirm }: DeleteUserModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmationText, setConfirmationText] = useState("")

  const requiredText = "DELETE"
  const isConfirmationValid = confirmationText === requiredText

  const handleDelete = async () => {
    if (!isConfirmationValid) return

    setIsDeleting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onConfirm()
      toast({
        title: "User deleted",
        description: `${user.name} has been permanently deleted.`,
      })
      setConfirmationText("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete User Account
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              You are about to permanently delete <strong>{user.name}</strong> ({user.email}).
            </p>
            <p>This action cannot be undone. This will permanently delete:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>User account and profile information</li>
              <li>All user data and activity history</li>
              <li>Any associated files or content</li>
              <li>Subscription and billing information</li>
            </ul>
            <div className="space-y-2 pt-2">
              <Label htmlFor="confirmation">
                Type <code className="bg-muted px-1 py-0.5 rounded text-sm">{requiredText}</code> to confirm
              </Label>
              <Input
                id="confirmation"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder="Type DELETE to confirm"
                className={confirmationText && !isConfirmationValid ? "border-destructive" : ""}
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setConfirmationText("")}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={!isConfirmationValid || isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete User"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
