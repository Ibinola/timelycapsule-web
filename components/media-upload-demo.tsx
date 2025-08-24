"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useMobile } from "@/hooks/use-mobile"
import { Upload, X, ImageIcon, Video, File, Camera } from "lucide-react"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  progress: number
  preview?: string
}

export function MediaUploadDemo() {
  const isMobile = useMobile()
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    processFiles(droppedFiles)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    processFiles(selectedFiles)
  }, [])

  const processFiles = (fileList: File[]) => {
    const newFiles: UploadedFile[] = fileList.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
    }))

    setFiles((prev) => [...prev, ...newFiles])

    // Simulate upload progress
    newFiles.forEach((file) => {
      const interval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) => (f.id === file.id ? { ...f, progress: Math.min(f.progress + Math.random() * 30, 100) } : f)),
        )
      }, 500)

      setTimeout(() => clearInterval(interval), 3000)
    })
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return ImageIcon
    if (type.startsWith("video/")) return Video
    return File
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg transition-colors
          ${isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25"}
          ${isMobile ? "p-6" : "p-8"}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-center space-y-4">
          <div className={`mx-auto ${isMobile ? "h-12 w-12" : "h-16 w-16"} text-muted-foreground`}>
            <Upload className="h-full w-full" />
          </div>

          <div className="space-y-2">
            <h3 className={`font-medium ${isMobile ? "text-base" : "text-lg"}`}>
              {isMobile ? "Upload Files" : "Drag & drop files here"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isMobile ? "Tap to select files from your device" : "or click to browse from your computer"}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button
              variant="outline"
              className={`${isMobile ? "h-11" : "h-10"} touch-manipulation`}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose Files
            </Button>

            {isMobile && (
              <Button
                variant="outline"
                className="h-11 touch-manipulation bg-transparent"
                onClick={() => {
                  // In a real app, this would open the camera
                  console.log("Open camera")
                }}
              >
                <Camera className="h-4 w-4 mr-2" />
                Take Photo
              </Button>
            )}
          </div>

          <input
            id="file-input"
            type="file"
            multiple
            accept="image/*,video/*,.pdf,.doc,.docx"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Uploaded Files ({files.length})</h4>
          <div className="space-y-2">
            {files.map((file) => {
              const FileIcon = getFileIcon(file.type)
              return (
                <div
                  key={file.id}
                  className={`flex items-center gap-3 p-3 border rounded-lg ${isMobile ? "flex-col space-y-2" : ""}`}
                >
                  {/* File Preview/Icon */}
                  <div className={`flex-shrink-0 ${isMobile ? "self-start" : ""}`}>
                    {file.preview ? (
                      <img
                        src={file.preview || "/placeholder.svg"}
                        alt={file.name}
                        className="h-10 w-10 rounded object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                        <FileIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className={`flex-1 min-w-0 ${isMobile ? "w-full" : ""}`}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`${isMobile ? "h-8 w-8 p-0" : "h-6 w-6 p-0"} flex-shrink-0 ml-2`}
                        onClick={() => removeFile(file.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <span>{formatFileSize(file.size)}</span>
                      <Badge variant="secondary" className="text-xs">
                        {file.type.split("/")[0]}
                      </Badge>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <Progress value={file.progress} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{Math.round(file.progress)}% complete</span>
                        {file.progress === 100 && <span className="text-green-600">✓ Uploaded</span>}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
