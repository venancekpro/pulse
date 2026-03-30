import { z } from "zod";

export const leaveCreateSchema = z.object({
  memberId: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  type: z.enum(["conge", "maladie", "formation", "autre"]).default("conge"),
  description: z.string().optional(),
});

export const leavePatchSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  type: z.enum(["conge", "maladie", "formation", "autre"]).optional(),
  description: z.string().nullable().optional(),
});
