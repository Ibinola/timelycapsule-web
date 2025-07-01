"use client"

import { Card } from "@/components/ui/card"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { name: "Bitcoin", value: 45, color: "#f7931a" },
  { name: "Ethereum", value: 30, color: "#627eea" },
  { name: "USDT", value: 15, color: "#26a17b" },
  { name: "Others", value: 10, color: "#8b5cf6" },
]

export function PortfolioAllocation() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Portfolio Allocation</h3>
      <div className="flex items-center gap-6">
        <div className="h-[200px] w-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="font-medium">{payload[0].name}</div>
                        <div className="text-sm text-muted-foreground">{payload[0].value}%</div>
                      </div>
                    )
                  }
                  return null
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-3">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
              <div className="flex-1">
                <div className="text-sm font-medium">{item.name}</div>
                <div className="text-xs text-muted-foreground">{item.value}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
