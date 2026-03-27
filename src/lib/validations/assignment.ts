import { z } from "zod";

export const assignmentCreateSchema = z.object({
  memberId: z.string().min(1),
  role: z.enum(["lead", "contributeur"]).default("contributeur"),
  allocation: z.number().int().min(1).max(100),
  isUrgent: z.boolean().default(false),
});

export const assignmentPatchSchema = z.object({
  role: z.enum(["lead", "contributeur"]).optional(),
  allocation: z.number().int().min(1).max(100).optional(),
  isUrgent: z.boolean().optional(),
});

export const reassignSchema = z.object({
  newMemberId: z.string().min(1),
  role: z.enum(["lead", "contributeur"]).optional(),
  allocation: z.number().int().min(1).max(100).optional(),
});
