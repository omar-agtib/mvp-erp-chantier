import { Card, CardContent } from "@/components/ui/card";
import { projects, products, issues, invoices } from "@/lib/data";
import { FolderKanban, Package, AlertTriangle, TrendingUp } from "lucide-react";

export function StatsCards() {
  const activeProjects = projects.filter((p) => p.status === "active").length;
  const lowStockItems = products.filter(
    (p) => p.status === "low-stock" || p.status === "out-of-stock"
  ).length;
  const openIssues = issues.filter((i) => i.status === "open").length;
  const totalRevenue = invoices
    .filter((i) => i.status === "paid")
    .reduce((acc, i) => acc + i.amount, 0);

  const stats = [
    {
      title: "Projets Actifs",
      value: activeProjects,
      change: "+2 ce mois",
      icon: FolderKanban,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      title: "Stock Critique",
      value: lowStockItems,
      change: "Articles à commander",
      icon: Package,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Signalements Ouverts",
      value: openIssues,
      change: "À traiter",
      icon: AlertTriangle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      title: "CA Encaissé",
      value: `${(totalRevenue / 1000).toFixed(0)}K€`,
      change: "+12% vs mois dernier",
      icon: TrendingUp,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-card border-border">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.change}
                </p>
              </div>
              <div className={`p-2.5 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
