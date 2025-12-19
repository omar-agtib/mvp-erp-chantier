"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { tools as initialTools, projects, type Tool } from "@/lib/data";
import {
  Plus,
  Search,
  Wrench,
  CheckCircle,
  Clock,
  AlertTriangle,
  ScanLine,
} from "lucide-react";

const statusColors = {
  available: "bg-chart-1/20 text-chart-1 border-chart-1/30",
  "in-use": "bg-chart-2/20 text-chart-2 border-chart-2/30",
  maintenance: "bg-warning/20 text-warning border-warning/30",
};

const statusLabels = {
  available: "Disponible",
  "in-use": "En utilisation",
  maintenance: "Maintenance",
};

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>(initialTools);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isScanDialogOpen, setIsScanDialogOpen] = useState(false);
  const [scanCode, setScanCode] = useState("");
  const [scanResult, setScanResult] = useState<Tool | null>(null);
  const [newTool, setNewTool] = useState({
    name: "",
    code: "",
  });

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || tool.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: tools.length,
    available: tools.filter((t) => t.status === "available").length,
    inUse: tools.filter((t) => t.status === "in-use").length,
    maintenance: tools.filter((t) => t.status === "maintenance").length,
  };

  const handleAddTool = () => {
    const tool: Tool = {
      id: `TL-${String(tools.length + 1).padStart(3, "0")}`,
      name: newTool.name,
      code: newTool.code,
      status: "available",
      lastMaintenance: new Date().toISOString().split("T")[0],
    };
    setTools([...tools, tool]);
    setNewTool({ name: "", code: "" });
    setIsAddDialogOpen(false);
  };

  const handleScanTool = () => {
    const tool = tools.find(
      (t) => t.code.toLowerCase() === scanCode.toLowerCase()
    );
    setScanResult(tool || null);
  };

  const handleToggleStatus = (toolId: string) => {
    setTools(
      tools.map((t) => {
        if (t.id === toolId) {
          const newStatus: Tool["status"] =
            t.status === "available" ? "in-use" : "available";
          return {
            ...t,
            status: newStatus,
            assignedTo:
              newStatus === "in-use" ? "Utilisateur actuel" : undefined,
          };
        }
        return t;
      })
    );
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">Outillage</h1>
              <p className="text-muted-foreground">
                Gérez et suivez vos outils et équipements
              </p>
            </div>
            <div className="flex flex-col-reverse md:flex-row gap-2">
              <Dialog
                open={isScanDialogOpen}
                onOpenChange={setIsScanDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <ScanLine className="w-4 h-4" /> Scanner Outil
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border">
                  <DialogHeader>
                    <DialogTitle>Scanner un outil</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>Code de l'outil</Label>
                      <Input
                        placeholder="Scannez ou entrez le code..."
                        value={scanCode}
                        onChange={(e) => setScanCode(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleScanTool()}
                        className="bg-secondary border-border font-mono"
                        autoFocus
                      />
                    </div>
                    <Button
                      onClick={handleScanTool}
                      className="w-full bg-primary text-primary-foreground"
                    >
                      Rechercher
                    </Button>

                    {scanResult && (
                      <Card className="bg-secondary/50 border-border">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium">{scanResult.name}</h4>
                              <p className="text-sm text-muted-foreground font-mono">
                                {scanResult.code}
                              </p>
                              {scanResult.assignedTo && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  Utilisé par: {scanResult.assignedTo}
                                </p>
                              )}
                            </div>
                            <Badge
                              variant="outline"
                              className={statusColors[scanResult.status]}
                            >
                              {statusLabels[scanResult.status]}
                            </Badge>
                          </div>
                          <Button
                            onClick={() => handleToggleStatus(scanResult.id)}
                            className="w-full mt-4"
                            variant={
                              scanResult.status === "available"
                                ? "default"
                                : "outline"
                            }
                          >
                            {scanResult.status === "available"
                              ? "Prendre l'outil"
                              : "Retourner l'outil"}
                          </Button>
                        </CardContent>
                      </Card>
                    )}

                    {scanCode && !scanResult && (
                      <p className="text-sm text-destructive text-center">
                        Outil non trouvé
                      </p>
                    )}

                    <div className="border-t border-border pt-4">
                      <p className="text-xs text-muted-foreground mb-2">
                        Codes disponibles pour test:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {tools.slice(0, 5).map((t) => (
                          <Badge
                            key={t.id}
                            variant="outline"
                            className="cursor-pointer hover:bg-secondary"
                            onClick={() => setScanCode(t.code)}
                          >
                            {t.code}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" /> Ajouter Outil
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border">
                  <DialogHeader>
                    <DialogTitle>Ajouter un outil</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>Nom de l'outil</Label>
                      <Input
                        placeholder="Ex: Perceuse Hilti"
                        value={newTool.name}
                        onChange={(e) =>
                          setNewTool({ ...newTool, name: e.target.value })
                        }
                        className="bg-secondary border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Code / Code-barres</Label>
                      <Input
                        placeholder="Ex: PER-HIL-001"
                        value={newTool.code}
                        onChange={(e) =>
                          setNewTool({ ...newTool, code: e.target.value })
                        }
                        className="bg-secondary border-border"
                      />
                    </div>
                    <Button
                      onClick={handleAddTool}
                      className="w-full bg-primary text-primary-foreground"
                    >
                      Ajouter
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-chart-2/10">
                    <Wrench className="w-5 h-5 text-chart-2" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Outils
                    </p>
                    <p className="text-2xl font-bold">{stats.total}</p>
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
                    <p className="text-sm text-muted-foreground">Disponibles</p>
                    <p className="text-2xl font-bold">{stats.available}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-chart-2/10">
                    <Clock className="w-5 h-5 text-chart-2" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      En utilisation
                    </p>
                    <p className="text-2xl font-bold">{stats.inUse}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-warning/10">
                    <AlertTriangle className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Maintenance</p>
                    <p className="text-2xl font-bold">{stats.maintenance}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom ou code..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-secondary border-border"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-45 bg-secondary border-border">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="available">Disponible</SelectItem>
                    <SelectItem value="in-use">En utilisation</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead>Outil</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Assigné à</TableHead>
                      <TableHead>Projet</TableHead>
                      <TableHead>Dernière maintenance</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTools.map((tool) => {
                      const project = projects.find(
                        (p) => p.id === tool.projectId
                      );
                      return (
                        <TableRow key={tool.id} className="border-border">
                          <TableCell className="font-medium">
                            {tool.name}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {tool.code}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={statusColors[tool.status]}
                            >
                              {statusLabels[tool.status]}
                            </Badge>
                          </TableCell>
                          <TableCell>{tool.assignedTo || "-"}</TableCell>
                          <TableCell className="max-w-37.5 truncate">
                            {project?.name || "-"}
                          </TableCell>
                          <TableCell>
                            {new Date(tool.lastMaintenance).toLocaleDateString(
                              "fr-FR"
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleStatus(tool.id)}
                              disabled={tool.status === "maintenance"}
                            >
                              {tool.status === "available"
                                ? "Prendre"
                                : tool.status === "in-use"
                                ? "Retourner"
                                : "-"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              {filteredTools.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Aucun outil trouvé
                </p>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
