import { NextRequest, NextResponse } from 'next/server'
import { NotificationService } from '@/lib/notification-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { capsuleId, userId, email } = body

    if (!capsuleId || !userId || !email) {
      return NextResponse.json(
        { error: 'capsuleId, userId, and email are required' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    await NotificationService.setEmailHook(capsuleId, userId, email)
    
    return NextResponse.json({
      success: true,
      message: 'Email hook set up successfully'
    })
  } catch (error) {
    console.error('Error setting up email hook:', error)
    return NextResponse.json(
      { error: 'Failed to set up email hook' },
      { status: 500 }
    )
  }
}
