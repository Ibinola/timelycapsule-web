import { SidebarLayout } from "@/components/sidebar-layout"
import { CapsuleDashboard } from "@/components/capsule-dashboard"
import { CapsuleUnlockTrigger } from "@/components/capsule-unlock-trigger"
import { NotificationSystem } from "@/components/notification-system"

export default function CapsulesPage() {
  return (
    <SidebarLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Capsules</h1>
            <p className="text-muted-foreground">Manage your capsules and view their status.</p>
          </div>
          <NotificationSystem />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CapsuleDashboard />
          </div>
          <div className="lg:col-span-1">
            <CapsuleUnlockTrigger />
          </div>
        </div>
      </div>
    </SidebarLayout>
  )
}
