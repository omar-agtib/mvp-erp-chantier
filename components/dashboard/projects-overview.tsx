"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { projects } from "@/lib/data"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const statusColors = {
  active: "bg-chart-1/20 text-chart-1 border-chart-1/30",
  completed: "bg-muted text-muted-foreground border-border",
  "on-hold": "bg-warning/20 text-warning border-warning/30",
}

const statusLabels = {
  active: "En cours",
  completed: "Terminé",
  "on-hold": "En pause",
}

export function ProjectsOverview() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Projets en cours</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/projects" className="flex items-center gap-1 text-primary">
            Voir tout <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {projects.slice(0, 3).map((project) => (
          <div
            key={project.id}
            className="p-4 rounded-lg bg-secondary/50 border border-border hover:border-primary/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium">{project.name}</h4>
                <p className="text-sm text-muted-foreground">{project.client}</p>
              </div>
              <Badge variant="outline" className={statusColors[project.status]}>
                {statusLabels[project.status]}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progression</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2" />
            </div>
            <div className="flex items-center justify-between mt-3 text-sm">
              <span className="text-muted-foreground">
                Budget: {(project.spent / 1000).toFixed(0)}K€ / {(project.budget / 1000).toFixed(0)}K€
              </span>
              <span className="text-muted-foreground">
                Échéance: {new Date(project.endDate).toLocaleDateString("fr-FR")}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
