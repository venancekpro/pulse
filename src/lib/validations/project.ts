import { z } from "zod";

const moduleSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["default", "custom"]).optional(),
  estimatedDays: z.number().int().positive(),
  completedDays: z.number().int().min(0).optional(),
  status: z.enum(["todo", "in-progress", "review", "done"]).optional(),
});

export const projectCreateSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1).max(32),
  description: z.string().optional(),
  status: z.enum(["actif", "livre", "en-attente", "urgent"]),
  startDate: z.string(),
  deadline: z.string(),
  complexity: z.enum(["faible", "moyenne", "haute", "critique"]),
  customModules: z.array(moduleSchema).optional(),
});

export const projectPatchSchema = projectCreateSchema.partial();

export const moduleCreateSchema = z.object({
  name: z.string().min(1),
  estimatedDays: z.number().int().positive(),
  type: z.enum(["default", "custom"]).optional(),
});
