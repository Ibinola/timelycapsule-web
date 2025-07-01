"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, LogOut, User } from "lucide-react";
import { useWallet } from "../hooks/useWallet";
import { TransactionStatus } from "../components/transaction-status";
import { ClaimButton } from "../components/claim-button";
import type { ClaimData, TransactionState } from "../types/wallet";
import { WalletConnectionModal } from "@/components/wallet-connection-modal";
import { CountdownTimer } from "@/components/countdown-timer";
import { GiftPresentation } from "@/components/gift-presentation";

// Mock data - in real app this would come from props or API
const mockClaimData: ClaimData = {
  amount: "2.5",
  token: "ETH",
  recipient: "",
  deadline: new Date().getTime() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
  claimed: false,
};

export default function FundClaimingInterface() {
  const { isConnected, address, provider, connectWallet, disconnectWallet } =
    useWallet();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [claimData, setClaimData] = useState<ClaimData>(mockClaimData);
  const [transaction, setTransaction] = useState<TransactionState>({
    status: "idle",
  });

  const handleConnect = async (walletId: string) => {
    const success = await connectWallet(walletId);
    return success;
  };

  const handleClaim = async () => {
    if (!isConnected) return;

    setTransaction({ status: "pending" });

    // Simulate transaction processing
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Simulate random success/failure for demo
      const success = Math.random() > 0.3;

      if (success) {
        const mockTxHash = "0x" + Math.random().toString(16).substr(2, 64);
        setTransaction({
          status: "success",
          hash: mockTxHash,
        });
        setClaimData((prev) => ({ ...prev, claimed: true }));
      } else {
        setTransaction({
          status: "error",
          error: "Transaction failed. Please try again.",
        });
      }
    } catch (error) {
      setTransaction({
        status: "error",
        error: "Network error. Please check your connection.",
      });
    }
  };

  const handleRetry = () => {
    setTransaction({ status: "idle" });
  };

  const isExpired = new Date().getTime() > claimData.deadline;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Secure Fund Claiming</CardTitle>
              </div>
              {isConnected && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="gap-1">
                    <User className="h-3 w-3" />
                    {provider}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={disconnectWallet}
                    className="h-8 px-2"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            {isConnected && (
              <div className="text-sm text-muted-foreground font-mono">
                Connected: {address.slice(0, 6)}...{address.slice(-4)}
              </div>
            )}
          </CardHeader>
        </Card>

        {/* Gift Presentation */}
        <GiftPresentation
          amount={claimData.amount}
          token={claimData.token}
          claimed={claimData.claimed}
        />

        {/* Countdown Timer */}
        <CountdownTimer deadline={claimData.deadline} />

        {/* Transaction Status */}
        {transaction.status !== "idle" && (
          <TransactionStatus
            transaction={transaction}
            onRetry={transaction.status === "error" ? handleRetry : undefined}
          />
        )}

        {/* Claim Section */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Ready to Claim?</h3>
              <p className="text-sm text-muted-foreground">
                {!isConnected
                  ? "Connect your wallet to securely claim your reward"
                  : "Click the button below to initiate the claiming process"}
              </p>
            </div>

            <Separator />

            <ClaimButton
              isConnected={isConnected}
              isExpired={isExpired}
              isClaimed={claimData.claimed}
              transaction={transaction}
              onConnect={() => setShowWalletModal(true)}
              onClaim={handleClaim}
            />

            {isConnected && !claimData.claimed && !isExpired && (
              <div className="text-xs text-center text-muted-foreground space-y-1">
                <p>
                  🔒 Your transaction will be secured by blockchain technology
                </p>
                <p>⚡ Gas fees will be calculated automatically</p>
                <p>✅ Funds will be transferred directly to your wallet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="border-muted">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Security Notice</p>
                <p className="text-xs text-muted-foreground">
                  This is a secure claiming interface. Never share your private
                  keys or seed phrases. Always verify the contract address and
                  transaction details before confirming.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wallet Connection Modal */}
      <WalletConnectionModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onConnect={handleConnect}
      />
    </div>
  );
}
