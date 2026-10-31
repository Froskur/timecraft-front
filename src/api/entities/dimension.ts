import { z } from 'zod';

export const DimensionStatus = z.enum(['active', 'archived']);

export const DimensionPreset = z.enum(['organization', 'location', 'role']);

export const Dimension = z.object({
  id: z.string().uuid(),
  accountId: z.string().uuid(),
  key: z.string(),
  name: z.string(),
  preset: DimensionPreset.nullable().optional(),
  status: DimensionStatus,
  createdAt: z.string(),
  updatedAt: z.string().nullable().optional(),
});

export type Dimension = z.infer<typeof Dimension>;
export type DimensionPreset = z.infer<typeof DimensionPreset>;

export const DimensionCreate = z
  .object({
    name: z.string().min(1),
    key: z.string().min(1).optional(),
    preset: DimensionPreset.optional(),
  })
  .superRefine((value, ctx) => {
    if (!value.preset && !value.key?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Укажите ключ или выберите пресет',
        path: ['key'],
      });
    }
  });

export type DimensionCreate = z.infer<typeof DimensionCreate>;

export const DimensionUpdate = z.object({
  name: z.string().min(1).optional(),
  status: DimensionStatus.optional(),
});

export type DimensionUpdate = z.infer<typeof DimensionUpdate>;

export const DimensionList = z.object({
  items: z.array(Dimension),
  nextCursor: z.string().nullable().optional(),
});

export type DimensionList = z.infer<typeof DimensionList>;
