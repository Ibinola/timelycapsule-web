export interface Notification {
    id: string
    type: "capsule_opened" | "capsule_received" | "capsule_expiring" | "system" | "reminder"
    title: string
    message: string
    timestamp: Date
    isRead: boolean
    capsuleId?: string
    actionType?: "view" | "open" | "none"
    priority: "low" | "medium" | "high"
    avatar?: string
  }

  export interface NotificationTrigger {
    id: string
    capsuleId: string
    userId: string
    type: "capsule_unlock"
    isProcessed: boolean
    createdAt: Date
    processedAt?: Date
  }

  export interface EmailHook {
    id: string
    capsuleId: string
    userId: string
    email: string
    isActive: boolean
    createdAt: Date
  }
  
  export type NotificationFilter = "all" | "unread" | "read"
  