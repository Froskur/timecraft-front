import { z } from 'zod';

export const User = z.object({
  id: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')).optional(),
  name: z.string().optional(),
  displayName: z.string().optional(),
  avatarUrl: z.string().url().nullable().optional(),
}).passthrough();

export type User = z.infer<typeof User>;
