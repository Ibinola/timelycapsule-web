import { Notification, NotificationTrigger, EmailHook } from '@/types/notification'

// In-memory storage for demo purposes. In production, replace with database.
const notifications: Notification[] = []
const notificationTriggers: NotificationTrigger[] = []
const emailHooks: EmailHook[] = []

export class NotificationService {
  /**
   * Trigger notification when a capsule unlocks
   * Ensures exactly one notification per capsule
   */
  static async triggerCapsuleUnlock(capsuleId: string, capsuleTitle: string, userId: string): Promise<void> {
    try {
      // Check if notification already triggered for this capsule
      const existingTrigger = notificationTriggers.find(
        trigger => trigger.capsuleId === capsuleId && trigger.type === 'capsule_unlock'
      )

      if (existingTrigger) {
        console.log(`Notification already triggered for capsule ${capsuleId}`)
        return
      }

      // Create notification trigger record to prevent duplicates
      const trigger: NotificationTrigger = {
        id: `trigger_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        capsuleId,
        userId,
        type: 'capsule_unlock',
        isProcessed: false,
        createdAt: new Date()
      }

      notificationTriggers.push(trigger)

      // Create in-app notification
      const notification: Notification = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'capsule_opened',
        title: 'Capsule Unlocked! 🎉',
        message: `Your time capsule "${capsuleTitle}" is now ready to open!`,
        timestamp: new Date(),
        isRead: false,
        capsuleId,
        actionType: 'open',
        priority: 'high'
      }

      notifications.push(notification)

      // Mark trigger as processed
      trigger.isProcessed = true
      trigger.processedAt = new Date()

      // Send email notification if hook exists
      await this.sendEmailNotification(capsuleId, capsuleTitle, userId)

      console.log(`Successfully triggered notification for capsule ${capsuleId}`)
    } catch (error) {
      console.error('Error triggering capsule unlock notification:', error)
      throw error
    }
  }

  /**
   * Send email notification (basic implementation)
   */
  private static async sendEmailNotification(capsuleId: string, capsuleTitle: string, userId: string): Promise<void> {
    try {
      const emailHook = emailHooks.find(
        hook => hook.capsuleId === capsuleId && hook.userId === userId && hook.isActive
      )

      if (!emailHook) {
        console.log(`No active email hook found for capsule ${capsuleId}`)
        return
      }

      // Basic email sending implementation
      // In production, replace with actual email service (SendGrid, AWS SES, etc.)
      const emailData = {
        to: emailHook.email,
        subject: `Your Time Capsule "${capsuleTitle}" is Now Open!`,
        body: `
          Hello!
          
          Your time capsule "${capsuleTitle}" has just unlocked and is ready to open.
          
          Visit our platform to view your capsule contents.
          
          Best regards,
          The ourKairos Team
        `
      }

      // Simulate email sending
      console.log('Sending email:', emailData)
      
      // In production, you would use an actual email service:
      // await emailService.send(emailData)
      
    } catch (error) {
      console.error('Error sending email notification:', error)
      // Don't throw here to avoid failing the main notification flow
    }
  }

  /**
   * Set up email hook for a capsule
   */
  static async setEmailHook(capsuleId: string, userId: string, email: string): Promise<void> {
    try {
      // Remove existing hook for this capsule/user combination
      const existingIndex = emailHooks.findIndex(
        hook => hook.capsuleId === capsuleId && hook.userId === userId
      )

      const emailHook: EmailHook = {
        id: `email_hook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        capsuleId,
        userId,
        email,
        isActive: true,
        createdAt: new Date()
      }

      if (existingIndex >= 0) {
        emailHooks[existingIndex] = emailHook
      } else {
        emailHooks.push(emailHook)
      }

      console.log(`Email hook set up for capsule ${capsuleId}, email: ${email}`)
    } catch (error) {
      console.error('Error setting email hook:', error)
      throw error
    }
  }

  /**
   * Get all notifications for a user
   */
  static async getUserNotifications(userId: string): Promise<Notification[]> {
    // In production, filter by userId from database
    return notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  /**
   * Mark notification as read
   */
  static async markNotificationAsRead(notificationId: string): Promise<void> {
    const notification = notifications.find(n => n.id === notificationId)
    if (notification) {
      notification.isRead = true
    }
  }

  /**
   * Delete notification
   */
  static async deleteNotification(notificationId: string): Promise<void> {
    const index = notifications.findIndex(n => n.id === notificationId)
    if (index >= 0) {
      notifications.splice(index, 1)
    }
  }

  /**
   * Check if capsule unlock notification was already sent
   */
  static wasNotificationSent(capsuleId: string): boolean {
    return notificationTriggers.some(
      trigger => trigger.capsuleId === capsuleId && 
                trigger.type === 'capsule_unlock' && 
                trigger.isProcessed
    )
  }

  /**
   * Get notification statistics
   */
  static getNotificationStats(): {
    total: number
    unread: number
    byType: Record<string, number>
  } {
    const total = notifications.length
    const unread = notifications.filter(n => !n.isRead).length
    const byType = notifications.reduce((acc, notif) => {
      acc[notif.type] = (acc[notif.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return { total, unread, byType }
  }
}
