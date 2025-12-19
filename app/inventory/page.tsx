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
} from "lucide-react";
import { ScannerDialog } from "@/components/inventory/scanner-dialog";

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
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    quantity: "",
    minStock: "",
    location: "",
    projectId: "",
  });

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || product.status === statusFilter;
    const matchesProject =
      projectFilter === "all" || product.projectId === projectFilter;
    return matchesSearch && matchesStatus && matchesProject;
  });

  const stats = {
    total: products.length,
    inStock: products.filter((p) => p.status === "in-stock").length,
    lowStock: products.filter((p) => p.status === "low-stock").length,
    outOfStock: products.filter((p) => p.status === "out-of-stock").length,
  };

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

  const handleScan = (
    sku: string,
    action: "delivery" | "return" | "receipt",
    quantity: number
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
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">Inventaire</h1>
              <p className="text-muted-foreground">
                Gérez le stock de produits et matériaux
              </p>
            </div>
            <div className="flex flex-col-reverse md:flex-row gap-2">
              <Dialog open={isScannerOpen} onOpenChange={setIsScannerOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-transparent"
                  >
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
                    <div className="space-y-2">
                      <Label>Nom du produit</Label>
                      <Input
                        placeholder="Ex: Béton armé C30/37"
                        value={newProduct.name}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, name: e.target.value })
                        }
                        className="bg-secondary border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>SKU / Code</Label>
                      <Input
                        placeholder="Ex: BET-C30"
                        value={newProduct.sku}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, sku: e.target.value })
                        }
                        className="bg-secondary border-border"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Quantité</Label>
                        <Input
                          type="number"
                          placeholder="100"
                          value={newProduct.quantity}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              quantity: e.target.value,
                            })
                          }
                          className="bg-secondary border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Stock minimum</Label>
                        <Input
                          type="number"
                          placeholder="50"
                          value={newProduct.minStock}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              minStock: e.target.value,
                            })
                          }
                          className="bg-secondary border-border"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Emplacement</Label>
                      <Input
                        placeholder="Zone A1"
                        value={newProduct.location}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            location: e.target.value,
                          })
                        }
                        className="bg-secondary border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Projet</Label>
                      <Select
                        value={newProduct.projectId}
                        onValueChange={(value) =>
                          setNewProduct({ ...newProduct, projectId: value })
                        }
                      >
                        <SelectTrigger className="w-full bg-secondary border-border">
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
                    <Button
                      onClick={handleAddProduct}
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
                    <Package className="w-5 h-5 text-chart-2" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Produits
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
                    <Package className="w-5 h-5 text-chart-1" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">En Stock</p>
                    <p className="text-2xl font-bold">{stats.inStock}</p>
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
                    <p className="text-sm text-muted-foreground">Stock Bas</p>
                    <p className="text-2xl font-bold">{stats.lowStock}</p>
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
                    <p className="text-sm text-muted-foreground">Rupture</p>
                    <p className="text-2xl font-bold">{stats.outOfStock}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card border-border mb-6">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row gap-4">
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
                  <SelectTrigger className="w-45 bg-secondary border-border">
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
                        <TableRow key={product.id} className="border-border">
                          <TableCell className="font-medium">
                            {product.name}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {product.sku}
                          </TableCell>
                          <TableCell>{product.quantity}</TableCell>
                          <TableCell>{product.minStock}</TableCell>
                          <TableCell>{product.location}</TableCell>
                          <TableCell className="max-w-37.5 truncate">
                            {project?.name || "-"}
                          </TableCell>
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
                                className="h-8 w-8"
                                title="Livraison"
                                onClick={() =>
                                  handleScan(product.sku, "delivery", 10)
                                }
                              >
                                <ArrowDownToLine className="w-4 h-4 text-chart-1" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                title="Sortie"
                                onClick={() =>
                                  handleScan(product.sku, "return", 5)
                                }
                              >
                                <ArrowUpFromLine className="w-4 h-4 text-warning" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              {filteredProducts.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Aucun produit trouvé
                </p>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
