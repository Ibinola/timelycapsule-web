"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/hooks/use-toast"
import { Upload, Camera, Trash2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function ProfilePictureUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>("/placeholder.svg?height=150&width=150")
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (PNG, JPG, GIF).",
        variant: "destructive",
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      })
      return
    }

    uploadFile(file)
  }

  const uploadFile = async (file: File) => {
    setIsUploading(true)

    try {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setProfileImage(previewUrl)

      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been uploaded successfully.",
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload profile picture. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleRemoveImage = () => {
    setProfileImage(null)
    toast({
      title: "Profile picture removed",
      description: "Your profile picture has been removed.",
    })
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="h-32 w-32">
          <AvatarImage src={profileImage || undefined} alt="Profile picture" />
          <AvatarFallback className="text-2xl">
            {isUploading ? <Loader2 className="h-8 w-8 animate-spin" /> : <Camera className="h-8 w-8" />}
          </AvatarFallback>
        </Avatar>

        <div className="text-center">
          <h3 className="font-medium">Profile Picture</h3>
          <p className="text-sm text-muted-foreground">JPG, PNG or GIF. Max size 5MB.</p>
        </div>
      </div>

      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          isUploading && "opacity-50 pointer-events-none",
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
            <Upload className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">
              Drag and drop your image here, or{" "}
              <button
                type="button"
                onClick={triggerFileInput}
                className="text-primary hover:underline"
                disabled={isUploading}
              >
                browse files
              </button>
            </p>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={isUploading}
      />

      <div className="flex gap-2">
        <Button onClick={triggerFileInput} disabled={isUploading} className="flex-1">
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload New Picture
            </>
          )}
        </Button>

        {profileImage && (
          <Button variant="outline" onClick={handleRemoveImage} disabled={isUploading}>
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
