import { notifications } from '@mantine/notifications';
import {
  removeClientAccessToken,
  removeClientAccountId,
  setClientAccessToken,
  setClientAccountId,
} from '@/api/axios';
import { LoginRequestSchema, LoginResponseSchema } from '@/api/dtos';
import { getErrorMessage } from '@/api/error-message';
import { createPostMutationHook } from '@/api/helpers';

export const useLogin = createPostMutationHook({
  endpoint: '/v1/auth/login',
  bodySchema: LoginRequestSchema,
  responseSchema: LoginResponseSchema,
  rMutationParams: {
    onSuccess: (data) => {
      setClientAccessToken(data.token);
      setClientAccountId(data.accountId);
      notifications.show({
        title: 'Вход выполнен',
        message: 'Сессия сохранена (токен и аккаунт)',
      });
    },
    onError: (error) => {
      notifications.show({ message: getErrorMessage(error, 'Не удалось войти'), color: 'red' });
    },
  },
});

/** Local logout — API has no /v1/auth/logout in wave 1. */
export function useLogout() {
  return {
    mutate: (
      _args: { variables: null },
      options?: { onSuccess?: () => void; onError?: () => void }
    ) => {
      removeClientAccessToken();
      removeClientAccountId();
      sessionStorage.removeItem('timecraft_shell_preview');
      notifications.show({ title: 'Выход', message: 'Сессия очищена' });
      options?.onSuccess?.();
    },
    isPending: false,
  };
}
