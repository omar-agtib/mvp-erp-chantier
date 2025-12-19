"use client";

import { use } from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { projects, products, issues, invoices, tools } from "@/lib/data";
import {
  ArrowLeft,
  Calendar,
  Euro,
  Package,
  AlertTriangle,
  FileText,
  Wrench,
} from "lucide-react";
import Link from "next/link";

const statusColors = {
  active: "bg-chart-1/20 text-chart-1 border-chart-1/30",
  completed: "bg-muted text-muted-foreground border-border",
  "on-hold": "bg-warning/20 text-warning border-warning/30",
};

const statusLabels = {
  active: "En cours",
  completed: "Terminé",
  "on-hold": "En pause",
};

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const project = projects.find((p) => p.id === id);
  const projectProducts = products.filter((p) => p.projectId === id);
  const projectIssues = issues.filter((i) => i.projectId === id);
  const projectInvoices = invoices.filter((i) => i.projectId === id);
  const projectTools = tools.filter((t) => t.projectId === id);

  if (!project) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Projet non trouvé</h2>
              <Button asChild className="mt-4">
                <Link href="/projects">Retour aux projets</Link>
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/projects" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Retour aux projets
              </Link>
            </Button>

            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold">{project.name}</h1>
                  <Badge
                    variant="outline"
                    className={statusColors[project.status]}
                  >
                    {statusLabels[project.status]}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{project.client}</p>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary">Modifier</Button>
                <Button className="bg-primary text-primary-foreground">
                  Exporter Rapport
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-chart-1/10">
                    <Euro className="w-5 h-5 text-chart-1" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p className="text-xl font-bold">
                      {(project.budget / 1000000).toFixed(2)}M€
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Dépensé: {(project.spent / 1000000).toFixed(2)}M€
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-chart-2/10">
                    <Calendar className="w-5 h-5 text-chart-2" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Échéance</p>
                    <p className="text-xl font-bold">
                      {new Date(project.endDate).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Début:{" "}
                      {new Date(project.startDate).toLocaleDateString("fr-FR")}
                    </p>
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
                    <p className="text-sm text-muted-foreground">
                      Signalements
                    </p>
                    <p className="text-xl font-bold">{projectIssues.length}</p>
                    <p className="text-xs text-muted-foreground">
                      {projectIssues.filter((i) => i.status === "open").length}{" "}
                      ouverts
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-chart-1/10">
                    <Package className="w-5 h-5 text-chart-1" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Produits</p>
                    <p className="text-xl font-bold">
                      {projectProducts.length}
                    </p>
                    <p className="text-xs text-muted-foreground">En stock</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card border-border mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progression globale</span>
                <span className="text-sm font-bold">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-3" />
            </CardContent>
          </Card>

          <Tabs defaultValue="products" className="space-y-4">
            <TabsList className="bg-secondary">
              <TabsTrigger value="products" className="flex items-center gap-2">
                <Package className="w-4 h-4" /> Produits (
                {projectProducts.length})
              </TabsTrigger>
              <TabsTrigger value="tools" className="flex items-center gap-2">
                <Wrench className="w-4 h-4" /> Outillage ({projectTools.length})
              </TabsTrigger>
              <TabsTrigger value="issues" className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Signalements (
                {projectIssues.length})
              </TabsTrigger>
              <TabsTrigger value="invoices" className="flex items-center gap-2">
                <FileText className="w-4 h-4" /> Factures (
                {projectInvoices.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Produits du projet</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {projectProducts.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        Aucun produit associé
                      </p>
                    ) : (
                      projectProducts.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border"
                        >
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              SKU: {product.sku} | Emplacement:{" "}
                              {product.location}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {product.quantity} unités
                            </p>
                            <Badge
                              variant="outline"
                              className={
                                product.status === "in-stock"
                                  ? "bg-chart-1/20 text-chart-1 border-chart-1/30"
                                  : product.status === "low-stock"
                                  ? "bg-warning/20 text-warning border-warning/30"
                                  : "bg-destructive/20 text-destructive border-destructive/30"
                              }
                            >
                              {product.status === "in-stock"
                                ? "En stock"
                                : product.status === "low-stock"
                                ? "Stock bas"
                                : "Rupture"}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tools">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Outillage assigné</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {projectTools.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        Aucun outil assigné
                      </p>
                    ) : (
                      projectTools.map((tool) => (
                        <div
                          key={tool.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border"
                        >
                          <div>
                            <p className="font-medium">{tool.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Code: {tool.code} | Utilisateur:{" "}
                              {tool.assignedTo || "Non assigné"}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              tool.status === "available"
                                ? "bg-chart-1/20 text-chart-1 border-chart-1/30"
                                : tool.status === "in-use"
                                ? "bg-chart-2/20 text-chart-2 border-chart-2/30"
                                : "bg-warning/20 text-warning border-warning/30"
                            }
                          >
                            {tool.status === "available"
                              ? "Disponible"
                              : tool.status === "in-use"
                              ? "En utilisation"
                              : "Maintenance"}
                          </Badge>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="issues">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Signalements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {projectIssues.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        Aucun signalement
                      </p>
                    ) : (
                      projectIssues.map((issue) => (
                        <div
                          key={issue.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border"
                        >
                          <div>
                            <p className="font-medium">{issue.title}</p>
                            <p className="text-sm text-muted-foreground">
                              Par {issue.reportedBy} -{" "}
                              {new Date(issue.reportedAt).toLocaleDateString(
                                "fr-FR"
                              )}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={
                                issue.priority === "urgent"
                                  ? "bg-destructive/20 text-destructive border-destructive/30"
                                  : issue.priority === "high"
                                  ? "bg-warning/20 text-warning border-warning/30"
                                  : "bg-muted text-muted-foreground border-border"
                              }
                            >
                              {issue.priority === "urgent"
                                ? "Urgent"
                                : issue.priority === "high"
                                ? "Haute"
                                : issue.priority === "medium"
                                ? "Moyenne"
                                : "Basse"}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={
                                issue.status === "open"
                                  ? "bg-destructive/20 text-destructive border-destructive/30"
                                  : issue.status === "in-progress"
                                  ? "bg-warning/20 text-warning border-warning/30"
                                  : "bg-chart-1/20 text-chart-1 border-chart-1/30"
                              }
                            >
                              {issue.status === "open"
                                ? "Ouvert"
                                : issue.status === "in-progress"
                                ? "En cours"
                                : "Résolu"}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="invoices">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Factures</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {projectInvoices.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        Aucune facture
                      </p>
                    ) : (
                      projectInvoices.map((invoice) => (
                        <div
                          key={invoice.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border"
                        >
                          <div>
                            <p className="font-medium">{invoice.id}</p>
                            <p className="text-sm text-muted-foreground">
                              Échéance:{" "}
                              {new Date(invoice.dueDate).toLocaleDateString(
                                "fr-FR"
                              )}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {invoice.amount.toLocaleString("fr-FR")}€
                            </p>
                            <Badge
                              variant="outline"
                              className={
                                invoice.status === "paid"
                                  ? "bg-chart-1/20 text-chart-1 border-chart-1/30"
                                  : invoice.status === "sent"
                                  ? "bg-chart-2/20 text-chart-2 border-chart-2/30"
                                  : invoice.status === "overdue"
                                  ? "bg-destructive/20 text-destructive border-destructive/30"
                                  : "bg-muted text-muted-foreground border-border"
                              }
                            >
                              {invoice.status === "paid"
                                ? "Payée"
                                : invoice.status === "sent"
                                ? "Envoyée"
                                : invoice.status === "overdue"
                                ? "En retard"
                                : "Brouillon"}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
