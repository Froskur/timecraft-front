import { z } from 'zod';

export const AccountStatus = z.enum(['active', 'suspended']);

export const Account = z.object({
  id: z.string().uuid(),
  name: z.string(),
  status: AccountStatus,
  timezone: z.string(),
  locale: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string().nullable().optional(),
});

export type Account = z.infer<typeof Account>;

export const AccountUpdate = z.object({
  name: z.string().min(1).optional(),
  timezone: z.string().optional(),
  locale: z.string().optional(),
});

export type AccountUpdate = z.infer<typeof AccountUpdate>;
