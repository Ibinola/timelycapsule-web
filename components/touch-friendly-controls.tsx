"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { useMobile } from "@/hooks/use-mobile"
import { Heart, Star, Share2, Bookmark, ThumbsUp } from "lucide-react"

export function TouchFriendlyControls() {
  const isMobile = useMobile()
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [rating, setRating] = useState(3)
  const [volume, setVolume] = useState([50])
  const [notifications, setNotifications] = useState(true)

  return (
    <div className="space-y-6">
      {/* Touch-optimized buttons with minimum 44px height */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Action Buttons</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={liked ? "default" : "outline"}
            size={isMobile ? "default" : "sm"}
            className={`${isMobile ? "h-11 px-4" : "h-9 px-3"} touch-manipulation`}
            onClick={() => setLiked(!liked)}
          >
            <Heart className={`h-4 w-4 mr-2 ${liked ? "fill-current" : ""}`} />
            Like
          </Button>

          <Button
            variant={bookmarked ? "default" : "outline"}
            size={isMobile ? "default" : "sm"}
            className={`${isMobile ? "h-11 px-4" : "h-9 px-3"} touch-manipulation`}
            onClick={() => setBookmarked(!bookmarked)}
          >
            <Bookmark className={`h-4 w-4 mr-2 ${bookmarked ? "fill-current" : ""}`} />
            Save
          </Button>

          <Button
            variant="outline"
            size={isMobile ? "default" : "sm"}
            className={`${isMobile ? "h-11 px-4" : "h-9 px-3"} touch-manipulation`}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Star rating with touch-friendly targets */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Star Rating</h3>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className={`${isMobile ? "p-2" : "p-1"} touch-manipulation rounded-sm hover:bg-muted transition-colors`}
              onClick={() => setRating(star)}
            >
              <Star
                className={`${isMobile ? "h-6 w-6" : "h-5 w-5"} ${
                  star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                }`}
              />
            </button>
          ))}
          <Badge variant="secondary" className="ml-2">
            {rating}/5
          </Badge>
        </div>
      </div>

      {/* Touch-friendly slider */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Volume Control</h3>
        <div className="px-2">
          <Slider
            value={volume}
            onValueChange={setVolume}
            max={100}
            step={1}
            className={`${isMobile ? "h-6" : "h-4"} touch-manipulation`}
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0</span>
            <span>{volume[0]}%</span>
            <span>100</span>
          </div>
        </div>
      </div>

      {/* Touch-friendly switch */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Settings</h3>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label className="text-sm font-medium">Push Notifications</label>
            <p className="text-xs text-muted-foreground">Receive notifications on your device</p>
          </div>
          <Switch checked={notifications} onCheckedChange={setNotifications} className="touch-manipulation" />
        </div>
      </div>

      {/* Touch feedback indicators */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { icon: ThumbsUp, label: "Approve", color: "bg-green-100 text-green-700 hover:bg-green-200" },
            { icon: Heart, label: "Favorite", color: "bg-red-100 text-red-700 hover:bg-red-200" },
            { icon: Star, label: "Rate", color: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" },
            { icon: Share2, label: "Share", color: "bg-blue-100 text-blue-700 hover:bg-blue-200" },
          ].map((action) => (
            <button
              key={action.label}
              className={`${action.color} ${
                isMobile ? "p-4 h-20" : "p-3 h-16"
              } rounded-lg flex flex-col items-center justify-center gap-1 touch-manipulation transition-colors active:scale-95`}
            >
              <action.icon className={`${isMobile ? "h-6 w-6" : "h-5 w-5"}`} />
              <span className="text-xs font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
