import { notifications } from '@mantine/notifications';
import { Resource, ResourceCreate, ResourceList, ResourceUpdate } from '@/api/entities';
import { getErrorMessage } from '@/api/error-message';
import {
  createDeleteMutationHook,
  createGetQueryHook,
  createPatchMutationHook,
  createPostMutationHook,
} from '@/api/helpers';
export const useListResources = createGetQueryHook({
  endpoint: 'v1/resources',
  responseSchema: ResourceList,
  rQueryParams: {
    queryKey: ['resources'],
  },
});

export const useCreateResource = createPostMutationHook({
  endpoint: 'v1/resources',
  bodySchema: ResourceCreate,
  responseSchema: Resource,
  rMutationParams: {
    onSuccess: (_d, _v, _c, qc) => {
      qc.invalidateQueries({ queryKey: ['resources'] });
      notifications.show({ message: 'Ресурс создан' });
    },
    onError: (error) => notifications.show({ message: getErrorMessage(error), color: 'red' }),
  },
});

export const useUpdateResource = createPatchMutationHook({
  endpoint: 'v1/resources/:resourceId',
  bodySchema: ResourceUpdate,
  responseSchema: Resource,
  rMutationParams: {
    onSuccess: (_d, _v, _c, qc) => {
      qc.invalidateQueries({ queryKey: ['resources'] });
      notifications.show({ message: 'Ресурс обновлён' });
    },
    onError: (error) => notifications.show({ message: getErrorMessage(error), color: 'red' }),
  },
});

export const useDeleteResource = createDeleteMutationHook({
  endpoint: 'v1/resources/:resourceId',
  rMutationParams: {
    onSuccess: (_d, _v, _c, qc) => {
      qc.invalidateQueries({ queryKey: ['resources'] });
      notifications.show({ message: 'Ресурс удалён' });
    },
    onError: (error) => notifications.show({ message: getErrorMessage(error), color: 'red' }),
  },
});
