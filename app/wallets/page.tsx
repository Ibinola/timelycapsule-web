import { SidebarLayout } from "@/components/sidebar-layout"

export default function WalletsPage() {
  return (
    <SidebarLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Wallets</h1>
          <p className="text-muted-foreground">Manage your wallets and view balances.</p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <p className="text-center text-muted-foreground">Your wallets will appear here.</p>
        </div>
      </div>
    </SidebarLayout>
  )
}
