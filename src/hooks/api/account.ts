import { User } from '@/api/entities';
import { createGetQueryHook } from '@/api/helpers';
import { app } from '@/config';

export const useGetAccountInfo = createGetQueryHook({
  endpoint: 'v1/account',
  responseSchema: User,
  rQueryParams: {
    queryKey: ['account'],
    retry: false,
    enabled:
      typeof window !== 'undefined' && !!localStorage.getItem(app.accessTokenStoreKey),
  },
});
