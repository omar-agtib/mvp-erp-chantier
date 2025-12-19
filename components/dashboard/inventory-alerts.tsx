"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { products, projects } from "@/lib/data";
import { ArrowRight, Package, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function InventoryAlerts() {
  const criticalItems = products.filter(
    (p) => p.status === "low-stock" || p.status === "out-of-stock"
  );

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Alertes Stock</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link
            href="/inventory"
            className="flex items-center gap-1 text-primary"
          >
            Voir tout <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {criticalItems.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Aucune alerte de stock
          </p>
        ) : (
          criticalItems.map((product) => {
            const project = projects.find((p) => p.id === product.projectId);
            return (
              <div
                key={product.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border hover:border-primary/30 transition-colors"
              >
                <div
                  className={`p-2 rounded-lg ${
                    product.status === "out-of-stock"
                      ? "bg-destructive/10"
                      : "bg-warning/10"
                  }`}
                >
                  {product.status === "out-of-stock" ? (
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                  ) : (
                    <Package className="w-4 h-4 text-warning" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">
                    {product.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {product.quantity} / {product.minStock} min -{" "}
                    {project?.name}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={
                    product.status === "out-of-stock"
                      ? "bg-destructive/20 text-destructive border-destructive/30"
                      : "bg-warning/20 text-warning border-warning/30"
                  }
                >
                  {product.status === "out-of-stock" ? "Rupture" : "Bas"}
                </Badge>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
