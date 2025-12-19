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
import {
  invoices as initialInvoices,
  projects,
  type Invoice,
} from "@/lib/data";
import {
  Plus,
  Search,
  Euro,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  Send,
  Eye,
  Trash2,
} from "lucide-react";

const statusColors = {
  draft: "bg-muted text-muted-foreground border-border",
  sent: "bg-chart-2/20 text-chart-2 border-chart-2/30",
  paid: "bg-chart-1/20 text-chart-1 border-chart-1/30",
  overdue: "bg-destructive/20 text-destructive border-destructive/30",
};

const statusLabels = {
  draft: "Brouillon",
  sent: "Envoyée",
  paid: "Payée",
  overdue: "En retard",
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [newInvoice, setNewInvoice] = useState({
    projectId: "",
    dueDate: "",
    items: [{ description: "", quantity: "1", unitPrice: "" }],
  });

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || invoice.status === statusFilter;
    const matchesProject =
      projectFilter === "all" || invoice.projectId === projectFilter;
    return matchesSearch && matchesStatus && matchesProject;
  });

  const stats = {
    total: invoices.reduce((acc, i) => acc + i.amount, 0),
    paid: invoices
      .filter((i) => i.status === "paid")
      .reduce((acc, i) => acc + i.amount, 0),
    pending: invoices
      .filter((i) => i.status === "sent")
      .reduce((acc, i) => acc + i.amount, 0),
    overdue: invoices
      .filter((i) => i.status === "overdue")
      .reduce((acc, i) => acc + i.amount, 0),
  };

  const handleAddItem = () => {
    setNewInvoice({
      ...newInvoice,
      items: [
        ...newInvoice.items,
        { description: "", quantity: "1", unitPrice: "" },
      ],
    });
  };

  const handleRemoveItem = (index: number) => {
    setNewInvoice({
      ...newInvoice,
      items: newInvoice.items.filter((_, i) => i !== index),
    });
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    const updatedItems = [...newInvoice.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setNewInvoice({ ...newInvoice, items: updatedItems });
  };

  const calculateTotal = () => {
    return newInvoice.items.reduce((acc, item) => {
      return acc + Number(item.quantity) * Number(item.unitPrice);
    }, 0);
  };

  const handleCreateInvoice = () => {
    const project = projects.find((p) => p.id === newInvoice.projectId);
    const invoice: Invoice = {
      id: `INV-${new Date().getFullYear()}-${String(
        invoices.length + 1
      ).padStart(3, "0")}`,
      projectId: newInvoice.projectId,
      client: project?.client || "Client inconnu",
      amount: calculateTotal(),
      status: "draft",
      dueDate: newInvoice.dueDate,
      createdAt: new Date().toISOString().split("T")[0],
      items: newInvoice.items.map((item) => ({
        description: item.description,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
      })),
    };
    setInvoices([invoice, ...invoices]);
    setNewInvoice({
      projectId: "",
      dueDate: "",
      items: [{ description: "", quantity: "1", unitPrice: "" }],
    });
    setIsCreateDialogOpen(false);
  };

  const handleStatusChange = (
    invoiceId: string,
    newStatus: Invoice["status"]
  ) => {
    setInvoices(
      invoices.map((i) =>
        i.id === invoiceId ? { ...i, status: newStatus } : i
      )
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
              <h1 className="text-2xl font-bold">Facturation</h1>
              <p className="text-muted-foreground">
                Gérez vos factures et suivez les paiements
              </p>
            </div>
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" /> Nouvelle Facture
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Créer une facture</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Projet</Label>
                      <Select
                        value={newInvoice.projectId}
                        onValueChange={(value) =>
                          setNewInvoice({ ...newInvoice, projectId: value })
                        }
                      >
                        <SelectTrigger className="bg-secondary border-border">
                          <SelectValue placeholder="Sélectionner un projet" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.name} ({project.client})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Date d'échéance</Label>
                      <Input
                        type="date"
                        value={newInvoice.dueDate}
                        onChange={(e) =>
                          setNewInvoice({
                            ...newInvoice,
                            dueDate: e.target.value,
                          })
                        }
                        className="bg-secondary border-border"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Lignes de facture</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAddItem}
                      >
                        <Plus className="w-3 h-3 mr-1" /> Ajouter ligne
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {newInvoice.items.map((item, index) => (
                        <div key={index} className="flex gap-2 items-start">
                          <Input
                            placeholder="Description"
                            value={item.description}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            className="flex-1 bg-secondary border-border"
                          />
                          <Input
                            type="number"
                            placeholder="Qté"
                            value={item.quantity}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "quantity",
                                e.target.value
                              )
                            }
                            className="w-20 bg-secondary border-border"
                          />
                          <Input
                            type="number"
                            placeholder="Prix unitaire"
                            value={item.unitPrice}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "unitPrice",
                                e.target.value
                              )
                            }
                            className="w-32 bg-secondary border-border"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(index)}
                            disabled={newInvoice.items.length === 1}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-border">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total HT</p>
                      <p className="text-2xl font-bold">
                        {calculateTotal().toLocaleString("fr-FR")} €
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={handleCreateInvoice}
                    className="w-full bg-primary text-primary-foreground"
                  >
                    Créer la facture
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-chart-2/10">
                    <Euro className="w-5 h-5 text-chart-2" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Facturé
                    </p>
                    <p className="text-2xl font-bold">
                      {(stats.total / 1000).toFixed(0)}K€
                    </p>
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
                    <p className="text-sm text-muted-foreground">Encaissé</p>
                    <p className="text-2xl font-bold">
                      {(stats.paid / 1000).toFixed(0)}K€
                    </p>
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
                    <p className="text-sm text-muted-foreground">En attente</p>
                    <p className="text-2xl font-bold">
                      {(stats.pending / 1000).toFixed(0)}K€
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-destructive/10">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">En retard</p>
                    <p className="text-2xl font-bold text-destructive">
                      {(stats.overdue / 1000).toFixed(0)}K€
                    </p>
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
                    placeholder="Rechercher par numéro ou client..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-secondary border-border"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40 bg-secondary border-border">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="sent">Envoyée</SelectItem>
                    <SelectItem value="paid">Payée</SelectItem>
                    <SelectItem value="overdue">En retard</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={projectFilter} onValueChange={setProjectFilter}>
                  <SelectTrigger className="w-50 bg-secondary border-border">
                    <SelectValue placeholder="Projet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les projets</SelectItem>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead>Numéro</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Projet</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Échéance</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.map((invoice) => {
                      const project = projects.find(
                        (p) => p.id === invoice.projectId
                      );
                      return (
                        <TableRow key={invoice.id} className="border-border">
                          <TableCell className="font-mono font-medium">
                            {invoice.id}
                          </TableCell>
                          <TableCell>{invoice.client}</TableCell>
                          <TableCell className="max-w-37.5 truncate">
                            {project?.name || "-"}
                          </TableCell>
                          <TableCell className="font-medium">
                            {invoice.amount.toLocaleString("fr-FR")} €
                          </TableCell>
                          <TableCell>
                            {new Date(invoice.dueDate).toLocaleDateString(
                              "fr-FR"
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={statusColors[invoice.status]}
                            >
                              {statusLabels[invoice.status]}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                title="Voir"
                                onClick={() => setSelectedInvoice(invoice)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              {invoice.status === "draft" && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  title="Envoyer"
                                  onClick={() =>
                                    handleStatusChange(invoice.id, "sent")
                                  }
                                >
                                  <Send className="w-4 h-4 text-chart-2" />
                                </Button>
                              )}
                              {(invoice.status === "sent" ||
                                invoice.status === "overdue") && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  title="Marquer payée"
                                  onClick={() =>
                                    handleStatusChange(invoice.id, "paid")
                                  }
                                >
                                  <CheckCircle className="w-4 h-4 text-chart-1" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                title="Télécharger"
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              {filteredInvoices.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Aucune facture trouvée
                </p>
              )}
            </CardContent>
          </Card>

          {/* Invoice Detail Dialog */}
          <Dialog
            open={!!selectedInvoice}
            onOpenChange={() => setSelectedInvoice(null)}
          >
            <DialogContent className="bg-card border-border max-w-2xl">
              {selectedInvoice && (
                <>
                  <DialogHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <DialogTitle className="text-xl font-mono">
                          {selectedInvoice.id}
                        </DialogTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {selectedInvoice.client}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={statusColors[selectedInvoice.status]}
                      >
                        {statusLabels[selectedInvoice.status]}
                      </Badge>
                    </div>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-border">
                      <div>
                        <p className="text-xs text-muted-foreground">Projet</p>
                        <p className="text-sm font-medium">
                          {
                            projects.find(
                              (p) => p.id === selectedInvoice.projectId
                            )?.name
                          }
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Date de création
                        </p>
                        <p className="text-sm font-medium">
                          {new Date(
                            selectedInvoice.createdAt
                          ).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Échéance
                        </p>
                        <p className="text-sm font-medium">
                          {new Date(selectedInvoice.dueDate).toLocaleDateString(
                            "fr-FR"
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Montant total
                        </p>
                        <p className="text-sm font-bold">
                          {selectedInvoice.amount.toLocaleString("fr-FR")} €
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-3">
                        Détail des lignes
                      </h4>
                      <Table>
                        <TableHeader>
                          <TableRow className="border-border">
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Qté</TableHead>
                            <TableHead className="text-right">
                              Prix unitaire
                            </TableHead>
                            <TableHead className="text-right">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedInvoice.items.map((item, index) => (
                            <TableRow key={index} className="border-border">
                              <TableCell>{item.description}</TableCell>
                              <TableCell className="text-right">
                                {item.quantity}
                              </TableCell>
                              <TableCell className="text-right">
                                {item.unitPrice.toLocaleString("fr-FR")} €
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                {(
                                  item.quantity * item.unitPrice
                                ).toLocaleString("fr-FR")}{" "}
                                €
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-border">
                      <div className="flex gap-2">
                        {selectedInvoice.status === "draft" && (
                          <Button
                            onClick={() =>
                              handleStatusChange(selectedInvoice.id, "sent")
                            }
                          >
                            <Send className="w-4 h-4 mr-2" /> Envoyer
                          </Button>
                        )}
                        {(selectedInvoice.status === "sent" ||
                          selectedInvoice.status === "overdue") && (
                          <Button
                            onClick={() =>
                              handleStatusChange(selectedInvoice.id, "paid")
                            }
                            className="bg-chart-1 text-primary-foreground hover:bg-chart-1/90"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" /> Marquer
                            payée
                          </Button>
                        )}
                        <Button variant="outline">
                          <Download className="w-4 h-4 mr-2" /> Télécharger PDF
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          Total TTC
                        </p>
                        <p className="text-2xl font-bold">
                          {selectedInvoice.amount.toLocaleString("fr-FR")} €
                        </p>
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
  );
}
