"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Gift, Sparkles, DollarSign } from "lucide-react"

interface GiftPresentationProps {
  amount: string
  token: string
  claimed: boolean
}

export function GiftPresentation({ amount, token, claimed }: GiftPresentationProps) {
  return (
    <Card className="relative overflow-hidden border-2 border-gradient-to-r from-purple-500 to-pink-500 bg-gradient-to-br ">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 to-pink-100/50" />
      <CardContent className="relative p-8 text-center">
        <div className="mb-6">
          <div className="relative inline-block">
            <Gift className="h-16 w-16 text-purple-600 mx-auto mb-4" />
            <Sparkles className="h-6 w-6 text-yellow-500 absolute -top-2 -right-2 animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            A Special Gift Inside!
          </h1>
          <p className="text-muted-foreground">You have been selected to receive a special reward</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 mb-6 border border-white/50">
          <div className="flex items-center justify-center gap-2 mb-2">
            <DollarSign className="h-6 w-6 text-green-600" />
            <span className="text-sm font-medium text-muted-foreground">Reward Amount</span>
          </div>
          <div className="text-4xl font-bold text-green-600 mb-2">
            {amount} {token}
          </div>
          <div className="text-sm text-muted-foreground">
            ≈ ${(Number.parseFloat(amount) * 2500).toLocaleString()} USD
          </div>
        </div>

        <div className="flex justify-center gap-2 mb-4">
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            🎁 Limited Time
          </Badge>
          <Badge variant="secondary" className="bg-pink-100 text-pink-700">
            ✨ Exclusive Offer
          </Badge>
          {claimed && (
            <Badge variant="default" className="bg-green-100 text-green-700">
              ✅ Claimed
            </Badge>
          )}
        </div>

        <p className="text-sm text-muted-foreground">
          Connect your wallet and claim your reward before the deadline expires!
        </p>
      </CardContent>
    </Card>
  )
}
