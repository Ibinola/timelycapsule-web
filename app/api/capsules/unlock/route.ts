import { NextRequest, NextResponse } from 'next/server'
import { NotificationService } from '@/lib/notification-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { capsuleId, capsuleTitle, userId } = body

    if (!capsuleId || !capsuleTitle || !userId) {
      return NextResponse.json(
        { error: 'capsuleId, capsuleTitle, and userId are required' },
        { status: 400 }
      )
    }

    // Check if notification was already sent to prevent duplicates
    if (NotificationService.wasNotificationSent(capsuleId)) {
      return NextResponse.json({
        success: true,
        message: 'Notification already sent for this capsule',
        alreadySent: true
      })
    }

    // Trigger the notification
    await NotificationService.triggerCapsuleUnlock(capsuleId, capsuleTitle, userId)
    
    return NextResponse.json({
      success: true,
      message: 'Capsule unlock notification triggered successfully'
    })
  } catch (error) {
    console.error('Error triggering capsule unlock:', error)
    return NextResponse.json(
      { error: 'Failed to trigger capsule unlock notification' },
      { status: 500 }
    )
  }
}
