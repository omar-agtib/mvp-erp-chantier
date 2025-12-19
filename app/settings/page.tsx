import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Paramètres</h1>
            <p className="text-muted-foreground">
              Configurez votre espace de travail
            </p>
          </div>

          <div className="grid gap-6 max-w-2xl">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Profil entreprise</CardTitle>
                <CardDescription>
                  Informations de votre entreprise pour les factures
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Nom de l'entreprise</Label>
                  <Input
                    defaultValue="Construction Pro SARL"
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>SIRET</Label>
                    <Input
                      defaultValue="123 456 789 00012"
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>TVA Intracommunautaire</Label>
                    <Input
                      defaultValue="FR 12 345678901"
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Adresse</Label>
                  <Input
                    defaultValue="123 Avenue des Chantiers, 75001 Paris"
                    className="bg-secondary border-border"
                  />
                </div>
                <Button className="bg-primary text-primary-foreground">
                  Enregistrer
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Configurez vos alertes et notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Alertes stock bas</p>
                    <p className="text-sm text-muted-foreground">
                      Recevoir une notification quand le stock est bas
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Signalements urgents</p>
                    <p className="text-sm text-muted-foreground">
                      Notification immédiate pour les urgences
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Rappels factures</p>
                    <p className="text-sm text-muted-foreground">
                      Rappel avant échéance des factures
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Résumé quotidien</p>
                    <p className="text-sm text-muted-foreground">
                      Email récapitulatif chaque matin
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Intégrations</CardTitle>
                <CardDescription>Connectez vos outils externes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border">
                  <div>
                    <p className="font-medium">Base de données ERP</p>
                    <p className="text-sm text-muted-foreground">
                      Synchronisation avec votre ERP existant
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configurer
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border">
                  <div>
                    <p className="font-medium">Power BI</p>
                    <p className="text-sm text-muted-foreground">
                      Export des KPIs vers Power BI
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Connecter
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border">
                  <div>
                    <p className="font-medium">Plans DWG</p>
                    <p className="text-sm text-muted-foreground">
                      Import automatique des fichiers DWG
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configurer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
