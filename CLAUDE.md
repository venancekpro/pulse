# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## About

PULSE is a crew load management and project impact simulator for the SDIVT team at CIE (Compagnie Ivoirienne d'Électricité). It tracks team member workload across projects, calculates load levels, and runs what-if simulations for new project assignments.

## Commands

```bash
npm run dev          # Start dev server with Turbopack
npm run build        # Production build
npm run lint         # ESLint
npm run db:push      # Push Prisma schema to SQLite
npm run db:seed      # Seed database with test data (tsx prisma/seed.ts)
npm run db:reset     # Force-reset DB + re-seed
```

No test framework is configured.

## Stack

- **Next.js 16.2.1** (app router, React 19, Turbopack) — read `node_modules/next/dist/docs/` for API changes as this version has breaking changes from training data
- **TypeScript 5**, **Tailwind CSS v4**, **shadcn/ui** (base-nova style, neutral color)
- **Prisma 7.5** with **SQLite** (better-sqlite3) — schema in `prisma/schema.prisma`
- **Authentication**: JWT (jose, HS256, 7-day expiry) stored in httpOnly cookie `pulse-token`
- **State**: Zustand stores in `src/stores/`
- **Validation**: Zod schemas in `src/lib/validations/`

## Architecture

### Route structure (app router)

- `src/app/(auth)/login/` — public login page
- `src/app/(dashboard)/` — all protected routes (dashboard, team, projects, simulator, timeline, reports, settings)
- `src/app/api/` — REST API endpoints returning `{ success, data }` or `{ success: false, error }`
- `src/middleware.ts` — JWT verification on all routes except `/login` and `/api/auth/login`

### Key layers

- **API routes** (`src/app/api/`) — server-side handlers using Prisma directly
- **Hooks** (`src/hooks/`) — data fetching and auth state (`useAuth`, `useProjects`, `useTeamData`, `useSimulation`, `usePermissions`)
- **Stores** (`src/stores/`) — Zustand for auth and simulation state
- **Components** (`src/components/`) — organized by domain: `auth/`, `dashboard/`, `projects/`, `team/`, `simulator/`, `timeline/`, `reports/`, `layout/`, `ui/` (shadcn primitives)

### Business logic

- **Load calculator** (`src/lib/utils/load-calculator.ts`): sums allocation × role weight (lead=1.3, contributeur=1.0), adds transversal role costs, caps at 200%, derives load level from thresholds (normale ≤60%, modérée 61-80%, élevée 81-100%, critique >100%)
- **Impact simulator** (`src/lib/utils/impact-simulator.ts`): computes before/after load, detects deadline conflicts (14-day window), generates warnings and recommendations
- **Constants** (`src/lib/constants.ts`): load thresholds, role weights, transversal costs, permissions map, UI colors
- **Permissions** (`src/lib/permissions.ts`): RBAC with two roles — `admin` (full CRUD, simulator, user management) and `viewer` (read-only)

### Database

8 Prisma models: User, Member, Project, Module, Assignment, Simulation. Key relationships:
- Member ↔ Assignment ↔ Project (many-to-many via Assignment with role + allocation)
- Project → Module (cascade delete)
- Module optionally assigned to a Member
- JSON fields: `Member.roles`, `Member.transversalRoles`, `Simulation.projectData/assignments/results`

### Environment

Requires `.env` with `DATABASE_URL` (default: `file:./prisma/dev.db`) and `JWT_SECRET` (min 32 chars). See `.env.example`.

## Domain terms

- **Pôle**: team subdivision (front, back, devops, ux-ui)
- **Charge/Load**: calculated workload percentage per member
- **Rôle transversal**: cross-cutting responsibility adding overhead cost (QSE, Cloud, CI/CD, etc.)
- **Livré**: delivered/completed project status (excluded from load calculation)

## Conventions

- All UI labels are in French
- API responses follow `{ success: boolean, data?: T, error?: string }` pattern
- Prisma client singleton in `src/lib/prisma.ts` with hot-reload safety
- `better-sqlite3` declared as server-external package in `next.config.ts`
