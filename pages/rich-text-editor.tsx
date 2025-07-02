"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Save, ArrowRight, AlertCircle, CheckCircle } from "lucide-react"
import { RichTextToolbar } from "../components/rich-text-toolbar"
import { MediaUploadArea } from "../components/media-upload-area"
import type { CapsuleContent, MediaFile, ValidationErrors } from "../types/editor"

export default function RichTextEditor() {
  const [content, setContent] = useState<CapsuleContent>({
    name: "",
    senderName: "",
    content: "",
    mediaFiles: [],
  })
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isDraftSaved, setIsDraftSaved] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const editorRef = useRef<HTMLDivElement>(null)

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem("capsule-content-draft")
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft)
        setContent({
          ...parsed,
          mediaFiles: [], // Files can't be serialized
        })
        if (editorRef.current && parsed.content) {
          editorRef.current.innerHTML = parsed.content
        }
      } catch (error) {
        console.error("Failed to load draft:", error)
      }
    }
  }, [])

  // Update word count when content changes
  useEffect(() => {
    if (editorRef.current) {
      const text = editorRef.current.innerText || ""
      const words = text
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0)
      setWordCount(words.length)
    }
  }, [content.content])

  const handleEditorCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    if (editorRef.current) {
      setContent((prev) => ({
        ...prev,
        content: editorRef.current!.innerHTML,
      }))
    }
  }

  const handleEditorChange = () => {
    if (editorRef.current) {
      setContent((prev) => ({
        ...prev,
        content: editorRef.current!.innerHTML,
      }))
    }
  }

  const handleFilesChange = (files: MediaFile[]) => {
    setContent((prev) => ({
      ...prev,
      mediaFiles: files,
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}

    if (!content.name.trim()) {
      newErrors.name = "Capsule name is required"
    } else if (content.name.length < 3) {
      newErrors.name = "Capsule name must be at least 3 characters"
    } else if (content.name.length > 100) {
      newErrors.name = "Capsule name must be less than 100 characters"
    }

    if (!content.senderName.trim()) {
      newErrors.senderName = "Sender name is required"
    } else if (content.senderName.length < 2) {
      newErrors.senderName = "Sender name must be at least 2 characters"
    }

    const textContent = editorRef.current?.innerText || ""
    if (!textContent.trim()) {
      newErrors.content = "Message content is required"
    } else if (textContent.length < 10) {
      newErrors.content = "Message must be at least 10 characters"
    }

    // Check total file size
    const totalSize = content.mediaFiles.reduce((sum, file) => sum + file.size, 0)
    const maxTotalSize = 100 * 1024 * 1024 // 100MB total
    if (totalSize > maxTotalSize) {
      newErrors.files = "Total file size cannot exceed 100MB"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const saveDraft = () => {
    const draftData = {
      ...content,
      mediaFiles: [], // Don't save files in localStorage
    }
    localStorage.setItem("capsule-content-draft", JSON.stringify(draftData))
    setIsDraftSaved(true)
    setTimeout(() => setIsDraftSaved(false), 2000)
  }

  const handleNext = () => {
    if (validateForm()) {
      console.log("Proceeding to next step with content:", content)
      // Navigate to next step
    }
  }

  const getTotalFileSize = () => {
    const totalBytes = content.mediaFiles.reduce((sum, file) => sum + file.size, 0)
    const totalMB = totalBytes / (1024 * 1024)
    return totalMB.toFixed(1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Capsule Content</h1>
          <p className="text-gray-600">Craft your message and add media files for your time capsule</p>
        </div>

        {/* Draft Saved Alert */}
        {isDraftSaved && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">Draft saved successfully!</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="capsule-name">Capsule Name *</Label>
                  <Input
                    id="capsule-name"
                    placeholder="Give your time capsule a memorable name"
                    value={content.name}
                    onChange={(e) => setContent((prev) => ({ ...prev, name: e.target.value }))}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                  <p className="text-xs text-gray-500">{content.name.length}/100 characters</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sender-name">Your Name *</Label>
                  <Input
                    id="sender-name"
                    placeholder="Enter your name"
                    value={content.senderName}
                    onChange={(e) => setContent((prev) => ({ ...prev, senderName: e.target.value }))}
                    className={errors.senderName ? "border-red-500" : ""}
                  />
                  {errors.senderName && <p className="text-sm text-red-500">{errors.senderName}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Rich Text Editor */}
            <Card>
              <CardHeader>
                <CardTitle>Your Message *</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <RichTextToolbar onCommand={handleEditorCommand} />
                <div
                  ref={editorRef}
                  contentEditable
                  className={`min-h-[300px] p-4 focus:outline-none ${errors.content ? "border-red-500" : ""}`}
                  onInput={handleEditorChange}
                  style={{ whiteSpace: "pre-wrap" }}
                  data-placeholder="Write your message to the future..."
                />
                {errors.content && (
                  <div className="p-4 pt-0">
                    <p className="text-sm text-red-500">{errors.content}</p>
                  </div>
                )}
                <div className="px-4 pb-4 flex justify-between text-xs text-gray-500">
                  <span>{wordCount} words</span>
                  <span>Rich text formatting enabled</span>
                </div>
              </CardContent>
            </Card>

            {/* Media Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Media Files</CardTitle>
              </CardHeader>
              <CardContent>
                <MediaUploadArea files={content.mediaFiles} onFilesChange={handleFilesChange} />
                {errors.files && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.files}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle>Content Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Word count:</span>
                    <span className="font-medium">{wordCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Media files:</span>
                    <span className="font-medium">{content.mediaFiles.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total file size:</span>
                    <span className="font-medium">{getTotalFileSize()} MB</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900">Content Guidelines</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Keep messages personal and meaningful</li>
                    <li>• Maximum 25MB per file</li>
                    <li>• Supported: images, videos, audio, documents</li>
                    <li>• Total size limit: 100MB</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <Button
                  onClick={saveDraft}
                  variant="outline"
                  className="w-full flex items-center space-x-2 bg-transparent"
                >
                  <Save className="h-4 w-4" />
                  <span>Save as Draft</span>
                </Button>

                <Button onClick={handleNext} className="w-full flex items-center space-x-2">
                  <span>Next: Set Timing</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Pro Tips</h4>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Use formatting to make your message more engaging</li>
                  <li>• Add photos and videos to capture memories</li>
                  <li>• Your draft is automatically saved locally</li>
                  <li>• Consider adding audio messages for a personal touch</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
