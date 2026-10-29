import { z } from 'zod';
import { notifications } from '@mantine/notifications';
import {
  removeClientAccessToken,
  removeClientAccountId,
  setClientAccessToken,
  setClientAccountId,
} from '@/api/axios';
import { LoginRequestSchema, LoginResponseSchema } from '@/api/dtos';
import { createPostMutationHook } from '@/api/helpers';

export const useLogin = createPostMutationHook({
  endpoint: 'v1/auth/login',
  bodySchema: LoginRequestSchema,
  responseSchema: LoginResponseSchema,
  rMutationParams: {
    onSuccess: (data) => {
      setClientAccessToken(data.token);
      if (data.accountId) {
        setClientAccountId(data.accountId);
      }
      notifications.show({ title: 'Welcome back!', message: 'You have successfully logged in' });
    },
    onError: (error) => {
      notifications.show({ message: error.message, color: 'red' });
    },
  },
});

export const useLogout = createPostMutationHook({
  endpoint: 'v1/auth/logout',
  bodySchema: z.null(),
  responseSchema: z.any(),
  rMutationParams: {
    onSuccess: () => {
      removeClientAccessToken();
      removeClientAccountId();
      notifications.show({ title: 'Goodbye!', message: 'You have successfully logged out' });
    },
    onError: (error) => {
      removeClientAccessToken();
      removeClientAccountId();
      notifications.show({ message: error.message, color: 'red' });
    },
  },
});
