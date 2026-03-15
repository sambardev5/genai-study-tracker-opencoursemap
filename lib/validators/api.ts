import { z } from "zod";

export const profileUpdateSchema = z.object({
  fullName: z.string().min(2).max(120).optional(),
  headline: z.string().max(180).optional(),
  currentLevel: z.enum(["basic", "amateur", "professional"]).optional(),
  weeklyStudyHours: z.coerce.number().int().min(0).max(80).optional(),
});

export const preferenceUpdateSchema = z.object({
  goalText: z.string().max(400).optional(),
  preferredLevel: z.enum(["basic", "amateur", "professional"]).optional(),
  preferredLanguageCode: z.string().max(12).optional(),
  wantsCertificates: z.boolean().optional(),
  prefersSelfPaced: z.boolean().optional(),
  preferredTopics: z.array(z.string()).max(12).optional(),
  preferredProviders: z.array(z.string()).max(12).optional(),
});

export const courseStatusSchema = z.object({
  status: z.enum(["not_started", "bookmarked", "enrolled_external", "in_progress", "completed"]),
  percentComplete: z.coerce.number().int().min(0).max(100).optional(),
  hoursSpent: z.coerce.number().min(0).max(500).optional(),
  completionNotes: z.string().max(1000).optional(),
  completionEvidenceUrl: z.string().url().max(500).optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  completedAt: z.string().datetime().optional(),
});

export const adminCandidateDecisionSchema = z.object({
  reason: z.string().min(4).max(240).optional(),
});
