import { notifications } from '@mantine/notifications';
import { Staff, StaffCreate, StaffList, StaffUpdate } from '@/api/entities';
import { getErrorMessage } from '@/api/error-message';
import {
  createDeleteMutationHook,
  createGetQueryHook,
  createPatchMutationHook,
  createPostMutationHook,
} from '@/api/helpers';
export const useListStaff = createGetQueryHook({
  endpoint: 'v1/staff',
  responseSchema: StaffList,
  rQueryParams: {
    queryKey: ['staff'],
  },
});

export const useCreateStaff = createPostMutationHook({
  endpoint: 'v1/staff',
  bodySchema: StaffCreate,
  responseSchema: Staff,
  rMutationParams: {
    onSuccess: (_d, _v, _c, qc) => {
      qc.invalidateQueries({ queryKey: ['staff'] });
      notifications.show({ message: 'Сотрудник создан' });
    },
    onError: (error) => notifications.show({ message: getErrorMessage(error), color: 'red' }),
  },
});

export const useUpdateStaff = createPatchMutationHook({
  endpoint: 'v1/staff/:staffId',
  bodySchema: StaffUpdate,
  responseSchema: Staff,
  rMutationParams: {
    onSuccess: (_d, _v, _c, qc) => {
      qc.invalidateQueries({ queryKey: ['staff'] });
      notifications.show({ message: 'Сотрудник обновлён' });
    },
    onError: (error) => notifications.show({ message: getErrorMessage(error), color: 'red' }),
  },
});

export const useDeleteStaff = createDeleteMutationHook({
  endpoint: 'v1/staff/:staffId',
  rMutationParams: {
    onSuccess: (_d, _v, _c, qc) => {
      qc.invalidateQueries({ queryKey: ['staff'] });
      notifications.show({ message: 'Сотрудник удалён' });
    },
    onError: (error) => notifications.show({ message: getErrorMessage(error), color: 'red' }),
  },
});
