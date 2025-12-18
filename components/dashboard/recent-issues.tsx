"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { issues, projects } from "@/lib/data"
import { ArrowRight, AlertCircle, FileEdit, Bug } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const priorityColors = {
  urgent: "bg-destructive/20 text-destructive border-destructive/30",
  high: "bg-warning/20 text-warning border-warning/30",
  medium: "bg-chart-2/20 text-chart-2 border-chart-2/30",
  low: "bg-muted text-muted-foreground border-border",
}

const typeIcons = {
  "non-conformity": AlertCircle,
  modification: FileEdit,
  defect: Bug,
}

export function RecentIssues() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Signalements récents</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/issues" className="flex items-center gap-1 text-primary">
            Voir tout <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {issues.map((issue) => {
          const project = projects.find((p) => p.id === issue.projectId)
          const Icon = typeIcons[issue.type]
          return (
            <div
              key={issue.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 border border-border hover:border-primary/30 transition-colors"
            >
              <div className="p-2 rounded-lg bg-destructive/10">
                <Icon className="w-4 h-4 text-destructive" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-medium text-sm truncate">{issue.title}</h4>
                  <Badge variant="outline" className={priorityColors[issue.priority]}>
                    {issue.priority === "urgent"
                      ? "Urgent"
                      : issue.priority === "high"
                        ? "Haute"
                        : issue.priority === "medium"
                          ? "Moyenne"
                          : "Basse"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{project?.name}</p>
                <p className="text-xs text-muted-foreground">
                  Par {issue.reportedBy} - {new Date(issue.reportedAt).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
