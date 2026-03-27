import { z } from "zod";

export const memberPatchSchema = z.object({
  loadLevel: z.enum(["critique", "elevee", "moderee", "normale"]).optional(),
  availabilityMargin: z.enum(["large", "disponible", "aucune"]).nullable().optional(),
  isoActionsCompleted: z.number().int().min(0).optional(),
  isoActionsTotal: z.number().int().min(0).optional(),
});
