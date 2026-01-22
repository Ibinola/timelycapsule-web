import { NextRequest, NextResponse } from 'next/server'
import { NotificationService } from '@/lib/notification-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const notifications = await NotificationService.getUserNotifications(userId)
    
    return NextResponse.json({
      success: true,
      data: notifications,
      stats: NotificationService.getNotificationStats()
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

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

    await NotificationService.triggerCapsuleUnlock(capsuleId, capsuleTitle, userId)
    
    return NextResponse.json({
      success: true,
      message: 'Notification triggered successfully'
    })
  } catch (error) {
    console.error('Error triggering notification:', error)
    return NextResponse.json(
      { error: 'Failed to trigger notification' },
      { status: 500 }
    )
  }
}
