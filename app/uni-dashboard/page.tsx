import { SidebarLayout } from "@/components/sidebar-layout"

export default function DashboardPage() {
  return (
    <SidebarLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your dashboard. This is the main overview of your account.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold">Total Capsules</h3>
            <p className="text-2xl font-bold">24</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold">Active Subscriptions</h3>
            <p className="text-2xl font-bold">3</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold">Wallet Balance</h3>
            <p className="text-2xl font-bold">$1,234</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold">Recent Activity</h3>
            <p className="text-2xl font-bold">12</p>
          </div>
        </div>
      </div>
    </SidebarLayout>
  )
}
