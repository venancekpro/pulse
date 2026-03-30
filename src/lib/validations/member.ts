import { z } from "zod";

const memberSkillSchema = z.object({
  name: z.string().min(1),
  level: z.number().int().min(1).max(3),
});

export const memberPatchSchema = z.object({
  loadLevel: z.enum(["critique", "elevee", "moderee", "normale"]).optional(),
  availabilityMargin: z.enum(["large", "disponible", "aucune"]).nullable().optional(),
  isoActionsCompleted: z.number().int().min(0).optional(),
  isoActionsTotal: z.number().int().min(0).optional(),
  skills: z.array(memberSkillSchema).optional(),
});
