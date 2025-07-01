"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Wallet, ExternalLink } from "lucide-react"
import type { WalletProvider } from "../types/wallet"

interface WalletConnectionModalProps {
  isOpen: boolean
  onClose: () => void
  onConnect: (walletId: string) => Promise<boolean>
}

const walletProviders: WalletProvider[] = [
  {
    name: "MetaMask",
    icon: "🦊",
    id: "metamask",
  },
  {
    name: "WalletConnect",
    icon: "🔗",
    id: "walletconnect",
  },
  {
    name: "Coinbase Wallet",
    icon: "🔵",
    id: "coinbase",
  },
  {
    name: "Trust Wallet",
    icon: "🛡️",
    id: "trust",
  },
]

export function WalletConnectionModal({ isOpen, onClose, onConnect }: WalletConnectionModalProps) {
  const [connecting, setConnecting] = useState<string | null>(null)

  const handleConnect = async (walletId: string) => {
    setConnecting(walletId)
    try {
      const success = await onConnect(walletId)
      if (success) {
        onClose()
      }
    } catch (error) {
      console.error("Connection failed:", error)
    } finally {
      setConnecting(null)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Connect Your Wallet
          </DialogTitle>
          <DialogDescription>Choose a wallet to connect and claim your funds securely.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-4">
          {walletProviders.map((wallet) => (
            <Card key={wallet.id} className="cursor-pointer hover:bg-accent transition-colors">
              <CardContent className="p-4">
                <Button
                  variant="ghost"
                  className="w-full justify-start h-auto p-0"
                  onClick={() => handleConnect(wallet.id)}
                  disabled={connecting !== null}
                >
                  <div className="flex items-center gap-3 w-full">
                    <span className="text-2xl">{wallet.icon}</span>
                    <span className="font-medium">{wallet.name}</span>
                    {connecting === wallet.id && <Loader2 className="h-4 w-4 animate-spin ml-auto" />}
                    {connecting !== wallet.id && <ExternalLink className="h-4 w-4 ml-auto opacity-50" />}
                  </div>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-xs text-muted-foreground text-center">
          By connecting a wallet, you agree to our Terms of Service and Privacy Policy.
        </div>
      </DialogContent>
    </Dialog>
  )
}
