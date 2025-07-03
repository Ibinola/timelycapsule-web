"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import type { User, UserStatus } from "@/types/admin"

interface EditUserModalProps {
  user: User
  open: boolean
  onClose: () => void
  onSave: (user: User) => void
}

export function EditUserModal({ user, open, onClose, onSave }: EditUserModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<User>(user)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onSave(formData)
      toast({
        title: "User updated",
        description: "User information has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof User, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="font-medium">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
              />
            </div>
          </div>

          {/* Account Settings */}
          <div className="space-y-4">
            <h4 className="font-medium">Account Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value as UserStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="banned">Banned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subscriptionPlan">Subscription Plan</Label>
                <Select
                  value={formData.subscriptionPlan}
                  onValueChange={(value) => handleInputChange("subscriptionPlan", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Free">Free</SelectItem>
                    <SelectItem value="Pro">Pro</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="space-y-4">
            <h4 className="font-medium">Security Settings</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailVerified">Email Verified</Label>
                  <p className="text-sm text-muted-foreground">Whether the user's email is verified</p>
                </div>
                <Switch
                  id="emailVerified"
                  checked={formData.emailVerified}
                  onCheckedChange={(checked) => handleInputChange("emailVerified", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="twoFactorEnabled">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Whether 2FA is enabled for this user</p>
                </div>
                <Switch
                  id="twoFactorEnabled"
                  checked={formData.twoFactorEnabled}
                  onCheckedChange={(checked) => handleInputChange("twoFactorEnabled", checked)}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
