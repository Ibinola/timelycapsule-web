"use client"

import { useState } from "react"

export function useWallet() {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string>("")
  const [provider, setProvider] = useState<string>("")

  const connectWallet = async (walletId: string) => {
    try {
      if (walletId === "metamask" && typeof window !== "undefined" && window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        })
        setAddress(accounts[0])
        setProvider("MetaMask")
        setIsConnected(true)
        return true
      }
      // Simulate other wallet connections
      if (walletId === "walletconnect") {
        // Simulate WalletConnect
        setAddress("0x742d35Cc6634C0532925a3b8D4C9db96590c6C87")
        setProvider("WalletConnect")
        setIsConnected(true)
        return true
      }
      if (walletId === "coinbase") {
        // Simulate Coinbase Wallet
        setAddress("0x8ba1f109551bD432803012645Hac136c22C501e5")
        setProvider("Coinbase Wallet")
        setIsConnected(true)
        return true
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      return false
    }
    return false
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setAddress("")
    setProvider("")
  }

  return {
    isConnected,
    address,
    provider,
    connectWallet,
    disconnectWallet,
  }
}

declare global {
  interface Window {
    ethereum?: any
  }
}
