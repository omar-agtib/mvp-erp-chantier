"use client";

import type React from "react";

import { useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/data";
import {
  ScanLine,
  ArrowDownToLine,
  ArrowUpFromLine,
  RotateCcw,
  Check,
  X,
} from "lucide-react";

interface ScannerDialogProps {
  products: Product[];
  onScan: (
    sku: string,
    action: "delivery" | "return" | "receipt",
    quantity: number
  ) => void;
  scanMode: "delivery" | "return" | "receipt";
  setScanMode: (mode: "delivery" | "return" | "receipt") => void;
  onClose: () => void;
}

const modeConfig = {
  delivery: {
    label: "Livraison",
    icon: ArrowDownToLine,
    color: "bg-chart-1 text-chart-1-foreground",
    description: "Ajouter des produits livrés au stock",
  },
  receipt: {
    label: "Réception",
    icon: RotateCcw,
    color: "bg-chart-2 text-chart-2-foreground",
    description: "Enregistrer une réception de produits",
  },
  return: {
    label: "Sortie",
    icon: ArrowUpFromLine,
    color: "bg-warning text-warning-foreground",
    description: "Retirer des produits du stock",
  },
};

export function ScannerDialog({
  products,
  onScan,
  scanMode,
  setScanMode,
  onClose,
}: ScannerDialogProps) {
  const [skuInput, setSkuInput] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [scanResult, setScanResult] = useState<{
    product: Product | null;
    success: boolean;
    message: string;
  } | null>(null);

  const handleScan = () => {
    const product = products.find(
      (p) => p.sku.toLowerCase() === skuInput.toLowerCase()
    );

    if (!product) {
      setScanResult({
        product: null,
        success: false,
        message: `Produit avec SKU "${skuInput}" non trouvé`,
      });
      return;
    }

    const qty = Number(quantity) || 1;
    onScan(product.sku, scanMode, qty);

    setScanResult({
      product,
      success: true,
      message:
        scanMode === "delivery"
          ? `+${qty} ${product.name} ajouté au stock`
          : scanMode === "receipt"
          ? `+${qty} ${product.name} réceptionné`
          : `-${qty} ${product.name} retiré du stock`,
    });

    setSkuInput("");
    setQuantity("1");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleScan();
    }
  };

  return (
    <DialogContent className="bg-card border-border sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <ScanLine className="w-5 h-5" />
          Scanner de Produits
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4 mt-4">
        <div className="flex gap-2">
          {(["delivery", "receipt", "return"] as const).map((mode) => {
            const config = modeConfig[mode];
            const Icon = config.icon;
            const isActive = scanMode === mode;
            return (
              <Button
                key={mode}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => setScanMode(mode)}
                className={isActive ? config.color : ""}
              >
                <Icon className="w-4 h-4 mr-1" />
                {config.label}
              </Button>
            );
          })}
        </div>

        <p className="text-sm text-muted-foreground">
          {modeConfig[scanMode].description}
        </p>

        <div className="space-y-2">
          <Label>Code SKU / Code-barres</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Scannez ou entrez le code..."
              value={skuInput}
              onChange={(e) => setSkuInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-secondary border-border font-mono"
              autoFocus
            />
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-20 bg-secondary border-border"
              placeholder="Qté"
            />
          </div>
        </div>

        <Button
          onClick={handleScan}
          className="w-full bg-primary text-primary-foreground"
        >
          <ScanLine className="w-4 h-4 mr-2" />
          Valider le scan
        </Button>

        {scanResult && (
          <div
            className={`p-4 rounded-lg border ${
              scanResult.success
                ? "bg-chart-1/10 border-chart-1/30"
                : "bg-destructive/10 border-destructive/30"
            }`}
          >
            <div className="flex items-start gap-3">
              {scanResult.success ? (
                <Check className="w-5 h-5 text-chart-1 mt-0.5" />
              ) : (
                <X className="w-5 h-5 text-destructive mt-0.5" />
              )}
              <div>
                <p
                  className={`font-medium ${
                    scanResult.success ? "text-chart-1" : "text-destructive"
                  }`}
                >
                  {scanResult.success ? "Succès" : "Erreur"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {scanResult.message}
                </p>
                {scanResult.product && (
                  <div className="mt-2 text-sm">
                    <p>
                      Nouveau stock:{" "}
                      <span className="font-medium">
                        {scanResult.product.quantity}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-border pt-4">
          <p className="text-xs text-muted-foreground mb-2">
            Codes disponibles pour test:
          </p>
          <div className="flex flex-wrap gap-2">
            {products.slice(0, 5).map((p) => (
              <Badge
                key={p.id}
                variant="outline"
                className="cursor-pointer hover:bg-secondary"
                onClick={() => setSkuInput(p.sku)}
              >
                {p.sku}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </DialogContent>
  );
}
