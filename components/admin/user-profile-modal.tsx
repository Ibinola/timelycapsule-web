"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Edit, Mail, Phone, MapPin, Calendar, Shield, CreditCard } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { User } from "@/types/admin"

interface UserProfileModalProps {
  user: User
  open: boolean
  onClose: () => void
  onEdit: () => void
}

export function UserProfileModal({ user, open, onClose, onEdit }: UserProfileModalProps) {
  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-yellow-100 text-yellow-800",
      banned: "bg-red-100 text-red-800",
    }

    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback className="text-lg">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-semibold">{user.name}</h3>
                {getStatusBadge(user.status)}
              </div>
              <p className="text-muted-foreground mb-2">{user.email}</p>
              <div className="flex gap-2">
                <Badge variant="outline">{user.role}</Badge>
                <Badge variant="outline">{user.subscriptionPlan}</Badge>
              </div>
            </div>
            <Button onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit User
            </Button>
          </div>

          <Separator />

          {/* Contact Information */}
          <div>
            <h4 className="font-medium mb-3">Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{user.email}</span>
                {user.emailVerified && (
                  <Badge variant="outline" className="text-xs">
                    Verified
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{user.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{user.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Born {new Date(user.dateOfBirth).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Account Details */}
          <div>
            <h4 className="font-medium mb-3">Account Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Date Joined</label>
                <p className="text-sm">{new Date(user.dateJoined).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Active</label>
                <p className="text-sm">{formatDistanceToNow(new Date(user.lastActive), { addSuffix: true })}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Login Count</label>
                <p className="text-sm">{user.loginCount.toLocaleString()} times</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Account Status</label>
                <div className="mt-1">{getStatusBadge(user.status)}</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Security Settings */}
          <div>
            <h4 className="font-medium mb-3">Security Settings</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Two-Factor Authentication</span>
                </div>
                <Badge variant={user.twoFactorEnabled ? "default" : "secondary"}>
                  {user.twoFactorEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Email Verification</span>
                </div>
                <Badge variant={user.emailVerified ? "default" : "secondary"}>
                  {user.emailVerified ? "Verified" : "Unverified"}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Subscription */}
          <div>
            <h4 className="font-medium mb-3">Subscription</h4>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{user.subscriptionPlan} Plan</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
