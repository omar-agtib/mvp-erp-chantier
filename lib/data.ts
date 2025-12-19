// Mock data store for the ERP MVP
export interface Project {
  id: string;
  name: string;
  client: string;
  status: "active" | "completed" | "on-hold";
  progress: number;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  minStock: number;
  location: string;
  projectId: string;
  status: "in-stock" | "low-stock" | "out-of-stock";
}

export interface Tool {
  id: string;
  name: string;
  code: string;
  status: "available" | "in-use" | "maintenance";
  assignedTo?: string;
  projectId?: string;
  lastMaintenance: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  projectId: string;
  priority: "urgent" | "high" | "medium" | "low";
  status: "open" | "in-progress" | "resolved";
  type: "non-conformity" | "modification" | "defect";
  reportedBy: string;
  reportedAt: string;
  imageUrl?: string;
}

export interface Invoice {
  id: string;
  projectId: string;
  client: string;
  amount: number;
  status: "draft" | "sent" | "paid" | "overdue";
  dueDate: string;
  createdAt: string;
  items: { description: string; quantity: number; unitPrice: number }[];
}

// Mock Projects
export const projects: Project[] = [
  {
    id: "PRJ-001",
    name: "Tour Montparnasse Renovation",
    client: "Bouygues Construction",
    status: "active",
    progress: 65,
    startDate: "2025-01-15",
    endDate: "2025-08-30",
    budget: 2500000,
    spent: 1625000,
  },
  {
    id: "PRJ-002",
    name: "Centre Commercial Les Halles",
    client: "Vinci Immobilier",
    status: "active",
    progress: 42,
    startDate: "2025-02-01",
    endDate: "2025-12-15",
    budget: 4200000,
    spent: 1764000,
  },
  {
    id: "PRJ-003",
    name: "Stade de France - Extension",
    client: "Eiffage",
    status: "on-hold",
    progress: 28,
    startDate: "2025-03-10",
    endDate: "2026-02-28",
    budget: 8500000,
    spent: 2380000,
  },
  {
    id: "PRJ-004",
    name: "Pont Alexandre III - Restauration",
    client: "Mairie de Paris",
    status: "completed",
    progress: 100,
    startDate: "2024-06-01",
    endDate: "2025-11-30",
    budget: 1800000,
    spent: 1720000,
  },
];

// Mock Products
export const products: Product[] = [
  {
    id: "PRD-001",
    name: "Béton armé C30/37",
    sku: "BET-C30",
    quantity: 450,
    minStock: 100,
    location: "Zone A1",
    projectId: "PRJ-001",
    status: "in-stock",
  },
  {
    id: "PRD-002",
    name: "Acier HA500",
    sku: "ACI-HA5",
    quantity: 85,
    minStock: 50,
    location: "Zone A2",
    projectId: "PRJ-001",
    status: "in-stock",
  },
  {
    id: "PRD-003",
    name: "Ciment Portland",
    sku: "CIM-POR",
    quantity: 25,
    minStock: 50,
    location: "Zone B1",
    projectId: "PRJ-002",
    status: "low-stock",
  },
  {
    id: "PRD-004",
    name: "Gravier 20/40",
    sku: "GRA-2040",
    quantity: 0,
    minStock: 200,
    location: "Zone C1",
    projectId: "PRJ-002",
    status: "out-of-stock",
  },
  {
    id: "PRD-005",
    name: "Tubes PVC 100mm",
    sku: "TUB-PVC",
    quantity: 320,
    minStock: 100,
    location: "Zone D1",
    projectId: "PRJ-003",
    status: "in-stock",
  },
];

// Mock Tools
export const tools: Tool[] = [
  {
    id: "TL-001",
    name: "Grue à tour Liebherr",
    code: "GRU-LIE-001",
    status: "in-use",
    assignedTo: "Jean Dupont",
    projectId: "PRJ-001",
    lastMaintenance: "2025-11-15",
  },
  {
    id: "TL-002",
    name: "Bétonnière 350L",
    code: "BET-350-002",
    status: "available",
    lastMaintenance: "2025-12-01",
  },
  {
    id: "TL-003",
    name: "Marteau piqueur Hilti",
    code: "MAR-HIL-003",
    status: "maintenance",
    lastMaintenance: "2025-10-20",
  },
  {
    id: "TL-004",
    name: "Chariot élévateur CAT",
    code: "CHA-CAT-004",
    status: "in-use",
    assignedTo: "Marie Martin",
    projectId: "PRJ-002",
    lastMaintenance: "2025-11-28",
  },
  {
    id: "TL-005",
    name: "Compacteur Bomag",
    code: "COM-BOM-005",
    status: "available",
    lastMaintenance: "2025-12-10",
  },
];

// Mock Issues
export const issues: Issue[] = [
  {
    id: "ISS-001",
    title: "Fissure mur porteur niveau 3",
    description:
      "Fissure détectée sur le mur porteur du niveau 3, nécessite inspection structurelle",
    projectId: "PRJ-001",
    priority: "urgent",
    status: "open",
    type: "non-conformity",
    reportedBy: "Pierre Leroy",
    reportedAt: "2025-12-17T09:30:00",
  },
  {
    id: "ISS-002",
    title: "Modification plan électrique",
    description: "Changement de l'emplacement des prises sur le plan initial",
    projectId: "PRJ-001",
    priority: "medium",
    status: "in-progress",
    type: "modification",
    reportedBy: "Sophie Bernard",
    reportedAt: "2025-12-16T14:15:00",
  },
  {
    id: "ISS-003",
    title: "Défaut étanchéité toiture",
    description:
      "Infiltration d'eau détectée au niveau de la jonction toiture-mur",
    projectId: "PRJ-002",
    priority: "high",
    status: "open",
    type: "defect",
    reportedBy: "Marc Dubois",
    reportedAt: "2025-12-17T11:00:00",
  },
];

// Mock Invoices
export const invoices: Invoice[] = [
  {
    id: "INV-2025-001",
    projectId: "PRJ-001",
    client: "Bouygues Construction",
    amount: 125000,
    status: "paid",
    dueDate: "2025-12-01",
    createdAt: "2025-11-01",
    items: [
      {
        description: "Travaux de fondation - Phase 1",
        quantity: 1,
        unitPrice: 75000,
      },
      { description: "Matériaux béton armé", quantity: 1, unitPrice: 50000 },
    ],
  },
  {
    id: "INV-2025-002",
    projectId: "PRJ-002",
    client: "Vinci Immobilier",
    amount: 280000,
    status: "sent",
    dueDate: "2025-12-30",
    createdAt: "2025-11-15",
    items: [
      {
        description: "Structure métallique - Lot 2",
        quantity: 1,
        unitPrice: 180000,
      },
      {
        description: "Installation électrique",
        quantity: 1,
        unitPrice: 100000,
      },
    ],
  },
  {
    id: "INV-2025-003",
    projectId: "PRJ-001",
    client: "Bouygues Construction",
    amount: 95000,
    status: "overdue",
    dueDate: "2025-11-15",
    createdAt: "2025-10-15",
    items: [
      { description: "Travaux de plomberie", quantity: 1, unitPrice: 95000 },
    ],
  },
];
