"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle, Mail } from "lucide-react"

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  inviteCount: number
}

export function SuccessModal({ isOpen, onClose, inviteCount }: SuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <DialogTitle>Invitations Sent Successfully!</DialogTitle>
          <DialogDescription className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm">
              <Mail className="h-4 w-4" />
              <span>
                {inviteCount} invitation{inviteCount !== 1 ? "s" : ""} sent
              </span>
            </div>
            <p>
              Your collaborators will receive email invitations to join the group capsule. They'll be able to accept and
              contribute their content.
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
          <Button onClick={onClose} className="w-full">
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
