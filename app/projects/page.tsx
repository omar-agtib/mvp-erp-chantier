"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { projects as initialProjects, type Project } from "@/lib/data"
import { Plus, Search, Calendar, Euro, Users, ArrowUpRight } from "lucide-react"
import Link from "next/link"

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

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newProject, setNewProject] = useState({
    name: "",
    client: "",
    budget: "",
    startDate: "",
    endDate: "",
  })

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleCreateProject = () => {
    const project: Project = {
      id: `PRJ-${String(projects.length + 1).padStart(3, "0")}`,
      name: newProject.name,
      client: newProject.client,
      status: "active",
      progress: 0,
      startDate: newProject.startDate,
      endDate: newProject.endDate,
      budget: Number(newProject.budget),
      spent: 0,
    }
    setProjects([...projects, project])
    setNewProject({ name: "", client: "", budget: "", startDate: "", endDate: "" })
    setIsDialogOpen(false)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">Projets</h1>
              <p className="text-muted-foreground">Gérez et suivez vos projets de construction</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" /> Nouveau Projet
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle>Créer un nouveau projet</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Nom du projet</Label>
                    <Input
                      placeholder="Ex: Rénovation Tour Eiffel"
                      value={newProject.name}
                      onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Client</Label>
                    <Input
                      placeholder="Nom du client"
                      value={newProject.client}
                      onChange={(e) => setNewProject({ ...newProject, client: e.target.value })}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Budget (€)</Label>
                    <Input
                      type="number"
                      placeholder="1000000"
                      value={newProject.budget}
                      onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date de début</Label>
                      <Input
                        type="date"
                        value={newProject.startDate}
                        onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                        className="bg-secondary border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date de fin</Label>
                      <Input
                        type="date"
                        value={newProject.endDate}
                        onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                        className="bg-secondary border-border"
                      />
                    </div>
                  </div>
                  <Button onClick={handleCreateProject} className="w-full bg-primary text-primary-foreground">
                    Créer le projet
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un projet..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-secondary border-border"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-secondary border-border">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">En cours</SelectItem>
                <SelectItem value="on-hold">En pause</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="bg-card border-border hover:border-primary/30 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{project.client}</p>
                    </div>
                    <Badge variant="outline" className={statusColors[project.status]}>
                      {statusLabels[project.status]}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progression</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Euro className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Budget:</span>
                      <span className="font-medium">{(project.budget / 1000000).toFixed(1)}M€</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">
                        {new Date(project.endDate).toLocaleDateString("fr-FR", {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>ID: {project.id}</span>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/projects/${project.id}`} className="flex items-center gap-1 text-primary">
                        Détails <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucun projet trouvé</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
