import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowDownLeft, ArrowUpRight, Plus, Repeat } from "lucide-react"

export function QuickActions() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        <Button className="h-16 flex-col gap-2 bg-transparent" variant="outline">
          <ArrowDownLeft className="h-5 w-5" />
          <span className="text-sm">Deposit</span>
        </Button>
        <Button className="h-16 flex-col gap-2 bg-transparent" variant="outline">
          <ArrowUpRight className="h-5 w-5" />
          <span className="text-sm">Withdraw</span>
        </Button>
        <Button className="h-16 flex-col gap-2 bg-transparent" variant="outline">
          <Plus className="h-5 w-5" />
          <span className="text-sm">New Vault</span>
        </Button>
        <Button className="h-16 flex-col gap-2 bg-transparent" variant="outline">
          <Repeat className="h-5 w-5" />
          <span className="text-sm">Swap</span>
        </Button>
      </div>
    </Card>
  )
}
