"use client";

import { useState, useMemo } from "react";
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
  products as initialProducts,
  projects,
  type Product,
} from "@/lib/data";
import {
  Plus,
  Search,
  Package,
  AlertTriangle,
  ScanLine,
  ArrowDownToLine,
  ArrowUpFromLine,
  FileText,
} from "lucide-react";
import { ScannerDialog } from "@/components/inventory/scanner-dialog";
import * as XLSX from "xlsx";

const statusColors = {
  "in-stock": "bg-chart-1/20 text-chart-1 border-chart-1/30",
  "low-stock": "bg-warning/20 text-warning border-warning/30",
  "out-of-stock": "bg-destructive/20 text-destructive border-destructive/30",
};

const statusLabels = {
  "in-stock": "En stock",
  "low-stock": "Stock bas",
  "out-of-stock": "Rupture",
};

// Ajouter type pour l'historique des mouvements
type ProductMovement = {
  sku: string;
  action: "delivery" | "return" | "receipt";
  quantity: number;
  date: string; // ISO string
  fileUrl?: string; // PDF ou preuve
};

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scanMode, setScanMode] = useState<"delivery" | "return" | "receipt">(
    "delivery"
  );
  const [periodFilter, setPeriodFilter] = useState<"day" | "week" | "month">(
    "day"
  );
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    quantity: "",
    minStock: "",
    location: "",
    projectId: "",
  });

  const [movements, setMovements] = useState<ProductMovement[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const now = new Date();

  const filterByPeriod = (date: string) => {
    const d = new Date(date);
    const diff = (now.getTime() - d.getTime()) / 86400000;
    if (periodFilter === "day") return diff <= 1;
    if (periodFilter === "week") return diff <= 7;
    return diff <= 30;
  };

  // ---- Stats globales ----
  const stats = useMemo(() => {
    return {
      total: products.length,
      inStock: products.filter((p) => p.status === "in-stock").length,
      lowStock: products.filter((p) => p.status === "low-stock").length,
      outOfStock: products.filter((p) => p.status === "out-of-stock").length,
    };
  }, [products]);

  // ---- Filtrage produits ----
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || product.status === statusFilter;

      const matchesProject =
        projectFilter === "all" || product.projectId === projectFilter;

      return matchesSearch && matchesStatus && matchesProject;
    });
  }, [products, searchQuery, statusFilter, projectFilter]);

  // ---- Ajouter un produit ----
  const handleAddProduct = () => {
    const quantity = Number(newProduct.quantity);
    const minStock = Number(newProduct.minStock);
    const status: Product["status"] =
      quantity === 0
        ? "out-of-stock"
        : quantity < minStock
        ? "low-stock"
        : "in-stock";

    const product: Product = {
      id: `PRD-${String(products.length + 1).padStart(3, "0")}`,
      name: newProduct.name,
      sku: newProduct.sku,
      quantity,
      minStock,
      location: newProduct.location,
      projectId: newProduct.projectId,
      status,
    };
    setProducts([...products, product]);
    setNewProduct({
      name: "",
      sku: "",
      quantity: "",
      minStock: "",
      location: "",
      projectId: "",
    });
    setIsAddDialogOpen(false);
  };

  // ---- Scannage / mouvements ----
  const handleScan = (
    sku: string,
    action: "delivery" | "return" | "receipt",
    quantity: number,
    fileUrl?: string
  ) => {
    setProducts(
      products.map((p) => {
        if (p.sku === sku) {
          let newQuantity = p.quantity;
          if (action === "delivery" || action === "receipt") {
            newQuantity = p.quantity + quantity;
          } else if (action === "return") {
            newQuantity = Math.max(0, p.quantity - quantity);
          }
          const status: Product["status"] =
            newQuantity === 0
              ? "out-of-stock"
              : newQuantity < p.minStock
              ? "low-stock"
              : "in-stock";
          return { ...p, quantity: newQuantity, status };
        }
        return p;
      })
    );

    // Ajouter mouvement
    setMovements([
      ...movements,
      {
        sku,
        action,
        quantity,
        date: new Date().toISOString(),
        fileUrl,
      },
    ]);
  };

  // ---- Filtrage historique pour produit sélectionné ----
  const selectedProductMovements = useMemo(() => {
    if (!selectedProduct) return [];
    return movements
      .filter((m) => m.sku === selectedProduct.sku)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [movements, selectedProduct]);

  const exportToExcel = () => {
    const data = products.map((p) => ({
      Produit: p.name,
      SKU: p.sku,
      Quantité: p.quantity,
      Statut: p.status,
      Projet: projects.find((proj) => proj.id === p.projectId)?.name || "-",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventaire");
    XLSX.writeFile(wb, "inventaire.xlsx");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6">
          {/* --- Header --- */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">Inventaire</h1>
              <p className="text-muted-foreground">
                Gérez le stock de produits, mouvements et documents PDF
              </p>
            </div>
            <div className="flex flex-col-reverse md:flex-row gap-2">
              {/* Scanner */}
              <Dialog open={isScannerOpen} onOpenChange={setIsScannerOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <ScanLine className="w-4 h-4" /> Scanner
                  </Button>
                </DialogTrigger>
                <ScannerDialog
                  products={products}
                  onScan={handleScan}
                  scanMode={scanMode}
                  setScanMode={setScanMode}
                  onClose={() => setIsScannerOpen(false)}
                />
              </Dialog>

              {/* Ajouter produit */}
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" /> Ajouter Produit
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border">
                  <DialogHeader>
                    <DialogTitle>Ajouter un produit</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    {/* Formulaire complet existant */}
                    {/* ... le même code que tu avais déjà pour Input, Select etc. */}
                    <Button
                      onClick={handleAddProduct}
                      className="w-full bg-primary text-primary-foreground"
                    >
                      Ajouter
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              {/* Export Excel */}
              <Button
                onClick={exportToExcel}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <FileText className="w-4 h-4" /> Exporter Excel
              </Button>
            </div>
          </div>

          {/* --- Cards Statistiques --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-chart-2/10">
                  <Package className="w-5 h-5 text-chart-2" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Produits
                  </p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-chart-1/10">
                  <Package className="w-5 h-5 text-chart-1" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">En Stock</p>
                  <p className="text-2xl font-bold">{stats.inStock}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/10">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Stock Bas</p>
                  <p className="text-2xl font-bold">{stats.lowStock}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rupture</p>
                  <p className="text-2xl font-bold">{stats.outOfStock}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* --- Barre recherche + filtres --- */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom ou SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-secondary border-border"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-44 bg-secondary border-border">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="in-stock">En stock</SelectItem>
                <SelectItem value="low-stock">Stock bas</SelectItem>
                <SelectItem value="out-of-stock">Rupture</SelectItem>
              </SelectContent>
            </Select>
            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="w-52 bg-secondary border-border">
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

          {/* --- Table Produits --- */}
          <Card className="bg-card border-border mb-6">
            <CardHeader className="pb-4">
              <p className="text-sm text-muted-foreground">
                Cliquez sur un produit pour voir l'historique
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produit</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Quantité</TableHead>
                      <TableHead>Stock Min</TableHead>
                      <TableHead>Emplacement</TableHead>
                      <TableHead>Projet</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => {
                      const project = projects.find(
                        (p) => p.id === product.projectId
                      );
                      return (
                        <TableRow
                          key={product.id}
                          className="border-border cursor-pointer hover:bg-muted/10"
                          onClick={() => setSelectedProduct(product)}
                        >
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.sku}</TableCell>
                          <TableCell>{product.quantity}</TableCell>
                          <TableCell>{product.minStock}</TableCell>
                          <TableCell>{product.location}</TableCell>
                          <TableCell>{project?.name || "-"}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={statusColors[product.status]}
                            >
                              {statusLabels[product.status]}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleScan(product.sku, "delivery", 10);
                                }}
                              >
                                <ArrowDownToLine />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleScan(product.sku, "return", 5);
                                }}
                              >
                                <ArrowUpFromLine />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* --- Historique Movements Dialog --- */}
          <Dialog
            open={!!selectedProduct}
            onOpenChange={() => setSelectedProduct(null)}
          >
            <DialogContent className="max-w-3xl">
              {selectedProduct && (
                <>
                  <DialogHeader>
                    <DialogTitle>
                      Historique – {selectedProduct.name}
                    </DialogTitle>
                  </DialogHeader>

                  <Select
                    value={periodFilter}
                    onValueChange={(v) => setPeriodFilter(v as any)}
                  >
                    <SelectTrigger className="w-40 mb-4">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Jour</SelectItem>
                      <SelectItem value="week">Semaine</SelectItem>
                      <SelectItem value="month">Mois</SelectItem>
                    </SelectContent>
                  </Select>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Action</TableHead>
                        <TableHead>Qté</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Heure</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {movements
                        .filter(
                          (m) =>
                            m.sku === selectedProduct.sku &&
                            filterByPeriod(m.date) // use `date` instead of `createdAt`
                        )
                        .map((m, index) => (
                          <TableRow key={index}>
                            {" "}
                            {/* use index or generate a unique key */}
                            <TableCell>{m.action}</TableCell>{" "}
                            {/* use `action` instead of `type` */}
                            <TableCell>{m.quantity}</TableCell>
                            <TableCell>
                              {new Date(m.date).toLocaleDateString("fr-FR")}
                            </TableCell>
                            <TableCell>
                              {new Date(m.date).toLocaleTimeString("fr-FR")}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </>
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}
