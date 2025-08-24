import { SidebarLayout } from "@/components/sidebar-layout"

export default function SubscriptionsPage() {
  return (
    <SidebarLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Subscriptions</h1>
          <p className="text-muted-foreground">View and manage your active subscriptions.</p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <p className="text-center text-muted-foreground">Your subscriptions will appear here.</p>
        </div>
      </div>
    </SidebarLayout>
  )
}
