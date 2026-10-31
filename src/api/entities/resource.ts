import { z } from 'zod';

export const ResourceStatus = z.enum(['active', 'archived']);

export const ResourceKind = z.enum(['person', 'room', 'equipment', 'other']);

export const Resource = z.object({
  id: z.string().uuid(),
  accountId: z.string().uuid(),
  kind: ResourceKind,
  name: z.string(),
  displayName: z.string().nullable().optional(),
  code: z.string().nullable().optional(),
  dimensionValueIds: z.array(z.string().uuid()),
  status: ResourceStatus,
  createdAt: z.string(),
  updatedAt: z.string().nullable().optional(),
});

export type Resource = z.infer<typeof Resource>;
export type ResourceKind = z.infer<typeof ResourceKind>;

export const ResourceCreate = z.object({
  kind: ResourceKind,
  name: z.string().min(1),
  displayName: z.string().optional(),
  code: z.string().optional(),
  dimensionValueIds: z.array(z.string().uuid()).optional(),
});

export type ResourceCreate = z.infer<typeof ResourceCreate>;

export const ResourceUpdate = z.object({
  kind: ResourceKind.optional(),
  name: z.string().min(1).optional(),
  displayName: z.string().nullable().optional(),
  code: z.string().nullable().optional(),
  status: ResourceStatus.optional(),
});

export type ResourceUpdate = z.infer<typeof ResourceUpdate>;

export const ResourceDimensionValues = z.object({
  dimensionValueIds: z.array(z.string().uuid()),
});

export type ResourceDimensionValues = z.infer<typeof ResourceDimensionValues>;

export const ResourceList = z.object({
  items: z.array(Resource),
  nextCursor: z.string().nullable().optional(),
});

export type ResourceList = z.infer<typeof ResourceList>;
