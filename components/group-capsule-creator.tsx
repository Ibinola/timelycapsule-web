"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { EmailInvitationForm } from "./email-invitation-form"
import { CollaboratorStatusTracker } from "./collaborator-status-tracker"
import { SuccessModal } from "./success-modal"
import { Calendar, Users, Lock, Settings, FileText, X } from "lucide-react"
import { ContentContributionInterface } from "./content-contribution-interface"
import { NotificationSystem } from "./notification-system"
import { AdvancedSettings } from "./advanced-settings"

export type CollaboratorStatus = "pending" | "accepted" | "contributed"

export interface Collaborator {
  id: string
  email: string
  status: CollaboratorStatus
  invitedAt: Date
  acceptedAt?: Date
  contributedAt?: Date
}

export function GroupCapsuleCreator() {
  const [capsuleTitle, setCapsuleTitle] = useState("")
  const [capsuleDescription, setCapsuleDescription] = useState("")
  const [openDate, setOpenDate] = useState("")
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isSealed, setIsSealed] = useState(false)
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false)
  const [showContentInterface, setShowContentInterface] = useState(false)
  const [capsuleSettings, setCapsuleSettings] = useState<any>({})

  const handleInvitesSent = (emails: string[]) => {
    const newCollaborators: Collaborator[] = emails.map((email) => ({
      id: Math.random().toString(36).substr(2, 9),
      email,
      status: "pending" as CollaboratorStatus,
      invitedAt: new Date(),
    }))

    setCollaborators((prev) => [...prev, ...newCollaborators])
    setShowSuccessModal(true)
  }

  const updateCollaboratorStatus = (id: string, status: CollaboratorStatus) => {
    setCollaborators((prev) =>
      prev.map((collab) => {
        if (collab.id === id) {
          const updated = { ...collab, status }
          if (status === "accepted" && !collab.acceptedAt) {
            updated.acceptedAt = new Date()
          }
          if (status === "contributed" && !collab.contributedAt) {
            updated.contributedAt = new Date()
          }
          return updated
        }
        return collab
      }),
    )
  }

  const canSealCapsule = () => {
    return (
      collaborators.length > 0 &&
      collaborators.every((collab) => collab.status === "contributed") &&
      capsuleTitle.trim() !== "" &&
      openDate !== ""
    )
  }

  const handleSealCapsule = () => {
    if (canSealCapsule()) {
      setIsSealed(true)
      // Here you would typically save to database
      console.log("Capsule sealed!", { capsuleTitle, capsuleDescription, openDate, collaborators })
    }
  }

  if (isSealed) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="text-center py-12">
          <Lock className="h-16 w-16 mx-auto mb-4 text-green-600" />
          <h2 className="text-2xl font-bold mb-2">Capsule Sealed Successfully!</h2>
          <p className="text-gray-600 mb-4">
            Your group time capsule "{capsuleTitle}" has been sealed and will open on{" "}
            {new Date(openDate).toLocaleDateString()}.
          </p>
          <p className="text-sm text-gray-500">
            All {collaborators.length} collaborators have contributed to this capsule.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Add this right after the existing header div */}
      <div className="fixed top-4 right-4 z-50">
        <NotificationSystem />
      </div>
      {/* Capsule Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Capsule Details
          </CardTitle>
          <CardDescription>Set up your group time capsule with basic information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Capsule Title</Label>
            <Input
              id="title"
              placeholder="Enter capsule title..."
              value={capsuleTitle}
              onChange={(e) => setCapsuleTitle(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe what this capsule is about..."
              value={capsuleDescription}
              onChange={(e) => setCapsuleDescription(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="openDate">Open Date</Label>
            <Input id="openDate" type="date" value={openDate} onChange={(e) => setOpenDate(e.target.value)} />
          </div>
          {/* Add this button at the end of the CardContent in the Capsule Details card */}
          <Button variant="outline" onClick={() => setShowAdvancedSettings(!showAdvancedSettings)} className="w-full">
            <Settings className="h-4 w-4 mr-2" />
            {showAdvancedSettings ? "Hide" : "Show"} Advanced Settings
          </Button>
        </CardContent>
      </Card>

      {/* Add this after the Capsule Details Card */}
      {showAdvancedSettings && <AdvancedSettings onSettingsChange={setCapsuleSettings} />}

      {/* Email Invitation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Invite Collaborators
          </CardTitle>
          <CardDescription>Send invitations to people you want to collaborate with</CardDescription>
        </CardHeader>
        <CardContent>
          <EmailInvitationForm onInvitesSent={handleInvitesSent} />
        </CardContent>
      </Card>

      {/* Collaborator Status */}
      {collaborators.length > 0 && (
        <CollaboratorStatusTracker collaborators={collaborators} onStatusUpdate={updateCollaboratorStatus} />
      )}

      {collaborators.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Ready to Seal?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {canSealCapsule()
                    ? "All collaborators have contributed. You can now seal the capsule!"
                    : `Waiting for ${collaborators.filter((c) => c.status !== "contributed").length} collaborator(s) to contribute.`}
                </p>
              </div>
              <Button
                onClick={handleSealCapsule}
                disabled={!canSealCapsule()}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Lock className="h-4 w-4 mr-2" />
                Seal Capsule
              </Button>
              {/* Add this button in the CollaboratorStatusTracker card */}
              <Button onClick={() => setShowContentInterface(true)} className="w-full mt-4">
                <FileText className="h-4 w-4 mr-2" />
                Preview Content Interface
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add this at the end of the component, before the SuccessModal */}
      {showContentInterface && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Content Contribution Preview</h2>
              <Button variant="ghost" onClick={() => setShowContentInterface(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              <ContentContributionInterface
                capsuleTitle={capsuleTitle}
                prompts={[
                  "What was your favorite moment this year?",
                  "Share a photo that represents your experience",
                  "What are you most grateful for?",
                  "What are your hopes for the future?",
                ]}
                onSubmit={(content) => {
                  console.log("Content submitted:", content)
                  setShowContentInterface(false)
                }}
              />
            </div>
          </div>
        </div>
      )}

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        inviteCount={collaborators.filter((c) => c.invitedAt.getTime() > Date.now() - 5000).length}
      />
    </div>
  )
}
