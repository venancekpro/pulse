export type UserRole = "admin" | "viewer";
export type LoadLevel = "critique" | "elevee" | "moderee" | "normale";
export type Pole = "front" | "back" | "devops" | "ux-ui";
export type ProjectStatus = "actif" | "livre" | "en-attente" | "urgent";
export type ModuleStatus = "todo" | "in-progress" | "review" | "done";
export type ModuleType = "default" | "custom";
export type AssignmentRole = "lead" | "contributeur";
export type ProjectComplexity = "faible" | "moyenne" | "haute" | "critique";
export type AvailabilityMargin = "large" | "disponible" | "aucune";

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

export interface Member {
  id: string;
  name: string;
  pole: Pole;
  roles: string[];
  loadLevel: LoadLevel;
  transversalRoles: string[];
  isoActions?: { completed: number; total: number };
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
  customModules?: Omit<Module, "id" | "projectId" | "createdAt" | "updatedAt">[];
}

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

export interface Assignment {
  id: string;
  memberId: string;
  member?: Member;
  projectId: string;
  project?: Project;
  role: AssignmentRole;
  allocation: number;
  isUrgent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

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
  recommendation: "ok" | "warning" | "critical";
  conflictingDeadlines: { projectName: string; deadline: Date }[];
}

export interface Recommendation {
  type: "alternative_member" | "reduce_allocation" | "delay_project" | "split_assignment";
  memberId?: string;
  memberName?: string;
  reason: string;
  suggestedAllocation?: number;
}

export interface Warning {
  type: "overload" | "deadline_conflict" | "bottleneck" | "single_point_failure";
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  affectedMembers?: string[];
}

export interface SimulationSummary {
  totalMembersAffected: number;
  membersEnteringOverload: number;
  averageLoadIncrease: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  canProceed: boolean;
}

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

export type Permission =
  | "VIEW_DASHBOARD"
  | "VIEW_TEAM"
  | "VIEW_PROJECTS"
  | "VIEW_TIMELINE"
  | "VIEW_REPORTS"
  | "CREATE_PROJECT"
  | "EDIT_PROJECT"
  | "DELETE_PROJECT"
  | "ASSIGN_MEMBERS"
  | "USE_SIMULATOR"
  | "RUN_SIMULATION"
  | "EDIT_MEMBER_LOAD"
  | "EXPORT_REPORTS"
  | "MANAGE_USERS";

export type NotificationType = "assignment_added" | "assignment_removed" | "assignment_reassigned";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, unknown>;
  isRead: boolean;
  createdAt: Date;
}

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

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  name: string;
  memberId?: string;
}
