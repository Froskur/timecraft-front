import { notifications } from '@mantine/notifications';
import { Account, AccountUpdate, User } from '@/api/entities';
import { getErrorMessage } from '@/api/error-message';
import { createGetQueryHook, createPatchMutationHook } from '@/api/helpers';

export const useGetCurrentUser = createGetQueryHook({
  endpoint: 'v1/auth/me',
  responseSchema: User,
  rQueryParams: {
    queryKey: ['auth-me'],
    retry: false,
  },
});

export const useGetAccountInfo = createGetQueryHook({
  endpoint: 'v1/account',
  responseSchema: Account,
  rQueryParams: {
    queryKey: ['account'],
    retry: false,
  },
});

export const useUpdateAccount = createPatchMutationHook({
  endpoint: 'v1/account',
  bodySchema: AccountUpdate,
  responseSchema: Account,
  rMutationParams: {
    onSuccess: (_data, _vars, _ctx, queryClient) => {
      queryClient.invalidateQueries({ queryKey: ['account'] });
      notifications.show({ message: 'Аккаунт сохранён' });
    },
    onError: (error) => {
      notifications.show({ message: getErrorMessage(error), color: 'red' });
    },
  },
});
