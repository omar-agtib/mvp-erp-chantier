"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { issues as initialIssues, projects, type Issue } from "@/lib/data"
import {
  Plus,
  Search,
  AlertTriangle,
  AlertCircle,
  FileEdit,
  Bug,
  Camera,
  X,
  Clock,
  CheckCircle,
  Circle,
} from "lucide-react"

const priorityColors = {
  urgent: "bg-destructive/20 text-destructive border-destructive/30",
  high: "bg-warning/20 text-warning border-warning/30",
  medium: "bg-chart-2/20 text-chart-2 border-chart-2/30",
  low: "bg-muted text-muted-foreground border-border",
}

const priorityLabels = {
  urgent: "Urgent",
  high: "Haute",
  medium: "Moyenne",
  low: "Basse",
}

const statusColors = {
  open: "bg-destructive/20 text-destructive border-destructive/30",
  "in-progress": "bg-warning/20 text-warning border-warning/30",
  resolved: "bg-chart-1/20 text-chart-1 border-chart-1/30",
}

const statusLabels = {
  open: "Ouvert",
  "in-progress": "En cours",
  resolved: "Résolu",
}

const typeIcons = {
  "non-conformity": AlertCircle,
  modification: FileEdit,
  defect: Bug,
}

const typeLabels = {
  "non-conformity": "Non-conformité",
  modification: "Modification",
  defect: "Défaut",
}

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>(initialIssues)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [newIssue, setNewIssue] = useState({
    title: "",
    description: "",
    projectId: "",
    priority: "medium" as Issue["priority"],
    type: "non-conformity" as Issue["type"],
    reportedBy: "Jean Dupont",
  })

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || issue.status === statusFilter
    const matchesPriority = priorityFilter === "all" || issue.priority === priorityFilter
    const matchesType = typeFilter === "all" || issue.type === typeFilter
    return matchesSearch && matchesStatus && matchesPriority && matchesType
  })

  const stats = {
    total: issues.length,
    open: issues.filter((i) => i.status === "open").length,
    inProgress: issues.filter((i) => i.status === "in-progress").length,
    resolved: issues.filter((i) => i.status === "resolved").length,
    urgent: issues.filter((i) => i.priority === "urgent" && i.status !== "resolved").length,
  }

  const handleCreateIssue = () => {
    const issue: Issue = {
      id: `ISS-${String(issues.length + 1).padStart(3, "0")}`,
      title: newIssue.title,
      description: newIssue.description,
      projectId: newIssue.projectId,
      priority: newIssue.priority,
      status: "open",
      type: newIssue.type,
      reportedBy: newIssue.reportedBy,
      reportedAt: new Date().toISOString(),
      imageUrl: uploadedImage || undefined,
    }
    setIssues([issue, ...issues])
    setNewIssue({
      title: "",
      description: "",
      projectId: "",
      priority: "medium",
      type: "non-conformity",
      reportedBy: "Jean Dupont",
    })
    setUploadedImage(null)
    setIsCreateDialogOpen(false)
  }

  const handleStatusChange = (issueId: string, newStatus: Issue["status"]) => {
    setIssues(issues.map((i) => (i.id === issueId ? { ...i, status: newStatus } : i)))
    if (selectedIssue?.id === issueId) {
      setSelectedIssue({ ...selectedIssue, status: newStatus })
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">Signalements</h1>
              <p className="text-muted-foreground">Non-conformités, modifications et défauts sur chantier</p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" /> Nouveau Signalement
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border max-w-lg">
                <DialogHeader>
                  <DialogTitle>Créer un signalement</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4 max-h-[70vh] overflow-y-auto pr-2">
                  <div className="space-y-2">
                    <Label>Titre</Label>
                    <Input
                      placeholder="Décrivez brièvement le problème..."
                      value={newIssue.title}
                      onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
                      className="bg-secondary border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Description détaillée</Label>
                    <Textarea
                      placeholder="Décrivez le problème en détail, l'emplacement exact, les impacts potentiels..."
                      value={newIssue.description}
                      onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
                      className="bg-secondary border-border min-h-[100px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select
                        value={newIssue.type}
                        onValueChange={(value) => setNewIssue({ ...newIssue, type: value as Issue["type"] })}
                      >
                        <SelectTrigger className="bg-secondary border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="non-conformity">Non-conformité</SelectItem>
                          <SelectItem value="modification">Modification plan</SelectItem>
                          <SelectItem value="defect">Défaut</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Priorité</Label>
                      <Select
                        value={newIssue.priority}
                        onValueChange={(value) => setNewIssue({ ...newIssue, priority: value as Issue["priority"] })}
                      >
                        <SelectTrigger className="bg-secondary border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="urgent">Urgent</SelectItem>
                          <SelectItem value="high">Haute</SelectItem>
                          <SelectItem value="medium">Moyenne</SelectItem>
                          <SelectItem value="low">Basse</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Projet</Label>
                    <Select
                      value={newIssue.projectId}
                      onValueChange={(value) => setNewIssue({ ...newIssue, projectId: value })}
                    >
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue placeholder="Sélectionner un projet" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Photo / Preuve</Label>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    {uploadedImage ? (
                      <div className="relative">
                        <img
                          src={uploadedImage || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-40 object-cover rounded-lg border border-border"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8"
                          onClick={() => setUploadedImage(null)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full h-24 border-dashed bg-transparent"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Camera className="w-6 h-6 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Cliquez pour ajouter une photo</span>
                        </div>
                      </Button>
                    )}
                  </div>

                  <Button onClick={handleCreateIssue} className="w-full bg-primary text-primary-foreground">
                    Créer le signalement
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-chart-2/10">
                    <AlertTriangle className="w-5 h-5 text-chart-2" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-destructive/10">
                    <Circle className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ouverts</p>
                    <p className="text-2xl font-bold">{stats.open}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-warning/10">
                    <Clock className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">En cours</p>
                    <p className="text-2xl font-bold">{stats.inProgress}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-chart-1/10">
                    <CheckCircle className="w-5 h-5 text-chart-1" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Résolus</p>
                    <p className="text-2xl font-bold">{stats.resolved}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border border-destructive/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-destructive/10">
                    <AlertCircle className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Urgents</p>
                    <p className="text-2xl font-bold text-destructive">{stats.urgent}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card border-border mb-6">
            <CardHeader className="pb-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un signalement..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-secondary border-border"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px] bg-secondary border-border">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous statuts</SelectItem>
                      <SelectItem value="open">Ouvert</SelectItem>
                      <SelectItem value="in-progress">En cours</SelectItem>
                      <SelectItem value="resolved">Résolu</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-[140px] bg-secondary border-border">
                      <SelectValue placeholder="Priorité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes priorités</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="high">Haute</SelectItem>
                      <SelectItem value="medium">Moyenne</SelectItem>
                      <SelectItem value="low">Basse</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[160px] bg-secondary border-border">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous types</SelectItem>
                      <SelectItem value="non-conformity">Non-conformité</SelectItem>
                      <SelectItem value="modification">Modification</SelectItem>
                      <SelectItem value="defect">Défaut</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredIssues.map((issue) => {
                  const project = projects.find((p) => p.id === issue.projectId)
                  const Icon = typeIcons[issue.type]
                  return (
                    <div
                      key={issue.id}
                      className="p-4 rounded-lg bg-secondary/50 border border-border hover:border-primary/30 transition-colors cursor-pointer"
                      onClick={() => setSelectedIssue(issue)}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`p-2.5 rounded-lg ${
                            issue.priority === "urgent"
                              ? "bg-destructive/10"
                              : issue.priority === "high"
                                ? "bg-warning/10"
                                : "bg-muted"
                          }`}
                        >
                          <Icon
                            className={`w-5 h-5 ${
                              issue.priority === "urgent"
                                ? "text-destructive"
                                : issue.priority === "high"
                                  ? "text-warning"
                                  : "text-muted-foreground"
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <h4 className="font-medium">{issue.title}</h4>
                              <p className="text-sm text-muted-foreground">{project?.name || "Projet inconnu"}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Badge variant="outline" className={priorityColors[issue.priority]}>
                                {priorityLabels[issue.priority]}
                              </Badge>
                              <Badge variant="outline" className={statusColors[issue.status]}>
                                {statusLabels[issue.status]}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{issue.description}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>
                              Par {issue.reportedBy} - {new Date(issue.reportedAt).toLocaleDateString("fr-FR")}
                            </span>
                            <span className="flex items-center gap-1">
                              <Badge variant="outline" className="text-xs">
                                {typeLabels[issue.type]}
                              </Badge>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
                {filteredIssues.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">Aucun signalement trouvé</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Issue Detail Dialog */}
          <Dialog open={!!selectedIssue} onOpenChange={() => setSelectedIssue(null)}>
            <DialogContent className="bg-card border-border max-w-2xl">
              {selectedIssue && (
                <>
                  <DialogHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <DialogTitle className="text-xl">{selectedIssue.title}</DialogTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {projects.find((p) => p.id === selectedIssue.projectId)?.name}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className={priorityColors[selectedIssue.priority]}>
                          {priorityLabels[selectedIssue.priority]}
                        </Badge>
                        <Badge variant="outline" className={statusColors[selectedIssue.status]}>
                          {statusLabels[selectedIssue.status]}
                        </Badge>
                      </div>
                    </div>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Description</h4>
                      <p className="text-sm text-muted-foreground">{selectedIssue.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-border">
                      <div>
                        <p className="text-xs text-muted-foreground">Type</p>
                        <p className="text-sm font-medium">{typeLabels[selectedIssue.type]}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Signalé par</p>
                        <p className="text-sm font-medium">{selectedIssue.reportedBy}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Date</p>
                        <p className="text-sm font-medium">
                          {new Date(selectedIssue.reportedAt).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">ID</p>
                        <p className="text-sm font-medium font-mono">{selectedIssue.id}</p>
                      </div>
                    </div>

                    {selectedIssue.imageUrl && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Photo jointe</h4>
                        <img
                          src={selectedIssue.imageUrl || "/placeholder.svg"}
                          alt="Issue"
                          className="w-full h-48 object-cover rounded-lg border border-border"
                        />
                      </div>
                    )}

                    <div>
                      <h4 className="text-sm font-medium mb-2">Changer le statut</h4>
                      <div className="flex gap-2">
                        <Button
                          variant={selectedIssue.status === "open" ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleStatusChange(selectedIssue.id, "open")}
                          className={
                            selectedIssue.status === "open" ? "bg-destructive text-destructive-foreground" : ""
                          }
                        >
                          Ouvert
                        </Button>
                        <Button
                          variant={selectedIssue.status === "in-progress" ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleStatusChange(selectedIssue.id, "in-progress")}
                          className={selectedIssue.status === "in-progress" ? "bg-warning text-warning-foreground" : ""}
                        >
                          En cours
                        </Button>
                        <Button
                          variant={selectedIssue.status === "resolved" ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleStatusChange(selectedIssue.id, "resolved")}
                          className={selectedIssue.status === "resolved" ? "bg-chart-1 text-primary-foreground" : ""}
                        >
                          Résolu
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  )
}
