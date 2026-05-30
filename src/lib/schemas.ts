import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(8),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const passwordSchema = z.object({
  platformName: z.string().min(1),
  websiteUrl: z.string().min(1),
  username: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  password: z.string().min(1),
  notes: z.string().optional().nullable(),
});

export const familySchema = z.object({
  name: z.string().min(1),
  email: z.email().optional().or(z.literal("")),
  relation: z.string().min(1),
});

export const assignmentSchema = z.object({
  familyMemberId: z.string().min(1),
  passwordIds: z.array(z.string().min(1)).min(1),
});

export const apiKeyGenerateSchema = z.object({
  familyMemberId: z.string().min(1),
  expiresAt: z.string().datetime().optional().nullable(),
});

export const extensionLoginSchema = z.object({
  apiKey: z.string().min(1),
  deviceName: z.string().optional(),
  browserName: z.string().optional(),
});

export const extensionPasswordUpdateSchema = z.object({
  passwordId: z.string().min(1),
  password: z.string().min(1),
});
