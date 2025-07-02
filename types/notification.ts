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
  
  export type NotificationFilter = "all" | "unread" | "read"
  