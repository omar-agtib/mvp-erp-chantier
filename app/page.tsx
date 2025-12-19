import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { ProjectsOverview } from "@/components/dashboard/projects-overview";
import { RecentIssues } from "@/components/dashboard/recent-issues";
import { InventoryAlerts } from "@/components/dashboard/inventory-alerts";
import { ActivityChart } from "@/components/dashboard/activity-chart";

export default function DashboardPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Tableau de bord</h1>
            <p className="text-muted-foreground">
              Vue d'ensemble de vos projets et activités
            </p>
          </div>

          <StatsCards />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <ProjectsOverview />
            <ActivityChart />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <RecentIssues />
            <InventoryAlerts />
          </div>
        </main>
      </div>
    </div>
  );
}
