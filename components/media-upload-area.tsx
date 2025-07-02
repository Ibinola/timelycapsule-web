"use client"

import type React from "react"

import { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, ImageIcon, Video, Music, FileText, X, AlertCircle, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MediaFile } from "../types/editor"

interface MediaUploadAreaProps {
  files: MediaFile[]
  onFilesChange: (files: MediaFile[]) => void
  maxFileSize?: number // in MB
  acceptedTypes?: string[]
}

export function MediaUploadArea({
  files,
  onFilesChange,
  maxFileSize = 25,
  acceptedTypes = ["image/*", "video/*", "audio/*", ".pdf", ".doc", ".docx", ".txt"],
}: MediaUploadAreaProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [errors, setErrors] = useState<string[]>([])

  const getFileType = (file: File): "image" | "video" | "audio" | "document" => {
    if (file.type.startsWith("image/")) return "image"
    if (file.type.startsWith("video/")) return "video"
    if (file.type.startsWith("audio/")) return "audio"
    return "document"
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return ImageIcon
      case "video":
        return Video
      case "audio":
        return Music
      default:
        return FileText
    }
  }

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File "${file.name}" exceeds ${maxFileSize}MB limit`
    }

    // Check file type
    const isValidType = acceptedTypes.some((type) => {
      if (type.includes("*")) {
        return file.type.startsWith(type.replace("*", ""))
      }
      return file.name.toLowerCase().endsWith(type)
    })

    if (!isValidType) {
      return `File type not supported: ${file.name}`
    }

    return null
  }

  const processFiles = useCallback(
    async (fileList: FileList) => {
      const newFiles: MediaFile[] = []
      const newErrors: string[] = []

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i]
        const error = validateFile(file)

        if (error) {
          newErrors.push(error)
          continue
        }

        const mediaFile: MediaFile = {
          id: `${Date.now()}-${i}`,
          file,
          type: getFileType(file),
          size: file.size,
          name: file.name,
        }

        // Create preview for images
        if (file.type.startsWith("image/")) {
          const reader = new FileReader()
          reader.onload = (e) => {
            mediaFile.preview = e.target?.result as string
          }
          reader.readAsDataURL(file)
        }

        newFiles.push(mediaFile)

        // Simulate upload progress
        setUploadProgress((prev) => ({ ...prev, [mediaFile.id]: 0 }))
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise((resolve) => setTimeout(resolve, 50))
          setUploadProgress((prev) => ({ ...prev, [mediaFile.id]: progress }))
        }
      }

      setErrors(newErrors)
      onFilesChange([...files, ...newFiles])
    },
    [files, onFilesChange, maxFileSize, acceptedTypes],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      const droppedFiles = e.dataTransfer.files
      if (droppedFiles.length > 0) {
        processFiles(droppedFiles)
      }
    },
    [processFiles],
  )

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files)
    }
  }

  const removeFile = (id: string) => {
    onFilesChange(files.filter((file) => file.id !== id))
    setUploadProgress((prev) => {
      const newProgress = { ...prev }
      delete newProgress[id]
      return newProgress
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card
        className={cn(
          "border-2 border-dashed transition-colors cursor-pointer",
          isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400",
        )}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragOver(true)
        }}
        onDragLeave={() => setIsDragOver(false)}
      >
        <CardContent className="p-8 text-center">
          <Upload className={cn("mx-auto h-12 w-12 mb-4", isDragOver ? "text-blue-500" : "text-gray-400")} />
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">Upload Media Files</h3>
            <p className="text-sm text-gray-600">Drag and drop files here, or click to browse</p>
            <p className="text-xs text-gray-500">Supports images, videos, audio, and documents up to {maxFileSize}MB</p>
          </div>
          <input
            type="file"
            multiple
            accept={acceptedTypes.join(",")}
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
          />
          <Button asChild className="mt-4">
            <label htmlFor="file-upload" className="cursor-pointer">
              Choose Files
            </label>
          </Button>
        </CardContent>
      </Card>

      {/* Error Messages */}
      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Uploaded Files ({files.length})</h4>
          <div className="space-y-2">
            {files.map((file) => {
              const Icon = getFileIcon(file.type)
              const progress = uploadProgress[file.id]
              const isUploading = progress !== undefined && progress < 100

              return (
                <Card key={file.id} className="p-4">
                  <div className="flex items-center space-x-4">
                    {/* File Icon/Preview */}
                    <div className="flex-shrink-0">
                      {file.preview ? (
                        <img
                          src={file.preview || "/placeholder.svg"}
                          alt={file.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                          <Icon className="h-6 w-6 text-gray-500" />
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)} • {file.type}
                      </p>

                      {/* Upload Progress */}
                      {isUploading && (
                        <div className="mt-2">
                          <Progress value={progress} className="h-1" />
                          <p className="text-xs text-gray-500 mt-1">Uploading... {progress}%</p>
                        </div>
                      )}

                      {progress === 100 && (
                        <div className="flex items-center mt-1">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                          <span className="text-xs text-green-600">Upload complete</span>
                        </div>
                      )}
                    </div>

                    {/* Remove Button */}
                    <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)} className="flex-shrink-0">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
