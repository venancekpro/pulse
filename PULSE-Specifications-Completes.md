# PROJET PULSE - Application de Gestion de Charge d'Équipe SDIVT/CIE

## 📋 INSTRUCTIONS DE DÉVELOPPEMENT

Tu vas développer l'application PULSE **étape par étape, de manière séquentielle**. 
Ne passe JAMAIS à l'étape suivante sans avoir TERMINÉ l'étape en cours.
Après chaque étape, montre-moi le résultat et attends ma validation avant de continuer.

---

## 🎯 CONTEXTE & OBJECTIF

**PULSE** (Plateforme Unifiée de Suivi de charge et Lissage d'Équipe) est une application de gestion de capacité pour l'équipe SDIVT (Sous Direction Innovation et Veille Technologique) de CIE (Compagnie Ivoirienne d'Électricité).

L'application permet au Sous-Directeur (Bleu KOTY) et aux responsables de :
1. **Visualiser la charge actuelle** de chaque membre par pôle (Front, Back, DevOps, UX/UI)
2. **Identifier les surcharges** avec alertes visuelles (Critique, Élevée, Modérée, Normale)
3. **Simuler l'impact** d'un nouveau projet avant assignation
4. **Gérer les projets** avec découpage modulaire et délais
5. **Suivre les actions ISO 9001** par membre

---

## 🔐 SYSTÈME DE RÔLES & PERMISSIONS

### Rôles Utilisateurs

```typescript
type UserRole = 'admin' | 'viewer';

interface User {
  id: string;
  email: string;
  password: string; // hashé
  memberId?: string; // lien vers Member si c'est un membre de l'équipe
  role: UserRole;
  name: string;
}
```

### Liste des Utilisateurs & Permissions

| Utilisateur | Email | Rôle | Permissions |
|-------------|-------|------|-------------|
| Jacob | jacob@cie.ci | `admin` | Toutes actions |
| Raymond Ano (Chef de service) | raymond@cie.ci | `admin` | Toutes actions |
| Landry Yamb (1er Resp. équipes) | landry@cie.ci | `admin` | Toutes actions |
| Yacine (Resp. Front & QSE) | yacine@cie.ci | `admin` | Toutes actions |
| Chacoul (Resp. Back & Cloud) | chacoul@cie.ci | `admin` | Toutes actions |
| Rico (Resp. Back & Maint.) | rico@cie.ci | `admin` | Toutes actions |
| Ariel | ariel@cie.ci | `viewer` | Lecture seule |
| Yoan | yoan@cie.ci | `viewer` | Lecture seule |
| Venance | venance@cie.ci | `viewer` | Lecture seule |
| Fernandez | fernandez@cie.ci | `viewer` | Lecture seule |
| Derick | derick@cie.ci | `viewer` | Lecture seule |
| Malan | malan@cie.ci | `viewer` | Lecture seule |

### Matrice des Permissions

| Fonctionnalité | Admin | Viewer |
|----------------|-------|--------|
| Voir Dashboard | ✅ | ✅ |
| Voir Équipe | ✅ | ✅ |
| Voir Projets | ✅ | ✅ |
| Voir Timeline | ✅ | ✅ |
| Voir Rapports | ✅ | ✅ |
| **Créer Projet** | ✅ | ❌ |
| **Modifier Projet** | ✅ | ❌ |
| **Supprimer Projet** | ✅ | ❌ |
| **Assigner Membres** | ✅ | ❌ |
| **Utiliser Simulateur** | ✅ | ❌ |
| **Exécuter Simulation** | ✅ | ❌ |
| **Modifier Charge Membre** | ✅ | ❌ |
| **Exporter Rapports** | ✅ | ❌ |
| **Gérer Utilisateurs** | ✅ | ❌ |

---

## 🏗️ PLAN DE DÉVELOPPEMENT EN 10 PHASES

---

### PHASE 1 : INITIALISATION PROJET

**Objectif** : Setup complet du projet Next.js

**À créer** :
- [ ] Initialisation avec `npx create-next-app@latest pulse --typescript --tailwind --eslint --app --src-dir`
- [ ] Installer dépendances :
  ```bash
  npm install @prisma/client zustand zod lucide-react date-fns recharts bcryptjs jose
  npm install -D prisma @types/bcryptjs
  npx shadcn-ui@latest init
  ```
- [ ] Configurer shadcn/ui avec theme custom (couleurs PULSE)
- [ ] Créer structure dossiers complète
- [ ] Fichier `src/types/index.ts` avec TOUS les types
- [ ] Fichier `src/lib/constants.ts` avec constantes

**Structure dossiers à créer** :
```
src/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── team/
│   │   │   ├── page.tsx
│   │   │   └── [memberId]/
│   │   │       └── page.tsx
│   │   ├── projects/
│   │   │   ├── page.tsx
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [projectId]/
│   │   │       ├── page.tsx
│   │   │       └── edit/
│   │   │           └── page.tsx
│   │   ├── simulator/
│   │   │   └── page.tsx
│   │   ├── timeline/
│   │   │   └── page.tsx
│   │   ├── reports/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── route.ts
│   │   │   ├── logout/
│   │   │   │   └── route.ts
│   │   │   └── me/
│   │   │       └── route.ts
│   │   ├── dashboard/
│   │   │   └── stats/
│   │   │       └── route.ts
│   │   ├── members/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   ├── projects/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       ├── route.ts
│   │   │       └── modules/
│   │   │           └── route.ts
│   │   ├── simulation/
│   │   │   ├── run/
│   │   │   │   └── route.ts
│   │   │   ├── save/
│   │   │   │   └── route.ts
│   │   │   └── history/
│   │   │       └── route.ts
│   │   └── reports/
│   │       ├── team-load/
│   │       │   └── route.ts
│   │       └── export/
│   │           └── route.ts
│   ├── layout.tsx
│   ├── middleware.ts
│   └── globals.css
├── components/
│   ├── ui/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── PermissionGate.tsx
│   │   ├── RoleBadge.tsx
│   │   └── AccessDenied.tsx
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Navbar.tsx
│   │   ├── UserMenu.tsx
│   │   └── Breadcrumb.tsx
│   ├── dashboard/
│   │   ├── AlertBanner.tsx
│   │   ├── QuickStats.tsx
│   │   ├── PoleSection.tsx
│   │   ├── MemberCard.tsx
│   │   └── LoadBadge.tsx
│   ├── team/
│   │   ├── MemberDetail.tsx
│   │   ├── MemberProjects.tsx
│   │   ├── LoadChart.tsx
│   │   ├── IsoActionsProgress.tsx
│   │   └── EditMemberModal.tsx
│   ├── projects/
│   │   ├── ProjectForm.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── ModuleManager.tsx
│   │   ├── ModuleCard.tsx
│   │   ├── DeadlineBadge.tsx
│   │   ├── ProjectMembersList.tsx
│   │   └── ProjectActions.tsx
│   ├── simulator/
│   │   ├── SimulatorForm.tsx
│   │   ├── ImpactPreview.tsx
│   │   ├── BeforeAfterComparison.tsx
│   │   ├── MemberImpactCard.tsx
│   │   ├── RecommendationPanel.tsx
│   │   └── ConflictWarnings.tsx
│   ├── timeline/
│   │   ├── GanttChart.tsx
│   │   ├── ProjectBar.tsx
│   │   └── MilestoneMarker.tsx
│   └── reports/
│       ├── ReportGenerator.tsx
│       └── ReportPreview.tsx
├── lib/
│   ├── db.ts
│   ├── auth.ts
│   ├── permissions.ts
│   ├── constants.ts
│   ├── utils/
│   │   ├── load-calculator.ts
│   │   ├── impact-simulator.ts
│   │   └── date-helpers.ts
│   └── validations/
│       ├── project.ts
│       ├── member.ts
│       └── auth.ts
├── hooks/
│   ├── useAuth.ts
│   ├── usePermissions.ts
│   ├── useTeamData.ts
│   ├── useProjects.ts
│   └── useSimulation.ts
├── stores/
│   ├── auth-store.ts
│   └── simulation-store.ts
├── types/
│   └── index.ts
└── prisma/
    ├── schema.prisma
    └── seed.ts
```

**Fichier types/index.ts** :
```typescript
// ===== ENUMS =====
export type UserRole = 'admin' | 'viewer';
export type LoadLevel = 'critique' | 'elevee' | 'moderee' | 'normale';
export type Pole = 'front' | 'back' | 'devops' | 'ux-ui';
export type ProjectStatus = 'actif' | 'livre' | 'en-attente' | 'urgent';
export type ModuleStatus = 'todo' | 'in-progress' | 'review' | 'done';
export type ModuleType = 'default' | 'custom';
export type AssignmentRole = 'lead' | 'contributeur';
export type ProjectComplexity = 'faible' | 'moyenne' | 'haute' | 'critique';
export type AvailabilityMargin = 'large' | 'disponible' | 'aucune';

// ===== USER =====
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  memberId?: string;
  member?: Member;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ===== MEMBER =====
export interface Member {
  id: string;
  name: string;
  pole: Pole;
  roles: string[];
  loadLevel: LoadLevel;
  transversalRoles: string[];
  isoActions?: {
    completed: number;
    total: number;
  };
  availabilityMargin?: AvailabilityMargin;
  assignments: Assignment[];
  user?: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface MemberWithLoad extends Member {
  calculatedLoad: number;
  projectCount: number;
  urgentProjectCount: number;
}

// ===== PROJECT =====
export interface Project {
  id: string;
  name: string;
  code: string;
  description?: string;
  status: ProjectStatus;
  startDate: Date;
  deadline: Date;
  complexity: ProjectComplexity;
  modules: Module[];
  assignments: Assignment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectFormData {
  name: string;
  code: string;
  description?: string;
  status: ProjectStatus;
  startDate: string;
  deadline: string;
  complexity: ProjectComplexity;
  customModules?: Omit<Module, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>[];
}

// ===== MODULE =====
export interface Module {
  id: string;
  name: string;
  type: ModuleType;
  estimatedDays: number;
  completedDays: number;
  status: ModuleStatus;
  projectId: string;
  assignedToId?: string;
  assignedTo?: Member;
  createdAt: Date;
  updatedAt: Date;
}

export interface DefaultModule {
  name: string;
  estimatedDays: number;
}

// ===== ASSIGNMENT =====
export interface Assignment {
  id: string;
  memberId: string;
  member?: Member;
  projectId: string;
  project?: Project;
  role: AssignmentRole;
  allocation: number; // % du temps (0-100)
  isUrgent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ===== SIMULATION =====
export interface Simulation {
  id: string;
  createdById: string;
  createdBy?: User;
  projectData: SimulationProjectData;
  assignments: SimulationAssignment[];
  results: SimulationResult;
  createdAt: Date;
}

export interface SimulationProjectData {
  name: string;
  code: string;
  deadline: string;
  complexity: ProjectComplexity;
  modules: { name: string; estimatedDays: number }[];
}

export interface SimulationAssignment {
  memberId: string;
  memberName: string;
  allocation: number;
  role: AssignmentRole;
}

export interface SimulationResult {
  beforeState: MemberLoadState[];
  afterState: MemberLoadState[];
  impacts: MemberImpact[];
  recommendations: Recommendation[];
  warnings: Warning[];
  summary: SimulationSummary;
}

export interface MemberLoadState {
  memberId: string;
  memberName: string;
  pole: Pole;
  currentLoad: number;
  loadLevel: LoadLevel;
  projectCount: number;
}

export interface MemberImpact {
  memberId: string;
  memberName: string;
  pole: Pole;
  currentLoad: number;
  projectedLoad: number;
  currentLevel: LoadLevel;
  projectedLevel: LoadLevel;
  loadIncrease: number;
  recommendation: 'ok' | 'warning' | 'critical';
  conflictingDeadlines: { projectName: string; deadline: Date }[];
}

export interface Recommendation {
  type: 'alternative_member' | 'reduce_allocation' | 'delay_project' | 'split_assignment';
  memberId?: string;
  memberName?: string;
  reason: string;
  suggestedAllocation?: number;
}

export interface Warning {
  type: 'overload' | 'deadline_conflict' | 'bottleneck' | 'single_point_failure';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  affectedMembers?: string[];
}

export interface SimulationSummary {
  totalMembersAffected: number;
  membersEnteringOverload: number;
  averageLoadIncrease: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  canProceed: boolean;
}

// ===== DASHBOARD =====
export interface DashboardStats {
  totalMembers: number;
  totalProjects: number;
  activeProjects: number;
  membersInOverload: number;
  overloadPercentage: number;
  poleStats: PoleStats[];
}

export interface PoleStats {
  pole: Pole;
  memberCount: number;
  avgLoad: number;
  criticalCount: number;
}

// ===== PERMISSIONS =====
export type Permission = 
  | 'VIEW_DASHBOARD'
  | 'VIEW_TEAM'
  | 'VIEW_PROJECTS'
  | 'VIEW_TIMELINE'
  | 'VIEW_REPORTS'
  | 'CREATE_PROJECT'
  | 'EDIT_PROJECT'
  | 'DELETE_PROJECT'
  | 'ASSIGN_MEMBERS'
  | 'USE_SIMULATOR'
  | 'RUN_SIMULATION'
  | 'EDIT_MEMBER_LOAD'
  | 'EXPORT_REPORTS'
  | 'MANAGE_USERS';

// ===== API RESPONSES =====
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
```

**Fichier lib/constants.ts** :
```typescript
import { DefaultModule, LoadLevel, Permission, UserRole } from '@/types';

// ===== SEUILS DE CHARGE =====
export const LOAD_THRESHOLDS: Record<LoadLevel, { min: number; max: number }> = {
  normale: { min: 0, max: 60 },
  moderee: { min: 61, max: 80 },
  elevee: { min: 81, max: 100 },
  critique: { min: 101, max: Infinity },
};

// ===== POIDS DES RÔLES =====
export const ROLE_WEIGHT = {
  lead: 1.3,
  contributeur: 1.0,
} as const;

// ===== COÛT DES RÔLES TRANSVERSES =====
export const TRANSVERSAL_COST: Record<string, number> = {
  'Resp. QSE': 15,
  'Resp. Cloud': 15,
  'Resp. Maintenance': 10,
  'Audit sécu': 10,
  'Google Analytics': 5,
  'Veille techno': 5,
  'Amélioration IA': 5,
  'Serveurs — tous projets': 20,
  'CI/CD — tous projets': 15,
};

// ===== MODULES PAR DÉFAUT =====
export const DEFAULT_MODULES: DefaultModule[] = [
  { name: 'Auth', estimatedDays: 3 },
  { name: 'User', estimatedDays: 2 },
  { name: 'Dashboard', estimatedDays: 4 },
  { name: 'API Integration', estimatedDays: 5 },
  { name: 'Tests & QA', estimatedDays: 3 },
  { name: 'Déploiement', estimatedDays: 2 },
];

// ===== PERMISSIONS PAR RÔLE =====
export const PERMISSIONS: Record<Permission, UserRole[]> = {
  // Lecture (tous)
  VIEW_DASHBOARD: ['admin', 'viewer'],
  VIEW_TEAM: ['admin', 'viewer'],
  VIEW_PROJECTS: ['admin', 'viewer'],
  VIEW_TIMELINE: ['admin', 'viewer'],
  VIEW_REPORTS: ['admin', 'viewer'],
  
  // Écriture (admin only)
  CREATE_PROJECT: ['admin'],
  EDIT_PROJECT: ['admin'],
  DELETE_PROJECT: ['admin'],
  ASSIGN_MEMBERS: ['admin'],
  USE_SIMULATOR: ['admin'],
  RUN_SIMULATION: ['admin'],
  EDIT_MEMBER_LOAD: ['admin'],
  EXPORT_REPORTS: ['admin'],
  MANAGE_USERS: ['admin'],
};

// ===== COULEURS =====
export const LOAD_COLORS: Record<LoadLevel, string> = {
  critique: '#DC2626', // red-600
  elevee: '#F59E0B',   // amber-500
  moderee: '#3B82F6',  // blue-500
  normale: '#10B981',  // emerald-500
};

export const POLE_COLORS: Record<string, string> = {
  front: '#8B5CF6',    // violet-500
  back: '#06B6D4',     // cyan-500
  devops: '#F97316',   // orange-500
  'ux-ui': '#EC4899',  // pink-500
};

export const ROLE_COLORS: Record<UserRole, string> = {
  admin: '#8B5CF6',    // violet-500
  viewer: '#6B7280',   // gray-500
};

// ===== LABELS =====
export const LOAD_LABELS: Record<LoadLevel, string> = {
  critique: 'Critique',
  elevee: 'Élevée',
  moderee: 'Modérée',
  normale: 'Normale',
};

export const POLE_LABELS: Record<string, string> = {
  front: 'Pôle Front',
  back: 'Pôle Back',
  devops: 'DevOps',
  'ux-ui': 'UX/UI',
};

export const STATUS_LABELS: Record<string, string> = {
  actif: 'Actif',
  livre: 'Livré',
  'en-attente': 'En attente',
  urgent: 'Urgent',
};

// ===== NAVIGATION =====
export const NAV_ITEMS = [
  { 
    label: 'Dashboard', 
    href: '/', 
    icon: 'LayoutDashboard',
    permission: 'VIEW_DASHBOARD' as Permission,
  },
  { 
    label: 'Équipe', 
    href: '/team', 
    icon: 'Users',
    permission: 'VIEW_TEAM' as Permission,
  },
  { 
    label: 'Projets', 
    href: '/projects', 
    icon: 'FolderKanban',
    permission: 'VIEW_PROJECTS' as Permission,
  },
  { 
    label: 'Simulateur', 
    href: '/simulator', 
    icon: 'Zap',
    permission: 'USE_SIMULATOR' as Permission,
    adminOnly: true,
  },
  { 
    label: 'Timeline', 
    href: '/timeline', 
    icon: 'CalendarDays',
    permission: 'VIEW_TIMELINE' as Permission,
  },
  { 
    label: 'Rapports', 
    href: '/reports', 
    icon: 'BarChart3',
    permission: 'VIEW_REPORTS' as Permission,
  },
];

// ===== MOT DE PASSE PAR DÉFAUT =====
export const DEFAULT_PASSWORD = 'Pulse2024!';
```

**Livrable Phase 1** : Projet qui compile sans erreur + structure visible

---

### PHASE 2 : BASE DE DONNÉES & SEED

**Objectif** : Schema Prisma + données initiales équipe SDIVT + utilisateurs

**Fichier prisma/schema.prisma** :
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// ===== ENUMS =====
enum UserRole {
  admin
  viewer
}

enum LoadLevel {
  critique
  elevee
  moderee
  normale
}

enum Pole {
  front
  back
  devops
  ux_ui
}

enum ProjectStatus {
  actif
  livre
  en_attente
  urgent
}

enum ModuleStatus {
  todo
  in_progress
  review
  done
}

enum ModuleType {
  default
  custom
}

enum AssignmentRole {
  lead
  contributeur
}

enum ProjectComplexity {
  faible
  moyenne
  haute
  critique
}

// ===== MODELS =====
model User {
  id           String       @id @default(cuid())
  email        String       @unique
  passwordHash String
  name         String
  role         UserRole     @default(viewer)
  memberId     String?      @unique
  member       Member?      @relation(fields: [memberId], references: [id])
  simulations  Simulation[]
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
}

model Member {
  id                  String       @id @default(cuid())
  name                String
  pole                Pole
  roles               String       // JSON array stored as string
  loadLevel           LoadLevel    @default(normale)
  transversalRoles    String       @default("[]") // JSON array stored as string
  isoActionsCompleted Int?
  isoActionsTotal     Int?
  availabilityMargin  String?      // 'large' | 'disponible' | 'aucune'
  assignments         Assignment[]
  modules             Module[]     @relation("AssignedModules")
  user                User?
  createdAt           DateTime     @default(now())
  updatedAt           DateTime     @updatedAt
}

model Project {
  id          String            @id @default(cuid())
  name        String
  code        String            @unique
  description String?
  status      ProjectStatus     @default(actif)
  startDate   DateTime
  deadline    DateTime
  complexity  ProjectComplexity @default(moyenne)
  modules     Module[]
  assignments Assignment[]
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt
}

model Module {
  id            String       @id @default(cuid())
  name          String
  type          ModuleType   @default(default)
  estimatedDays Int
  completedDays Int          @default(0)
  status        ModuleStatus @default(todo)
  projectId     String
  project       Project      @relation(fields: [projectId], references: [id], onDelete: Cascade)
  assignedToId  String?
  assignedTo    Member?      @relation("AssignedModules", fields: [assignedToId], references: [id])
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt
}

model Assignment {
  id         String         @id @default(cuid())
  memberId   String
  member     Member         @relation(fields: [memberId], references: [id], onDelete: Cascade)
  projectId  String
  project    Project        @relation(fields: [projectId], references: [id], onDelete: Cascade)
  role       AssignmentRole @default(contributeur)
  allocation Int            // % du temps (0-100)
  isUrgent   Boolean        @default(false)
  createdAt  DateTime       @default(now())
  updatedAt  DateTime       @updatedAt

  @@unique([memberId, projectId])
}

model Simulation {
  id          String   @id @default(cuid())
  createdById String
  createdBy   User     @relation(fields: [createdById], references: [id])
  projectData String   // JSON stored as string
  assignments String   // JSON stored as string
  results     String   // JSON stored as string
  createdAt   DateTime @default(now())
}
```

**Fichier prisma/seed.ts** :
```typescript
import { PrismaClient, UserRole, Pole, LoadLevel, ProjectStatus, ProjectComplexity, AssignmentRole, ModuleType, ModuleStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const DEFAULT_PASSWORD = 'Pulse2024!';

async function main() {
  console.log('🌱 Seeding database...');

  // ===== HASH PASSWORD =====
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  // ===== CREATE MEMBERS =====
  console.log('Creating members...');
  
  const members = await Promise.all([
    // PÔLE FRONT
    prisma.member.create({
      data: {
        id: 'yacine',
        name: 'Yacine',
        pole: Pole.front,
        roles: JSON.stringify(['Resp. Front', 'Resp. QSE']),
        loadLevel: LoadLevel.critique,
        transversalRoles: JSON.stringify(['Resp. QSE']),
        isoActionsCompleted: 18,
        isoActionsTotal: 23,
      },
    }),
    prisma.member.create({
      data: {
        id: 'ariel',
        name: 'Ariel',
        pole: Pole.front,
        roles: JSON.stringify(['Dev Front']),
        loadLevel: LoadLevel.elevee,
        transversalRoles: JSON.stringify([]),
      },
    }),
    prisma.member.create({
      data: {
        id: 'yoan',
        name: 'Yoan',
        pole: Pole.front,
        roles: JSON.stringify(['Dev Front']),
        loadLevel: LoadLevel.elevee,
        transversalRoles: JSON.stringify(['Audit sécu', 'Google Analytics']),
      },
    }),
    prisma.member.create({
      data: {
        id: 'venance',
        name: 'Venance',
        pole: Pole.front,
        roles: JSON.stringify(['Dev Front']),
        loadLevel: LoadLevel.moderee,
        transversalRoles: JSON.stringify(['Veille techno', 'Amélioration IA']),
        isoActionsCompleted: 5,
        isoActionsTotal: 23,
        availabilityMargin: 'disponible',
      },
    }),
    // PÔLE BACK
    prisma.member.create({
      data: {
        id: 'chacoul',
        name: 'Chacoul',
        pole: Pole.back,
        roles: JSON.stringify(['Resp. Back', 'Resp. Cloud']),
        loadLevel: LoadLevel.critique,
        transversalRoles: JSON.stringify(['Resp. Cloud']),
      },
    }),
    prisma.member.create({
      data: {
        id: 'rico',
        name: 'Rico',
        pole: Pole.back,
        roles: JSON.stringify(['Resp. Back', 'Resp. Maintenance']),
        loadLevel: LoadLevel.critique,
        transversalRoles: JSON.stringify(['Resp. Maintenance']),
      },
    }),
    prisma.member.create({
      data: {
        id: 'fernandez',
        name: 'Fernandez',
        pole: Pole.back,
        roles: JSON.stringify(['Dev Back']),
        loadLevel: LoadLevel.moderee,
        transversalRoles: JSON.stringify([]),
        availabilityMargin: 'disponible',
      },
    }),
    prisma.member.create({
      data: {
        id: 'derick',
        name: 'Derick',
        pole: Pole.back,
        roles: JSON.stringify(['Dev Back']),
        loadLevel: LoadLevel.normale,
        transversalRoles: JSON.stringify([]),
        availabilityMargin: 'large',
      },
    }),
    // DEVOPS
    prisma.member.create({
      data: {
        id: 'malan',
        name: 'Malan',
        pole: Pole.devops,
        roles: JSON.stringify(['DevOps']),
        loadLevel: LoadLevel.elevee,
        transversalRoles: JSON.stringify(['Serveurs — tous projets', 'CI/CD — tous projets']),
        availabilityMargin: 'aucune',
      },
    }),
  ]);

  console.log(`Created ${members.length} members`);

  // ===== CREATE USERS =====
  console.log('Creating users...');

  const users = await Promise.all([
    // ADMINS
    prisma.user.create({
      data: {
        email: 'jacob@cie.ci',
        passwordHash,
        name: 'Jacob',
        role: UserRole.admin,
      },
    }),
    prisma.user.create({
      data: {
        email: 'raymond@cie.ci',
        passwordHash,
        name: 'Raymond Ano',
        role: UserRole.admin,
      },
    }),
    prisma.user.create({
      data: {
        email: 'landry@cie.ci',
        passwordHash,
        name: 'Landry Yamb',
        role: UserRole.admin,
      },
    }),
    prisma.user.create({
      data: {
        email: 'yacine@cie.ci',
        passwordHash,
        name: 'Yacine',
        role: UserRole.admin,
        memberId: 'yacine',
      },
    }),
    prisma.user.create({
      data: {
        email: 'chacoul@cie.ci',
        passwordHash,
        name: 'Chacoul',
        role: UserRole.admin,
        memberId: 'chacoul',
      },
    }),
    prisma.user.create({
      data: {
        email: 'rico@cie.ci',
        passwordHash,
        name: 'Rico',
        role: UserRole.admin,
        memberId: 'rico',
      },
    }),
    // VIEWERS
    prisma.user.create({
      data: {
        email: 'ariel@cie.ci',
        passwordHash,
        name: 'Ariel',
        role: UserRole.viewer,
        memberId: 'ariel',
      },
    }),
    prisma.user.create({
      data: {
        email: 'yoan@cie.ci',
        passwordHash,
        name: 'Yoan',
        role: UserRole.viewer,
        memberId: 'yoan',
      },
    }),
    prisma.user.create({
      data: {
        email: 'venance@cie.ci',
        passwordHash,
        name: 'Venance',
        role: UserRole.viewer,
        memberId: 'venance',
      },
    }),
    prisma.user.create({
      data: {
        email: 'fernandez@cie.ci',
        passwordHash,
        name: 'Fernandez',
        role: UserRole.viewer,
        memberId: 'fernandez',
      },
    }),
    prisma.user.create({
      data: {
        email: 'derick@cie.ci',
        passwordHash,
        name: 'Derick',
        role: UserRole.viewer,
        memberId: 'derick',
      },
    }),
    prisma.user.create({
      data: {
        email: 'malan@cie.ci',
        passwordHash,
        name: 'Malan',
        role: UserRole.viewer,
        memberId: 'malan',
      },
    }),
  ]);

  console.log(`Created ${users.length} users`);

  // ===== CREATE PROJECTS =====
  console.log('Creating projects...');

  const projects = await Promise.all([
    prisma.project.create({
      data: {
        id: 'vhse',
        name: 'VHSE Web+Mobile',
        code: 'VHSE',
        description: 'Application de Veille Hygiène, Sécurité, Environnement',
        status: ProjectStatus.actif,
        startDate: new Date('2024-01-15'),
        deadline: new Date('2024-06-30'),
        complexity: ProjectComplexity.haute,
      },
    }),
    prisma.project.create({
      data: {
        id: 'horus',
        name: 'Horus Web+Mobile',
        code: 'HORUS',
        description: 'Application SMC Conformité pour contrôles terrain',
        status: ProjectStatus.actif,
        startDate: new Date('2024-02-01'),
        deadline: new Date('2024-05-31'),
        complexity: ProjectComplexity.haute,
      },
    }),
    prisma.project.create({
      data: {
        id: 'suivi-encaissement',
        name: 'Suivi Encaissement',
        code: 'ENC',
        description: 'Module de suivi des encaissements',
        status: ProjectStatus.actif,
        startDate: new Date('2024-03-01'),
        deadline: new Date('2024-07-15'),
        complexity: ProjectComplexity.moyenne,
      },
    }),
    prisma.project.create({
      data: {
        id: 'eagence',
        name: 'eAgence',
        code: 'EAGENCE',
        description: 'Agence en ligne CIE',
        status: ProjectStatus.actif,
        startDate: new Date('2024-01-01'),
        deadline: new Date('2024-08-31'),
        complexity: ProjectComplexity.haute,
      },
    }),
    prisma.project.create({
      data: {
        id: 'smc-ht',
        name: 'SMC HT',
        code: 'SMC-HT',
        description: 'SMC Haute Tension',
        status: ProjectStatus.actif,
        startDate: new Date('2024-02-15'),
        deadline: new Date('2024-06-15'),
        complexity: ProjectComplexity.haute,
      },
    }),
    prisma.project.create({
      data: {
        id: 'smc-terrain',
        name: 'SMC Terrain',
        code: 'SMC-T',
        description: 'SMC Application Terrain',
        status: ProjectStatus.actif,
        startDate: new Date('2024-03-01'),
        deadline: new Date('2024-07-31'),
        complexity: ProjectComplexity.moyenne,
      },
    }),
    prisma.project.create({
      data: {
        id: 'divipost-analytics',
        name: 'DiviPost Analytics',
        code: 'DPA',
        description: 'Analytics pour DiviPost',
        status: ProjectStatus.actif,
        startDate: new Date('2024-04-01'),
        deadline: new Date('2024-08-15'),
        complexity: ProjectComplexity.moyenne,
      },
    }),
    prisma.project.create({
      data: {
        id: 'sms',
        name: 'SMS',
        code: 'SMS',
        description: 'Système de messagerie SMS',
        status: ProjectStatus.actif,
        startDate: new Date('2024-03-15'),
        deadline: new Date('2024-06-30'),
        complexity: ProjectComplexity.moyenne,
      },
    }),
    prisma.project.create({
      data: {
        id: 'alertia',
        name: 'Alertia',
        code: 'ALERTIA',
        description: 'Système d\'alertes',
        status: ProjectStatus.actif,
        startDate: new Date('2024-04-01'),
        deadline: new Date('2024-07-15'),
        complexity: ProjectComplexity.moyenne,
      },
    }),
    prisma.project.create({
      data: {
        id: 'smart-meet',
        name: 'Smart Meet',
        code: 'SMEET',
        description: 'Application de gestion de réunions',
        status: ProjectStatus.actif,
        startDate: new Date('2024-05-01'),
        deadline: new Date('2024-09-30'),
        complexity: ProjectComplexity.moyenne,
      },
    }),
    prisma.project.create({
      data: {
        id: 'e-performance',
        name: 'e-Performance',
        code: 'EPERF',
        description: 'Suivi de performance',
        status: ProjectStatus.actif,
        startDate: new Date('2024-04-15'),
        deadline: new Date('2024-08-31'),
        complexity: ProjectComplexity.moyenne,
      },
    }),
    prisma.project.create({
      data: {
        id: 'open-data',
        name: 'Open Data',
        code: 'ODATA',
        description: 'Plateforme Open Data CIE',
        status: ProjectStatus.livre,
        startDate: new Date('2023-09-01'),
        deadline: new Date('2024-02-28'),
        complexity: ProjectComplexity.moyenne,
      },
    }),
    prisma.project.create({
      data: {
        id: 'divipost',
        name: 'DiviPost',
        code: 'DPOST',
        description: 'Application DiviPost principale',
        status: ProjectStatus.livre,
        startDate: new Date('2023-06-01'),
        deadline: new Date('2024-01-31'),
        complexity: ProjectComplexity.haute,
      },
    }),
  ]);

  console.log(`Created ${projects.length} projects`);

  // ===== CREATE DEFAULT MODULES FOR ACTIVE PROJECTS =====
  console.log('Creating modules...');

  const activeProjects = projects.filter(p => p.status === ProjectStatus.actif);
  const defaultModules = [
    { name: 'Auth', estimatedDays: 3 },
    { name: 'User', estimatedDays: 2 },
    { name: 'Dashboard', estimatedDays: 4 },
    { name: 'API Integration', estimatedDays: 5 },
    { name: 'Tests & QA', estimatedDays: 3 },
    { name: 'Déploiement', estimatedDays: 2 },
  ];

  for (const project of activeProjects) {
    for (const mod of defaultModules) {
      await prisma.module.create({
        data: {
          name: mod.name,
          type: ModuleType.default,
          estimatedDays: mod.estimatedDays,
          completedDays: 0,
          status: ModuleStatus.todo,
          projectId: project.id,
        },
      });
    }
  }

  console.log('Created default modules for all active projects');

  // ===== CREATE ASSIGNMENTS =====
  console.log('Creating assignments...');

  const assignments = [
    // YACINE
    { memberId: 'yacine', projectId: 'vhse', role: AssignmentRole.lead, allocation: 25, isUrgent: true },
    { memberId: 'yacine', projectId: 'horus', role: AssignmentRole.lead, allocation: 25, isUrgent: true },
    { memberId: 'yacine', projectId: 'suivi-encaissement', role: AssignmentRole.contributeur, allocation: 15, isUrgent: false },
    { memberId: 'yacine', projectId: 'eagence', role: AssignmentRole.contributeur, allocation: 20, isUrgent: false },
    
    // ARIEL
    { memberId: 'ariel', projectId: 'smc-ht', role: AssignmentRole.contributeur, allocation: 20, isUrgent: false },
    { memberId: 'ariel', projectId: 'divipost-analytics', role: AssignmentRole.contributeur, allocation: 20, isUrgent: false },
    { memberId: 'ariel', projectId: 'sms', role: AssignmentRole.contributeur, allocation: 15, isUrgent: false },
    { memberId: 'ariel', projectId: 'alertia', role: AssignmentRole.contributeur, allocation: 15, isUrgent: false },
    { memberId: 'ariel', projectId: 'eagence', role: AssignmentRole.contributeur, allocation: 20, isUrgent: false },

    // YOAN
    { memberId: 'yoan', projectId: 'horus', role: AssignmentRole.contributeur, allocation: 25, isUrgent: true },
    { memberId: 'yoan', projectId: 'suivi-encaissement', role: AssignmentRole.contributeur, allocation: 20, isUrgent: false },
    { memberId: 'yoan', projectId: 'smart-meet', role: AssignmentRole.contributeur, allocation: 20, isUrgent: false },
    { memberId: 'yoan', projectId: 'eagence', role: AssignmentRole.contributeur, allocation: 20, isUrgent: false },

    // VENANCE
    { memberId: 'venance', projectId: 'smc-ht', role: AssignmentRole.contributeur, allocation: 25, isUrgent: false },
    { memberId: 'venance', projectId: 'smc-terrain', role: AssignmentRole.contributeur, allocation: 25, isUrgent: false },
    { memberId: 'venance', projectId: 'alertia', role: AssignmentRole.contributeur, allocation: 20, isUrgent: false },

    // CHACOUL
    { memberId: 'chacoul', projectId: 'smc-ht', role: AssignmentRole.lead, allocation: 25, isUrgent: true },
    { memberId: 'chacoul', projectId: 'horus', role: AssignmentRole.lead, allocation: 25, isUrgent: true },
    { memberId: 'chacoul', projectId: 'suivi-encaissement', role: AssignmentRole.contributeur, allocation: 20, isUrgent: false },
    { memberId: 'chacoul', projectId: 'smc-terrain', role: AssignmentRole.contributeur, allocation: 20, isUrgent: false },

    // RICO
    { memberId: 'rico', projectId: 'vhse', role: AssignmentRole.lead, allocation: 20, isUrgent: true },
    { memberId: 'rico', projectId: 'e-performance', role: AssignmentRole.lead, allocation: 20, isUrgent: false },
    { memberId: 'rico', projectId: 'divipost-analytics', role: AssignmentRole.contributeur, allocation: 15, isUrgent: false },
    { memberId: 'rico', projectId: 'sms', role: AssignmentRole.contributeur, allocation: 15, isUrgent: false },
    { memberId: 'rico', projectId: 'smart-meet', role: AssignmentRole.contributeur, allocation: 15, isUrgent: false },

    // FERNANDEZ
    { memberId: 'fernandez', projectId: 'horus', role: AssignmentRole.contributeur, allocation: 30, isUrgent: false },
    { memberId: 'fernandez', projectId: 'sms', role: AssignmentRole.contributeur, allocation: 20, isUrgent: false },
    { memberId: 'fernandez', projectId: 'alertia', role: AssignmentRole.contributeur, allocation: 20, isUrgent: false },

    // DERICK
    { memberId: 'derick', projectId: 'smc-ht', role: AssignmentRole.contributeur, allocation: 25, isUrgent: false },
    { memberId: 'derick', projectId: 'smc-terrain', role: AssignmentRole.contributeur, allocation: 25, isUrgent: false },

    // MALAN
    { memberId: 'malan', projectId: 'sms', role: AssignmentRole.lead, allocation: 20, isUrgent: false },
    { memberId: 'malan', projectId: 'alertia', role: AssignmentRole.lead, allocation: 20, isUrgent: false },
  ];

  for (const assignment of assignments) {
    await prisma.assignment.create({ data: assignment });
  }

  console.log(`Created ${assignments.length} assignments`);

  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Configuration package.json** (ajouter script prisma) :
```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

**Livrable Phase 2** : 
- `npx prisma db push` fonctionnel
- `npx prisma db seed` crée tous les utilisateurs et données

---

### PHASE 3 : AUTHENTIFICATION & LAYOUT DE BASE

**Objectif** : Login sécurisé + Layout avec Sidebar/Navbar + gestion rôles

**À créer** :
- [ ] Page `/login/page.tsx` avec formulaire
- [ ] API `POST /api/auth/login` : Vérification credentials, génération JWT
- [ ] API `POST /api/auth/logout` : Invalidation session
- [ ] API `GET /api/auth/me` : Récupération user courant
- [ ] Middleware `middleware.ts` : Protection routes, vérification JWT
- [ ] Fichier `lib/auth.ts` : Helpers JWT et vérification
- [ ] Fichier `lib/permissions.ts` : Matrice permissions
- [ ] Hook `hooks/useAuth.ts` : Gestion état authentification
- [ ] Hook `hooks/usePermissions.ts` : Vérification permissions selon rôle
- [ ] Store `stores/auth-store.ts` : Zustand store pour auth
- [ ] Composant `components/auth/LoginForm.tsx`
- [ ] Composant `components/auth/PermissionGate.tsx`
- [ ] Composant `components/auth/RoleBadge.tsx`
- [ ] Composant `components/auth/AccessDenied.tsx`
- [ ] Layout `(dashboard)/layout.tsx`
- [ ] Composant `components/layout/Sidebar.tsx` (collapsible)
- [ ] Composant `components/layout/Navbar.tsx`
- [ ] Composant `components/layout/UserMenu.tsx`

**Design Sidebar** :
```
┌─────────────────────────┐
│ 🔵 PULSE                │  <- Logo
│ Gestion de Charge       │
├─────────────────────────┤
│ 📊 Dashboard            │  <- Tous
│ 👥 Équipe               │  <- Tous
│ 📁 Projets              │  <- Tous
│ ⚡ Simulateur           │  <- Admin only (masqué pour viewers)
│ 📅 Timeline             │  <- Tous
│ 📈 Rapports             │  <- Tous
├─────────────────────────┤
│ ⚙️ Paramètres           │  <- Admin only
└─────────────────────────┘
┌─────────────────────────┐
│ 👤 Yacine               │
│ 🔷 Admin                │  <- RoleBadge
│ [Déconnexion]           │
└─────────────────────────┘
```

**Livrable Phase 3** : 
- Login fonctionnel avec redirection
- Layout complet avec Sidebar et Navbar
- Badge rôle visible
- Navigation adaptée au rôle

---

### PHASE 4 : DASHBOARD PRINCIPAL

**Objectif** : Vue d'ensemble charge équipe

**À créer** :
- [ ] Page `/(dashboard)/page.tsx`
- [ ] API `GET /api/dashboard/stats`
- [ ] Composant `AlertBanner.tsx` : Bannière alertes membres critiques
- [ ] Composant `QuickStats.tsx` : Cards KPIs (4 cards)
- [ ] Composant `PoleSection.tsx` : Section par pôle avec membres
- [ ] Composant `MemberCard.tsx` : Card membre avec infos charge
- [ ] Composant `LoadBadge.tsx` : Badge coloré niveau charge
- [ ] Filtres par pôle et niveau de charge

**Livrable Phase 4** : Dashboard fonctionnel avec données réelles

---

### PHASE 5 : GESTION ÉQUIPE

**Objectif** : Liste et détail des membres

**À créer** :
- [ ] Page `/team/page.tsx` : Liste membres
- [ ] Page `/team/[memberId]/page.tsx` : Détail membre
- [ ] API `GET /api/members`
- [ ] API `GET /api/members/[id]`
- [ ] API `PATCH /api/members/[id]` (admin only)
- [ ] Composant `MemberDetail.tsx`
- [ ] Composant `MemberProjects.tsx`
- [ ] Composant `LoadChart.tsx` (Recharts)
- [ ] Composant `IsoActionsProgress.tsx`
- [ ] Composant `EditMemberModal.tsx` (admin only)

**Livrable Phase 5** : Navigation équipe complète

---

### PHASE 6 : GESTION PROJETS

**Objectif** : CRUD projets avec modules

**À créer** :
- [ ] Page `/projects/page.tsx` : Liste projets
- [ ] Page `/projects/new/page.tsx` : Création (admin only)
- [ ] Page `/projects/[projectId]/page.tsx` : Détail
- [ ] Page `/projects/[projectId]/edit/page.tsx` : Édition (admin only)
- [ ] API `GET /api/projects`
- [ ] API `POST /api/projects` (admin only)
- [ ] API `GET /api/projects/[id]`
- [ ] API `PATCH /api/projects/[id]` (admin only)
- [ ] API `DELETE /api/projects/[id]` (admin only)
- [ ] API `POST /api/projects/[id]/modules` (admin only)
- [ ] Composant `ProjectForm.tsx`
- [ ] Composant `ProjectCard.tsx`
- [ ] Composant `ModuleManager.tsx`
- [ ] Composant `ModuleCard.tsx`
- [ ] Composant `DeadlineBadge.tsx`
- [ ] Composant `ProjectMembersList.tsx`
- [ ] Composant `ProjectActions.tsx`
- [ ] Validations Zod dans `lib/validations/project.ts`

**Livrable Phase 6** : CRUD projets complet avec permissions

---

### PHASE 7 : SIMULATEUR D'IMPACT ⭐ (ADMIN ONLY)

**Objectif** : Simuler ajout projet et voir impact

**⚠️ ACCÈS ADMIN UNIQUEMENT**

**À créer** :
- [ ] Page `/simulator/page.tsx` (redirect si viewer)
- [ ] API `POST /api/simulation/run` (admin only)
- [ ] API `POST /api/simulation/save` (admin only)
- [ ] API `GET /api/simulation/history` (admin only)
- [ ] Fichier `lib/utils/impact-simulator.ts`
- [ ] Composant `SimulatorForm.tsx`
- [ ] Composant `ImpactPreview.tsx`
- [ ] Composant `BeforeAfterComparison.tsx`
- [ ] Composant `MemberImpactCard.tsx`
- [ ] Composant `RecommendationPanel.tsx`
- [ ] Composant `ConflictWarnings.tsx`

**Livrable Phase 7** : Simulateur fonctionnel admin only

---

### PHASE 8 : TIMELINE / VUE GANTT

**Objectif** : Visualisation temporelle projets

**À créer** :
- [ ] Page `/timeline/page.tsx`
- [ ] Composant `GanttChart.tsx`
- [ ] Composant `ProjectBar.tsx`
- [ ] Composant `MilestoneMarker.tsx`
- [ ] Filtres par membre, pôle, période

**Livrable Phase 8** : Vue timeline interactive

---

### PHASE 9 : RAPPORTS & EXPORTS

**Objectif** : Génération rapports et exports

**À créer** :
- [ ] Page `/reports/page.tsx`
- [ ] API `GET /api/reports/team-load`
- [ ] API `GET /api/reports/export` (admin only)
- [ ] Composant `ReportGenerator.tsx`
- [ ] Composant `ReportPreview.tsx`
- [ ] Export PDF (admin only)
- [ ] Export CSV/Excel (admin only)

**Livrable Phase 9** : Rapports fonctionnels

---

### PHASE 10 : POLISH & FINITIONS

**Objectif** : Peaufinage final

**À faire** :
- [ ] Dark mode toggle
- [ ] Animations et transitions
- [ ] Loading states et skeletons
- [ ] Messages d'erreur user-friendly
- [ ] Tooltips sur boutons désactivés
- [ ] Responsive mobile
- [ ] Page profil utilisateur
- [ ] README.md complet
- [ ] Tests unitaires calculs de charge

**Livrable Phase 10** : Application production-ready

---

## 📐 SPÉCIFICATIONS TECHNIQUES

### Stack Technique
| Catégorie | Technologie |
|-----------|-------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS + shadcn/ui |
| Database | SQLite (dev) / PostgreSQL (prod) |
| ORM | Prisma |
| Auth | JWT avec jose + cookies httpOnly |
| State | Zustand |
| Validation | Zod |
| Charts | Recharts |
| Icons | Lucide React |
| Dates | date-fns |
| Password | bcryptjs |

### Design System

**Couleurs Charge** :
```css
--load-critique: #DC2626;   /* Rouge */
--load-elevee: #F59E0B;     /* Orange */
--load-moderee: #3B82F6;    /* Bleu */
--load-normale: #10B981;    /* Vert */
```

**Couleurs Pôles** :
```css
--pole-front: #8B5CF6;      /* Violet */
--pole-back: #06B6D4;       /* Cyan */
--pole-devops: #F97316;     /* Orange */
--pole-ux: #EC4899;         /* Rose */
```

**Couleurs Rôles** :
```css
--role-admin: #8B5CF6;      /* Violet */
--role-viewer: #6B7280;     /* Gris */
```

**Brand PULSE** :
```css
--pulse-primary: #2563EB;   /* Bleu */
--pulse-dark: #1E293B;      /* Fond sombre */
```

---

## ⚠️ RÈGLES IMPORTANTES

1. **UNE PHASE À LA FOIS** : Ne jamais mélanger les phases
2. **FICHIERS COMPLETS** : Toujours donner le code complet, jamais de "..."
3. **VÉRIFIER PERMISSIONS** : Chaque API route sensible doit vérifier le rôle
4. **UI ADAPTÉE AU RÔLE** : Masquer/désactiver les éléments selon permissions
5. **MESSAGES CLAIRS** : Expliquer aux viewers pourquoi certaines actions sont restreintes
6. **TESTER AVANT** : Vérifier que chaque fichier compile
7. **NOMMER CLAIREMENT** : Respecter la nomenclature définie
8. **COMMENTER** : Ajouter des commentaires explicatifs dans le code
9. **ATTENDRE VALIDATION** : Demander confirmation avant phase suivante

---

## 🚀 COMMENCE PAR LA PHASE 1

Lance la Phase 1 : Initialisation du projet.
Montre-moi tous les fichiers créés et la structure finale.
Attends ma validation avant de passer à la Phase 2.
```

---

## 📝 NOTES ADDITIONNELLES

### Comptes de Test

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| yacine@cie.ci | Pulse2024! | Admin |
| ariel@cie.ci | Pulse2024! | Viewer |

### Hiérarchie SDIVT (pour info)

```
DCTD (Directeur)
└── Bleu KOTY (Sous-directeur IVT)
    ├── Raymond Ano (Chef de service)
    └── Landry Yamb (1er Responsable équipes)
        ├── Yacine (Resp. Front & QSE)
        │   ├── Ariel (Dev Front)
        │   ├── Yoan (Dev Front)
        │   └── Venance (Dev Front)
        ├── Chacoul (Resp. Back & Cloud)
        │   ├── Fernandez (Dev Back)
        │   └── Derick (Dev Back)
        ├── Rico (Resp. Back & Maintenance)
        └── Malan (DevOps)
```
