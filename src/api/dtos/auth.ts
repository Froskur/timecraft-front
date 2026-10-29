import { z } from 'zod';

export const LoginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  remember: z.boolean().optional(),
});

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  accountId: z.string().uuid().optional(),
});

export const LoginResponseSchema = z
  .object({
    accessToken: z.string(),
    refreshToken: z.string().optional(),
    expiresIn: z.number().optional(),
    tokenType: z.string().optional(),
    accountId: z.string().uuid(),
    // tolerate older shapes
    token: z.string().optional(),
  })
  .transform((data) => ({
    token: data.accessToken || data.token || '',
    refreshToken: data.refreshToken,
    expiresIn: data.expiresIn,
    tokenType: data.tokenType ?? 'Bearer',
    accountId: data.accountId,
  }));
