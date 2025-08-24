import { SidebarLayout } from "@/components/sidebar-layout"

export default function HistoryPage() {
  return (
    <SidebarLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">History</h1>
          <p className="text-muted-foreground">View your transaction and activity history.</p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <p className="text-center text-muted-foreground">Your history will appear here.</p>
        </div>
      </div>
    </SidebarLayout>
  )
}
