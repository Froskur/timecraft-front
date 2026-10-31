import { z } from 'zod';

export const DimensionValueStatus = z.enum(['active', 'archived']);

export const DimensionValue = z.object({
  id: z.string().uuid(),
  accountId: z.string().uuid(),
  dimensionId: z.string().uuid(),
  name: z.string(),
  code: z.string().nullable().optional(),
  status: DimensionValueStatus,
  createdAt: z.string(),
  updatedAt: z.string().nullable().optional(),
});

export type DimensionValue = z.infer<typeof DimensionValue>;

export const DimensionValueCreate = z.object({
  name: z.string().min(1),
  code: z.string().optional(),
});

export type DimensionValueCreate = z.infer<typeof DimensionValueCreate>;

export const DimensionValueUpdate = z.object({
  name: z.string().min(1).optional(),
  code: z.string().nullable().optional(),
  status: DimensionValueStatus.optional(),
});

export type DimensionValueUpdate = z.infer<typeof DimensionValueUpdate>;

export const DimensionValueList = z.object({
  items: z.array(DimensionValue),
  nextCursor: z.string().nullable().optional(),
});

export type DimensionValueList = z.infer<typeof DimensionValueList>;
