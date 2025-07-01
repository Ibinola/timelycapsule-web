import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MetricsCard } from "@/components/metrics-card"
import { StatsChart } from "@/components/stats-chart"
import { VaultTable } from "@/components/vault-table"
import { PortfolioAllocation } from "@/components/portfolio-allocation"
import { NotificationBell } from "@/components/notification-bell"
import { QuickActions } from "@/components/quick-actions"
import { BarChart3, ChevronDown, Globe, Home, LayoutDashboard, LifeBuoy, Settings, Wallet, Plus } from "lucide-react"

export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="grid lg:grid-cols-[280px_1fr]">
        <aside className="border-r bg-background/50 backdrop-blur">
          <div className="flex h-16 items-center gap-2 border-b px-6">
            <Wallet className="h-6 w-6" />
            <span className="font-bold">Timely Capsule</span>
          </div>
          <div className="px-4 py-4">
            <Input placeholder="Search" className="bg-background/50" />
          </div>
          <nav className="space-y-2 px-2">
            <Button variant="ghost" className="w-full justify-start gap-2 bg-primary/10 text-primary">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <BarChart3 className="h-4 w-4" />
              Statistics & Income
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Globe className="h-4 w-4" />
              Market
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Home className="h-4 w-4" />
              Funding
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Wallet className="h-4 w-4" />
              Yield Vaults
              <ChevronDown className="ml-auto h-4 w-4" />
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <LifeBuoy className="h-4 w-4" />
              Support
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </nav>

          {/* User Profile Section */}
          <div className="absolute bottom-4 left-4 right-4">
            <Card className="p-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">John Doe</div>
                  <div className="text-xs text-muted-foreground truncate">john@example.com</div>
                </div>
              </div>
            </Card>
          </div>
        </aside>
        <main className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">Overview</h1>
              <div className="text-sm text-muted-foreground">Aug 13, 2023 - Aug 18, 2023</div>
            </div>
            <div className="flex items-center gap-3">
              <NotificationBell />
              <Button variant="outline" className="gap-2 bg-transparent">
                Ethereum Network
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <MetricsCard
              title="Your Balance"
              value="$74,892"
              change={{ value: "$1,340", percentage: "-2.1%", isPositive: false }}
            />
            <MetricsCard
              title="Your Deposits"
              value="$54,892"
              change={{ value: "$1,340", percentage: "+13.2%", isPositive: true }}
            />
            <MetricsCard
              title="Accrued Yield"
              value="$20,892"
              change={{ value: "$1,340", percentage: "+1.2%", isPositive: true }}
            />
          </div>

          <div className="grid gap-6 mt-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">General Statistics</h2>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost">
                      Today
                    </Button>
                    <Button size="sm" variant="ghost">
                      Last week
                    </Button>
                    <Button size="sm" variant="ghost">
                      Last month
                    </Button>
                    <Button size="sm" variant="ghost">
                      Last 6 month
                    </Button>
                    <Button size="sm" variant="ghost">
                      Year
                    </Button>
                  </div>
                </div>
                <StatsChart />
              </Card>
            </div>
            <div className="space-y-6">
              <PortfolioAllocation />
              <QuickActions />
            </div>
          </div>

          <div className="mt-6">
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Your Vaults</h2>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Vault
                </Button>
              </div>
              <VaultTable />
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
