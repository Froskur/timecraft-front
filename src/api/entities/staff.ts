import { z } from 'zod';

export const StaffStatus = z.enum(['active', 'archived']);

export const Staff = z.object({
  id: z.string().uuid(),
  accountId: z.string().uuid(),
  fullName: z.string(),
  displayName: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  organizationIds: z.array(z.string().uuid()),
  locationIds: z.array(z.string().uuid()),
  status: StaffStatus,
  createdAt: z.string(),
  updatedAt: z.string().nullable().optional(),
});

export type Staff = z.infer<typeof Staff>;

export const StaffCreate = z.object({
  fullName: z.string().min(1),
  displayName: z.string().optional(),
  email: z.union([z.string().email(), z.literal('')]).optional(),
  organizationIds: z.array(z.string().uuid()).optional(),
  locationIds: z.array(z.string().uuid()).optional(),
});

export type StaffCreate = z.infer<typeof StaffCreate>;

export const StaffUpdate = z.object({
  fullName: z.string().min(1).optional(),
  displayName: z.string().nullable().optional(),
  email: z.union([z.string().email(), z.literal(''), z.null()]).optional(),
  status: StaffStatus.optional(),
});

export type StaffUpdate = z.infer<typeof StaffUpdate>;

export const StaffList = z.object({
  items: z.array(Staff),
  nextCursor: z.string().nullable().optional(),
});

export type StaffList = z.infer<typeof StaffList>;
