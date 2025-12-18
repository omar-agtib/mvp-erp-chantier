"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Lun", deliveries: 12, issues: 2, scans: 45 },
  { name: "Mar", deliveries: 8, issues: 1, scans: 38 },
  { name: "Mer", deliveries: 15, issues: 3, scans: 52 },
  { name: "Jeu", deliveries: 10, issues: 0, scans: 41 },
  { name: "Ven", deliveries: 18, issues: 2, scans: 67 },
  { name: "Sam", deliveries: 5, issues: 1, scans: 23 },
  { name: "Dim", deliveries: 2, issues: 0, scans: 8 },
]

export function ActivityChart() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Activité hebdomadaire</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorDeliveries" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.65 0.18 165)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.65 0.18 165)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.6 0.15 250)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.6 0.15 250)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.01 260)" />
              <XAxis dataKey="name" stroke="oklch(0.6 0.01 260)" fontSize={12} />
              <YAxis stroke="oklch(0.6 0.01 260)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(0.16 0.01 260)",
                  border: "1px solid oklch(0.25 0.01 260)",
                  borderRadius: "8px",
                  color: "oklch(0.95 0.01 260)",
                }}
              />
              <Area
                type="monotone"
                dataKey="scans"
                stroke="oklch(0.6 0.15 250)"
                fillOpacity={1}
                fill="url(#colorScans)"
                name="Scans"
              />
              <Area
                type="monotone"
                dataKey="deliveries"
                stroke="oklch(0.65 0.18 165)"
                fillOpacity={1}
                fill="url(#colorDeliveries)"
                name="Livraisons"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-chart-1" />
            <span className="text-sm text-muted-foreground">Livraisons</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-chart-2" />
            <span className="text-sm text-muted-foreground">Scans</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
