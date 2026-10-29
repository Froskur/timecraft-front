import { z } from 'zod';

export const LocationStatus = z.enum(['active', 'archived']);

export const Location = z.object({
  id: z.string().uuid(),
  accountId: z.string().uuid(),
  organizationId: z.string().uuid().nullable().optional(),
  name: z.string(),
  timezone: z.string(),
  address: z.string().nullable().optional(),
  status: LocationStatus,
  createdAt: z.string(),
  updatedAt: z.string().nullable().optional(),
});

export type Location = z.infer<typeof Location>;

export const LocationCreate = z.object({
  organizationId: z.string().uuid().nullable().optional(),
  name: z.string().min(1),
  timezone: z.string().min(1),
  address: z.string().optional(),
});

export type LocationCreate = z.infer<typeof LocationCreate>;

export const LocationUpdate = z.object({
  organizationId: z.string().uuid().nullable().optional(),
  name: z.string().min(1).optional(),
  timezone: z.string().optional(),
  address: z.string().nullable().optional(),
  status: LocationStatus.optional(),
});

export type LocationUpdate = z.infer<typeof LocationUpdate>;

export const LocationList = z.object({
  items: z.array(Location),
  nextCursor: z.string().nullable().optional(),
});

export type LocationList = z.infer<typeof LocationList>;
