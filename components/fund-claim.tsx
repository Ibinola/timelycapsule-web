"use client"

import { useState, useEffect } from "react"
import { Gift, Wallet, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

type WalletStatus = "disconnected" | "connecting" | "connected"
type ClaimStatus = "idle" | "processing" | "success" | "error"

export default function Component() {
  const [walletStatus, setWalletStatus] = useState<WalletStatus>("disconnected")
  const [claimStatus, setClaimStatus] = useState<ClaimStatus>("idle")
  const [walletAddress, setWalletAddress] = useState("")
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 32,
    seconds: 45,
  })

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const connectWallet = async () => {
    setWalletStatus("connecting")
    // Simulate wallet connection
    setTimeout(() => {
      setWalletStatus("connected")
      setWalletAddress("0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4")
    }, 2000)
  }

  const claimFunds = async () => {
    setClaimStatus("processing")
    // Simulate transaction processing
    setTimeout(() => {
      setClaimStatus("success")
    }, 3000)
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const totalSeconds = timeLeft.days * 86400 + timeLeft.hours * 3600 + timeLeft.minutes * 60 + timeLeft.seconds
  const progressValue = Math.max(0, 100 - (totalSeconds / (7 * 86400)) * 100) // Assuming 7 days total

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl bg-white/10 backdrop-blur-lg">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
              <Gift className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              A Special Gift Inside!
            </CardTitle>
            <CardDescription className="text-white/80 text-lg">
              You have been selected to claim exclusive rewards
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Amount Display */}
            <div className="text-center p-6 bg-gradient-to-r from-green-400/20 to-blue-500/20 rounded-xl border border-white/20">
              <div className="text-sm text-white/60 mb-2">Claimable Amount</div>
              <div className="text-4xl font-bold text-white mb-2">2,500 USDC</div>
              <div className="text-sm text-white/60">≈ $2,500.00 USD</div>
            </div>

            {/* Countdown Timer */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-white/80">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Time Remaining</span>
                </div>
                <Badge variant="destructive" className="bg-red-500/20 text-red-300 border-red-500/30">
                  Limited Time
                </Badge>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { label: "Days", value: timeLeft.days },
                  { label: "Hours", value: timeLeft.hours },
                  { label: "Minutes", value: timeLeft.minutes },
                  { label: "Seconds", value: timeLeft.seconds },
                ].map((item, index) => (
                  <div key={index} className="bg-white/10 rounded-lg p-3">
                    <div className="text-2xl font-bold text-white">{item.value.toString().padStart(2, "0")}</div>
                    <div className="text-xs text-white/60">{item.label}</div>
                  </div>
                ))}
              </div>

              <Progress value={progressValue} className="h-2 bg-white/20" />
            </div>

            {/* Wallet Connection */}
            {walletStatus === "disconnected" && (
              <Button
                onClick={connectWallet}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-105"
              >
                <Wallet className="w-5 h-5 mr-2" />
                Connect Wallet to Claim
              </Button>
            )}

            {walletStatus === "connecting" && (
              <Button disabled className="w-full bg-gray-600 text-white font-semibold py-3 rounded-xl">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Connecting Wallet...
              </Button>
            )}

            {walletStatus === "connected" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-white font-medium">Wallet Connected</span>
                  </div>
                  <span className="text-green-300 text-sm font-mono">{formatAddress(walletAddress)}</span>
                </div>

                {claimStatus === "idle" && (
                  <Button
                    onClick={claimFunds}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    <Gift className="w-5 h-5 mr-2" />
                    Claim Your Funds Now
                  </Button>
                )}

                {claimStatus === "processing" && (
                  <Button disabled className="w-full bg-yellow-600 text-white font-bold py-4 rounded-xl">
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing Transaction...
                  </Button>
                )}

                {claimStatus === "success" && (
                  <div className="text-center space-y-3">
                    <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-white font-bold text-lg">Funds Claimed Successfully!</div>
                    <div className="text-white/60 text-sm">Transaction completed. Check your wallet.</div>
                  </div>
                )}

                {claimStatus === "error" && (
                  <div className="text-center space-y-3">
                    <div className="mx-auto w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-white font-bold text-lg">Transaction Failed</div>
                    <div className="text-white/60 text-sm">Please try again or contact support.</div>
                    <Button
                      onClick={() => setClaimStatus("idle")}
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10"
                    >
                      Try Again
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Supported Wallets */}
            <div className="text-center space-y-2">
              <div className="text-white/60 text-sm">Supported Wallets</div>
              <div className="flex justify-center gap-4">
                {["MetaMask", "WalletConnect", "Coinbase"].map((wallet) => (
                  <Badge key={wallet} variant="outline" className="border-white/30 text-white/80">
                    {wallet}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Security Notice */}
            <div className="text-center text-xs text-white/50 leading-relaxed">
              🔒 Your transaction is secured by blockchain technology. Never share your private keys or seed phrase.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
