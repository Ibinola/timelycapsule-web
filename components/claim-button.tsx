"use client"

import { Button } from "@/components/ui/button"
import { Loader2, Wallet, Gift } from "lucide-react"
import type { TransactionState } from "../types/wallet"

interface ClaimButtonProps {
  isConnected: boolean
  isExpired: boolean
  isClaimed: boolean
  transaction: TransactionState
  onConnect: () => void
  onClaim: () => void
}

export function ClaimButton({ isConnected, isExpired, isClaimed, transaction, onConnect, onClaim }: ClaimButtonProps) {
  if (isExpired) {
    return (
      <Button disabled size="lg" className="w-full">
        Claim Period Expired
      </Button>
    )
  }

  if (isClaimed) {
    return (
      <Button disabled size="lg" className="w-full bg-green-600">
        <Gift className="mr-2 h-5 w-5" />
        Already Claimed
      </Button>
    )
  }

  if (!isConnected) {
    return (
      <Button onClick={onConnect} size="lg" className="w-full">
        <Wallet className="mr-2 h-5 w-5" />
        Connect Wallet to Claim
      </Button>
    )
  }

  if (transaction.status === "pending") {
    return (
      <Button disabled size="lg" className="w-full">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Processing Claim...
      </Button>
    )
  }

  return (
    <Button
      onClick={onClaim}
      size="lg"
      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
    >
      <Gift className="mr-2 h-5 w-5" />
      Claim Your Reward
    </Button>
  )
}
