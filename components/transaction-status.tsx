"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2, ExternalLink, Copy } from "lucide-react"
import type { TransactionState } from "../types/wallet"
import { useState } from "react"

interface TransactionStatusProps {
  transaction: TransactionState
  onRetry?: () => void
}

export function TransactionStatus({ transaction, onRetry }: TransactionStatusProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const getStatusConfig = () => {
    switch (transaction.status) {
      case "pending":
        return {
          icon: <Loader2 className="h-8 w-8 animate-spin text-blue-600" />,
          title: "Transaction Pending",
          description: "Your claim is being processed on the blockchain...",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
        }
      case "success":
        return {
          icon: <CheckCircle className="h-8 w-8 text-green-600" />,
          title: "Claim Successful!",
          description: "Your funds have been successfully claimed and transferred to your wallet.",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
        }
      case "error":
        return {
          icon: <XCircle className="h-8 w-8 text-red-600" />,
          title: "Transaction Failed",
          description: transaction.error || "An error occurred while processing your claim.",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
        }
      default:
        return null
    }
  }

  const config = getStatusConfig()
  if (!config) return null

  return (
    <Card className={`${config.borderColor} ${config.bgColor}`}>
      <CardContent className="p-6 text-center">
        <div className="mb-4">{config.icon}</div>
        <h3 className="text-lg font-semibold mb-2">{config.title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{config.description}</p>

        {transaction.hash && (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <Badge variant="outline">Transaction Hash</Badge>
            </div>
            <div className="bg-white/80 rounded-lg p-3 border">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="truncate flex-1">{transaction.hash}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(transaction.hash!)}
                  className="h-6 w-6 p-0"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            {copied && <p className="text-xs text-green-600">Copied to clipboard!</p>}
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(`https://etherscan.io/tx/${transaction.hash}`, "_blank")}
              className="gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              View on Etherscan
            </Button>
          </div>
        )}

        {transaction.status === "error" && onRetry && (
          <Button onClick={onRetry} className="mt-4">
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
