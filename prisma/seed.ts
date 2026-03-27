import "dotenv/config";
import {
  UserRole,
  Pole,
  LoadLevel,
  ProjectStatus,
  ProjectComplexity,
  AssignmentRole,
  ModuleType,
  ModuleStatus,
} from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

const DEFAULT_PASSWORD = "Pulse2024!";

async function clearPulseData() {
  await prisma.$transaction([
    prisma.simulation.deleteMany(),
    prisma.assignment.deleteMany(),
    prisma.module.deleteMany(),
    prisma.user.deleteMany(),
    prisma.project.deleteMany(),
    prisma.member.deleteMany(),
  ]);
}

async function main() {
  console.log("🌱 Seeding database...");

  console.log("Clearing existing PULSE data (re-seed safe)...");
  await clearPulseData();

  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  console.log("Creating members...");

  await Promise.all([
    prisma.member.create({
      data: {
        id: "yacine",
        name: "Yacine",
        pole: Pole.front,
        roles: JSON.stringify(["Resp. Front", "Resp. QSE"]),
        loadLevel: LoadLevel.critique,
        transversalRoles: JSON.stringify(["Resp. QSE"]),
        isoActionsCompleted: 18,
        isoActionsTotal: 23,
      },
    }),
    prisma.member.create({
      data: {
        id: "ariel",
        name: "Ariel",
        pole: Pole.front,
        roles: JSON.stringify(["Dev Front"]),
        loadLevel: LoadLevel.elevee,
        transversalRoles: JSON.stringify([]),
      },
    }),
    prisma.member.create({
      data: {
        id: "yoan",
        name: "Yoan",
        pole: Pole.front,
        roles: JSON.stringify(["Dev Front"]),
        loadLevel: LoadLevel.elevee,
        transversalRoles: JSON.stringify(["Audit sécu", "Google Analytics"]),
      },
    }),
    prisma.member.create({
      data: {
        id: "venance",
        name: "Venance",
        pole: Pole.front,
        roles: JSON.stringify(["Dev Front"]),
        loadLevel: LoadLevel.moderee,
        transversalRoles: JSON.stringify(["Veille techno", "Amélioration IA"]),
        isoActionsCompleted: 5,
        isoActionsTotal: 23,
        availabilityMargin: "disponible",
      },
    }),
    prisma.member.create({
      data: {
        id: "chacoul",
        name: "Chacoul",
        pole: Pole.back,
        roles: JSON.stringify(["Resp. Back", "Resp. Cloud"]),
        loadLevel: LoadLevel.critique,
        transversalRoles: JSON.stringify(["Resp. Cloud"]),
      },
    }),
    prisma.member.create({
      data: {
        id: "rico",
        name: "Rico",
        pole: Pole.back,
        roles: JSON.stringify(["Resp. Back", "Resp. Maintenance"]),
        loadLevel: LoadLevel.critique,
        transversalRoles: JSON.stringify(["Resp. Maintenance"]),
      },
    }),
    prisma.member.create({
      data: {
        id: "fernandez",
        name: "Fernandez",
        pole: Pole.back,
        roles: JSON.stringify(["Dev Back"]),
        loadLevel: LoadLevel.moderee,
        transversalRoles: JSON.stringify([]),
        availabilityMargin: "disponible",
      },
    }),
    prisma.member.create({
      data: {
        id: "derick",
        name: "Derick",
        pole: Pole.back,
        roles: JSON.stringify(["Dev Back"]),
        loadLevel: LoadLevel.normale,
        transversalRoles: JSON.stringify([]),
        availabilityMargin: "large",
      },
    }),
    prisma.member.create({
      data: {
        id: "malan",
        name: "Malan",
        pole: Pole.devops,
        roles: JSON.stringify(["DevOps"]),
        loadLevel: LoadLevel.elevee,
        transversalRoles: JSON.stringify([
          "Serveurs — tous projets",
          "CI/CD — tous projets",
        ]),
        availabilityMargin: "aucune",
      },
    }),
  ]);

  console.log("Creating users...");

  await Promise.all([
    prisma.user.create({
      data: {
        email: "jacob@cie.ci",
        passwordHash,
        name: "Jacob",
        role: UserRole.admin,
      },
    }),
    prisma.user.create({
      data: {
        email: "raymond@cie.ci",
        passwordHash,
        name: "Raymond Ano",
        role: UserRole.admin,
      },
    }),
    prisma.user.create({
      data: {
        email: "landry@cie.ci",
        passwordHash,
        name: "Landry Yamb",
        role: UserRole.admin,
      },
    }),
    prisma.user.create({
      data: {
        email: "yacine@cie.ci",
        passwordHash,
        name: "Yacine",
        role: UserRole.admin,
        memberId: "yacine",
      },
    }),
    prisma.user.create({
      data: {
        email: "chacoul@cie.ci",
        passwordHash,
        name: "Chacoul",
        role: UserRole.admin,
        memberId: "chacoul",
      },
    }),
    prisma.user.create({
      data: {
        email: "rico@cie.ci",
        passwordHash,
        name: "Rico",
        role: UserRole.admin,
        memberId: "rico",
      },
    }),
    prisma.user.create({
      data: {
        email: "ariel@cie.ci",
        passwordHash,
        name: "Ariel",
        role: UserRole.viewer,
        memberId: "ariel",
      },
    }),
    prisma.user.create({
      data: {
        email: "yoan@cie.ci",
        passwordHash,
        name: "Yoan",
        role: UserRole.viewer,
        memberId: "yoan",
      },
    }),
    prisma.user.create({
      data: {
        email: "venance@cie.ci",
        passwordHash,
        name: "Venance",
        role: UserRole.viewer,
        memberId: "venance",
      },
    }),
    prisma.user.create({
      data: {
        email: "fernandez@cie.ci",
        passwordHash,
        name: "Fernandez",
        role: UserRole.viewer,
        memberId: "fernandez",
      },
    }),
    prisma.user.create({
      data: {
        email: "derick@cie.ci",
        passwordHash,
        name: "Derick",
        role: UserRole.viewer,
        memberId: "derick",
      },
    }),
    prisma.user.create({
      data: {
        email: "malan@cie.ci",
        passwordHash,
        name: "Malan",
        role: UserRole.viewer,
        memberId: "malan",
      },
    }),
  ]);

  console.log("Creating projects...");

  const projects = await Promise.all([
    prisma.project.create({
      data: {
        id: "vhse",
        name: "VHSE Web+Mobile",
        code: "VHSE",
        description: "Application de Veille Hygiène, Sécurité, Environnement",
        status: ProjectStatus.actif,
        startDate: new Date("2024-01-15"),
        deadline: new Date("2024-06-30"),
        complexity: ProjectComplexity.haute,
      },
    }),
    prisma.project.create({
      data: {
        id: "horus",
        name: "Horus Web+Mobile",
        code: "HORUS",
        description: "Application SMC Conformité pour contrôles terrain",
        status: ProjectStatus.actif,
        startDate: new Date("2024-02-01"),
        deadline: new Date("2024-05-31"),
        complexity: ProjectComplexity.haute,
      },
    }),
    prisma.project.create({
      data: {
        id: "suivi-encaissement",
        name: "Suivi Encaissement",
        code: "ENC",
        description: "Module de suivi des encaissements",
        status: ProjectStatus.actif,
        startDate: new Date("2024-03-01"),
        deadline: new Date("2024-07-15"),
        complexity: ProjectComplexity.moyenne,
      },
    }),
    prisma.project.create({
      data: {
        id: "eagence",
        name: "eAgence",
        code: "EAGENCE",
        description: "Agence en ligne CIE",
        status: ProjectStatus.actif,
        startDate: new Date("2024-01-01"),
        deadline: new Date("2024-08-31"),
        complexity: ProjectComplexity.haute,
      },
    }),
    prisma.project.create({
      data: {
        id: "smc-ht",
        name: "SMC HT",
        code: "SMC-HT",
        description: "SMC Haute Tension",
        status: ProjectStatus.actif,
        startDate: new Date("2024-02-15"),
        deadline: new Date("2024-06-15"),
        complexity: ProjectComplexity.haute,
      },
    }),
    prisma.project.create({
      data: {
        id: "smc-terrain",
        name: "SMC Terrain",
        code: "SMC-T",
        description: "SMC Application Terrain",
        status: ProjectStatus.actif,
        startDate: new Date("2024-03-01"),
        deadline: new Date("2024-07-31"),
        complexity: ProjectComplexity.moyenne,
      },
    }),
    prisma.project.create({
      data: {
        id: "divipost-analytics",
        name: "DiviPost Analytics",
        code: "DPA",
        description: "Analytics pour DiviPost",
        status: ProjectStatus.actif,
        startDate: new Date("2024-04-01"),
        deadline: new Date("2024-08-15"),
        complexity: ProjectComplexity.moyenne,
      },
    }),
    prisma.project.create({
      data: {
        id: "sms",
        name: "SMS",
        code: "SMS",
        description: "Système de messagerie SMS",
        status: ProjectStatus.actif,
        startDate: new Date("2024-03-15"),
        deadline: new Date("2024-06-30"),
        complexity: ProjectComplexity.moyenne,
      },
    }),
    prisma.project.create({
      data: {
        id: "alertia",
        name: "Alertia",
        code: "ALERTIA",
        description: "Système d'alertes",
        status: ProjectStatus.actif,
        startDate: new Date("2024-04-01"),
        deadline: new Date("2024-07-15"),
        complexity: ProjectComplexity.moyenne,
      },
    }),
    prisma.project.create({
      data: {
        id: "smart-meet",
        name: "Smart Meet",
        code: "SMEET",
        description: "Application de gestion de réunions",
        status: ProjectStatus.actif,
        startDate: new Date("2024-05-01"),
        deadline: new Date("2024-09-30"),
        complexity: ProjectComplexity.moyenne,
      },
    }),
    prisma.project.create({
      data: {
        id: "e-performance",
        name: "e-Performance",
        code: "EPERF",
        description: "Suivi de performance",
        status: ProjectStatus.actif,
        startDate: new Date("2024-04-15"),
        deadline: new Date("2024-08-31"),
        complexity: ProjectComplexity.moyenne,
      },
    }),
    prisma.project.create({
      data: {
        id: "open-data",
        name: "Open Data",
        code: "ODATA",
        description: "Plateforme Open Data CIE",
        status: ProjectStatus.livre,
        startDate: new Date("2023-09-01"),
        deadline: new Date("2024-02-28"),
        complexity: ProjectComplexity.moyenne,
      },
    }),
    prisma.project.create({
      data: {
        id: "divipost",
        name: "DiviPost",
        code: "DPOST",
        description: "Application DiviPost principale",
        status: ProjectStatus.livre,
        startDate: new Date("2023-06-01"),
        deadline: new Date("2024-01-31"),
        complexity: ProjectComplexity.haute,
      },
    }),
  ]);

  console.log(`Created ${projects.length} projects`);

  console.log("Creating modules...");

  const activeProjects = projects.filter((p) => p.status === ProjectStatus.actif);
  const defaultModules = [
    { name: "Auth", estimatedDays: 3 },
    { name: "User", estimatedDays: 2 },
    { name: "Dashboard", estimatedDays: 4 },
    { name: "API Integration", estimatedDays: 5 },
    { name: "Tests & QA", estimatedDays: 3 },
    { name: "Déploiement", estimatedDays: 2 },
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

  console.log("Creating assignments...");

  const assignments = [
    { memberId: "yacine", projectId: "vhse", role: AssignmentRole.lead, allocation: 25, isUrgent: true },
    { memberId: "yacine", projectId: "horus", role: AssignmentRole.lead, allocation: 25, isUrgent: true },
    { memberId: "yacine", projectId: "suivi-encaissement", role: AssignmentRole.contributeur, allocation: 15, isUrgent: false },
    { memberId: "yacine", projectId: "eagence", role: AssignmentRole.contributeur, allocation: 20, isUrgent: false },
    { memberId: "ariel", projectId: "smc-ht", role: AssignmentRole.contributeur, allocation: 20, isUrgent: false },
    { memberId: "ariel", projectId: "divipost-analytics", role: AssignmentRole.contributeur, allocation: 20, isUrgent: false },
    { memberId: "ariel", projectId: "sms", role: AssignmentRole.contributeur, allocation: 15, isUrgent: false },
    { memberId: "ariel", projectId: "alertia", role: AssignmentRole.contributeur, allocation: 15, isUrgent: false },
    { memberId: "ariel", projectId: "eagence", role: AssignmentRole.contributeur, allocation: 20, isUrgent: false },
    { memberId: "yoan", projectId: "horus", role: AssignmentRole.contributeur, allocation: 25, isUrgent: true },
    { memberId: "yoan", projectId: "suivi-encaissement", role: AssignmentRole.contributeur, allocation: 20, isUrgent: false },
    { memberId: "yoan", projectId: "smart-meet", role: AssignmentRole.contributeur, allocation: 20, isUrgent: false },
    { memberId: "yoan", projectId: "eagence", role: AssignmentRole.contributeur, allocation: 20, isUrgent: false },
    { memberId: "venance", projectId: "smc-ht", role: AssignmentRole.contributeur, allocation: 25, isUrgent: false },
    { memberId: "venance", projectId: "smc-terrain", role: AssignmentRole.contributeur, allocation: 25, isUrgent: false },
    { memberId: "venance", projectId: "alertia", role: AssignmentRole.contributeur, allocation: 20, isUrgent: false },
    { memberId: "chacoul", projectId: "smc-ht", role: AssignmentRole.lead, allocation: 25, isUrgent: true },
    { memberId: "chacoul", projectId: "horus", role: AssignmentRole.lead, allocation: 25, isUrgent: true },
    { memberId: "chacoul", projectId: "suivi-encaissement", role: AssignmentRole.contributeur, allocation: 20, isUrgent: false },
    { memberId: "chacoul", projectId: "smc-terrain", role: AssignmentRole.contributeur, allocation: 20, isUrgent: false },
    { memberId: "rico", projectId: "vhse", role: AssignmentRole.lead, allocation: 20, isUrgent: true },
    { memberId: "rico", projectId: "e-performance", role: AssignmentRole.lead, allocation: 20, isUrgent: false },
    { memberId: "rico", projectId: "divipost-analytics", role: AssignmentRole.contributeur, allocation: 15, isUrgent: false },
    { memberId: "rico", projectId: "sms", role: AssignmentRole.contributeur, allocation: 15, isUrgent: false },
    { memberId: "rico", projectId: "smart-meet", role: AssignmentRole.contributeur, allocation: 15, isUrgent: false },
    { memberId: "fernandez", projectId: "horus", role: AssignmentRole.contributeur, allocation: 30, isUrgent: false },
    { memberId: "fernandez", projectId: "sms", role: AssignmentRole.contributeur, allocation: 20, isUrgent: false },
    { memberId: "fernandez", projectId: "alertia", role: AssignmentRole.contributeur, allocation: 20, isUrgent: false },
    { memberId: "derick", projectId: "smc-ht", role: AssignmentRole.contributeur, allocation: 25, isUrgent: false },
    { memberId: "derick", projectId: "smc-terrain", role: AssignmentRole.contributeur, allocation: 25, isUrgent: false },
    { memberId: "malan", projectId: "sms", role: AssignmentRole.lead, allocation: 20, isUrgent: false },
    { memberId: "malan", projectId: "alertia", role: AssignmentRole.lead, allocation: 20, isUrgent: false },
  ];

  for (const assignment of assignments) {
    await prisma.assignment.create({ data: assignment });
  }

  console.log(`Created ${assignments.length} assignments`);
  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
