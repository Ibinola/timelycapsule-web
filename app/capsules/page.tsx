import { SidebarLayout } from "@/components/sidebar-layout"

export default function CapsulesPage() {
  return (
    <SidebarLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Capsules</h1>
          <p className="text-muted-foreground">Manage your capsules and view their status.</p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <p className="text-center text-muted-foreground">Your capsules will appear here.</p>
        </div>
      </div>
    </SidebarLayout>
  )
}
