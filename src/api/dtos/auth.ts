import { z } from 'zod';

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  remember: z.boolean().optional(),
});

export const LoginResponseSchema = z
  .object({
    type: z.string().optional(),
    token: z.string(),
    accessToken: z.string().optional(),
    expiresAt: z.union([z.string(), z.number()]).optional(),
    accountId: z.string().optional(),
  })
  .transform((data) => ({
    type: data.type ?? 'bearer',
    token: data.token || data.accessToken || '',
    expiresAt: data.expiresAt,
    accountId: data.accountId,
  }));
