"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, ImageIcon, Video, Music, X, Save, Send } from "lucide-react"

interface ContentItem {
  id: string
  type: "text" | "image" | "video" | "audio" | "file"
  title: string
  content: string
  file?: File
  prompt?: string
}

interface ContentContributionInterfaceProps {
  capsuleTitle: string
  prompts: string[]
  onSubmit: (content: ContentItem[]) => void
}

export function ContentContributionInterface({ capsuleTitle, prompts, onSubmit }: ContentContributionInterfaceProps) {
  const [contentItems, setContentItems] = useState<ContentItem[]>([])
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0)
  const [isDraft, setIsDraft] = useState(true)

  const addContentItem = (type: ContentItem["type"]) => {
    const newItem: ContentItem = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      title: "",
      content: "",
      prompt: prompts[currentPromptIndex],
    }
    setContentItems([...contentItems, newItem])
  }

  const updateContentItem = (id: string, updates: Partial<ContentItem>) => {
    setContentItems((items) => items.map((item) => (item.id === id ? { ...item, ...updates } : item)))
  }

  const removeContentItem = (id: string) => {
    setContentItems((items) => items.filter((item) => item.id !== id))
  }

  const handleFileUpload = (id: string, file: File) => {
    updateContentItem(id, { file, title: file.name })
  }

  const getContentTypeIcon = (type: ContentItem["type"]) => {
    switch (type) {
      case "text":
        return <FileText className="h-4 w-4" />
      case "image":
        return <ImageIcon className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      case "audio":
        return <Music className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getContentTypeColor = (type: ContentItem["type"]) => {
    switch (type) {
      case "text":
        return "bg-blue-100 text-blue-800"
      case "image":
        return "bg-green-100 text-green-800"
      case "video":
        return "bg-purple-100 text-purple-800"
      case "audio":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const completedPrompts = new Set(contentItems.map((item) => item.prompt).filter(Boolean))
  const progress = (completedPrompts.size / prompts.length) * 100

  const handleSaveDraft = () => {
    setIsDraft(true)
    // Save to local storage or send to server
    console.log("Saving draft:", contentItems)
  }

  const handleSubmitContribution = () => {
    setIsDraft(false)
    onSubmit(contentItems)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Contribute to "{capsuleTitle}"</CardTitle>
          <CardDescription>Add your memories, thoughts, and media to this time capsule</CardDescription>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>
                {completedPrompts.size}/{prompts.length} prompts completed
              </span>
            </div>
            <Progress value={progress} />
          </div>
        </CardHeader>
      </Card>

      {/* Prompts Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Guided Prompts</CardTitle>
          <CardDescription>Use these prompts to guide your contributions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {prompts.map((prompt, index) => (
              <Button
                key={index}
                variant={currentPromptIndex === index ? "default" : "outline"}
                className="justify-start text-left h-auto p-4"
                onClick={() => setCurrentPromptIndex(index)}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      completedPrompts.has(prompt) ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="flex-1">{prompt}</span>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Prompt */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Current Prompt</CardTitle>
          <CardDescription className="text-base font-medium">{prompts[currentPromptIndex]}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => addContentItem("text")} variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Add Text
            </Button>
            <Button onClick={() => addContentItem("image")} variant="outline" size="sm">
              <ImageIcon className="h-4 w-4 mr-2" />
              Add Image
            </Button>
            <Button onClick={() => addContentItem("video")} variant="outline" size="sm">
              <Video className="h-4 w-4 mr-2" />
              Add Video
            </Button>
            <Button onClick={() => addContentItem("audio")} variant="outline" size="sm">
              <Music className="h-4 w-4 mr-2" />
              Add Audio
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Content Items */}
      <div className="space-y-4">
        {contentItems.map((item) => (
          <Card key={item.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className={getContentTypeColor(item.type)}>
                    {getContentTypeIcon(item.type)}
                    <span className="ml-1 capitalize">{item.type}</span>
                  </Badge>
                  {item.prompt && (
                    <Badge variant="outline" className="text-xs">
                      Prompt: {item.prompt.substring(0, 30)}...
                    </Badge>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeContentItem(item.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor={`title-${item.id}`}>Title</Label>
                <Input
                  id={`title-${item.id}`}
                  placeholder="Give your content a title..."
                  value={item.title}
                  onChange={(e) => updateContentItem(item.id, { title: e.target.value })}
                />
              </div>

              {item.type === "text" && (
                <div>
                  <Label htmlFor={`content-${item.id}`}>Content</Label>
                  <Textarea
                    id={`content-${item.id}`}
                    placeholder="Write your message, memory, or thoughts..."
                    value={item.content}
                    onChange={(e) => updateContentItem(item.id, { content: e.target.value })}
                    rows={4}
                  />
                </div>
              )}

              {item.type !== "text" && (
                <div>
                  <Label htmlFor={`file-${item.id}`}>Upload File</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop your {item.type}</p>
                    <input
                      id={`file-${item.id}`}
                      type="file"
                      accept={
                        item.type === "image"
                          ? "image/*"
                          : item.type === "video"
                            ? "video/*"
                            : item.type === "audio"
                              ? "audio/*"
                              : "*/*"
                      }
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload(item.id, file)
                      }}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById(`file-${item.id}`)?.click()}
                    >
                      Choose File
                    </Button>
                    {item.file && <p className="text-sm text-green-600 mt-2">Selected: {item.file.name}</p>}
                  </div>
                </div>
              )}

              {(item.type !== "text" || item.content) && (
                <div>
                  <Label htmlFor={`description-${item.id}`}>Description (Optional)</Label>
                  <Textarea
                    id={`description-${item.id}`}
                    placeholder="Add a description or context..."
                    value={item.content}
                    onChange={(e) => updateContentItem(item.id, { content: e.target.value })}
                    rows={2}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSaveDraft}>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSubmitContribution}
                disabled={contentItems.length === 0}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Contribution
              </Button>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              {isDraft ? "Your changes are saved as draft" : "Your contribution has been submitted"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
