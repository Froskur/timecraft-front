import { z } from 'zod';

export const OrganizationStatus = z.enum(['active', 'archived']);

export const Organization = z.object({
  id: z.string().uuid(),
  accountId: z.string().uuid(),
  name: z.string(),
  status: OrganizationStatus,
  createdAt: z.string(),
  updatedAt: z.string().nullable().optional(),
});

export type Organization = z.infer<typeof Organization>;

export const OrganizationCreate = z.object({
  name: z.string().min(1),
});

export type OrganizationCreate = z.infer<typeof OrganizationCreate>;

export const OrganizationUpdate = z.object({
  name: z.string().min(1).optional(),
  status: OrganizationStatus.optional(),
});

export type OrganizationUpdate = z.infer<typeof OrganizationUpdate>;

export const OrganizationList = z.object({
  items: z.array(Organization),
  nextCursor: z.string().nullable().optional(),
});

export type OrganizationList = z.infer<typeof OrganizationList>;
