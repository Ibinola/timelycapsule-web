export interface MediaFile {
    id: string
    file: File
    type: "image" | "video" | "audio" | "document"
    preview?: string
    size: number
    name: string
  }
  
  export interface CapsuleContent {
    name: string
    senderName: string
    content: string
    mediaFiles: MediaFile[]
  }
  
  export interface ValidationErrors {
    name?: string
    senderName?: string
    content?: string
    files?: string
  }
  