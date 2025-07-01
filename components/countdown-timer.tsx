"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, AlertTriangle } from "lucide-react"
import { useCountdown } from "../hooks/useCountdown"

interface CountdownTimerProps {
  deadline: number
}

export function CountdownTimer({ deadline }: CountdownTimerProps) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(deadline)

  if (isExpired) {
    return (
      <Card className="border-destructive bg-destructive/5">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center gap-2 text-destructive mb-2">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-semibold">Claim Period Expired</span>
          </div>
          <p className="text-sm text-muted-foreground">
            The claiming deadline has passed. This offer is no longer available.
          </p>
        </CardContent>
      </Card>
    )
  }

  const timeUnits = [
    { label: "Days", value: days },
    { label: "Hours", value: hours },
    { label: "Minutes", value: minutes },
    { label: "Seconds", value: seconds },
  ]

  const isUrgent = days === 0 && hours < 24

  return (
    <Card className={`${isUrgent ? "border-orange-500 bg-orange-50" : "border-primary bg-primary/5"}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Clock className={`h-5 w-5 ${isUrgent ? "text-orange-600" : "text-primary"}`} />
          <span className="font-semibold">Time Remaining</span>
          {isUrgent && (
            <Badge variant="destructive" className="ml-2">
              Urgent
            </Badge>
          )}
        </div>
        <div className="grid grid-cols-4 gap-4 text-center">
          {timeUnits.map((unit) => (
            <div key={unit.label} className="space-y-1">
              <div className={`text-2xl font-bold ${isUrgent ? "text-orange-600" : "text-primary"}`}>
                {unit.value.toString().padStart(2, "0")}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">{unit.label}</div>
            </div>
          ))}
        </div>
        {isUrgent && (
          <p className="text-center text-sm text-orange-600 mt-4 font-medium">⚠️ Less than 24 hours remaining!</p>
        )}
      </CardContent>
    </Card>
  )
}
