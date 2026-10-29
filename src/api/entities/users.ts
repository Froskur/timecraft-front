import { z } from 'zod';

export const UserRole = z.enum(['owner', 'admin', 'receptionist', 'readonly']);

export const User = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  displayName: z.string().nullable().optional(),
  accountId: z.string().uuid(),
  role: UserRole,
  locationIds: z.array(z.string().uuid()).optional(),
});

export type User = z.infer<typeof User>;
