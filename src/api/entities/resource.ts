import { z } from 'zod';

export const ResourceStatus = z.enum(['active', 'archived']);

export const Resource = z.object({
  id: z.string().uuid(),
  accountId: z.string().uuid(),
  organizationId: z.string().uuid().nullable().optional(),
  locationId: z.string().uuid().nullable().optional(),
  name: z.string(),
  displayName: z.string().nullable().optional(),
  code: z.string().nullable().optional(),
  status: ResourceStatus,
  createdAt: z.string(),
  updatedAt: z.string().nullable().optional(),
});

export type Resource = z.infer<typeof Resource>;

export const ResourceCreate = z.object({
  organizationId: z.string().uuid().nullable().optional(),
  locationId: z.string().uuid().nullable().optional(),
  name: z.string().min(1),
  displayName: z.string().optional(),
  code: z.string().optional(),
});

export type ResourceCreate = z.infer<typeof ResourceCreate>;

export const ResourceUpdate = z.object({
  organizationId: z.string().uuid().nullable().optional(),
  locationId: z.string().uuid().nullable().optional(),
  name: z.string().min(1).optional(),
  displayName: z.string().nullable().optional(),
  code: z.string().nullable().optional(),
  status: ResourceStatus.optional(),
});

export type ResourceUpdate = z.infer<typeof ResourceUpdate>;

export const ResourceList = z.object({
  items: z.array(Resource),
  nextCursor: z.string().nullable().optional(),
});

export type ResourceList = z.infer<typeof ResourceList>;
