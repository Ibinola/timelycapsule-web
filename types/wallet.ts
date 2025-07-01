export interface WalletProvider {
    name: string
    icon: string
    id: string
  }
  
  export interface ClaimData {
    amount: string
    token: string
    recipient: string
    deadline: number
    claimed: boolean
  }
  
  export interface TransactionState {
    status: "idle" | "pending" | "success" | "error"
    hash?: string
    error?: string
  }
  