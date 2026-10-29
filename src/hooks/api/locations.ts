import { notifications } from '@mantine/notifications';
import { Location, LocationCreate, LocationList, LocationUpdate } from '@/api/entities';
import { getErrorMessage } from '@/api/error-message';
import {
  createDeleteMutationHook,
  createGetQueryHook,
  createPatchMutationHook,
  createPostMutationHook,
} from '@/api/helpers';
export const useListLocations = createGetQueryHook({
  endpoint: 'v1/locations',
  responseSchema: LocationList,
  rQueryParams: {
    queryKey: ['locations'],
  },
});

export const useCreateLocation = createPostMutationHook({
  endpoint: 'v1/locations',
  bodySchema: LocationCreate,
  responseSchema: Location,
  rMutationParams: {
    onSuccess: (_d, _v, _c, qc) => {
      qc.invalidateQueries({ queryKey: ['locations'] });
      notifications.show({ message: 'Площадка создана' });
    },
    onError: (error) => notifications.show({ message: getErrorMessage(error), color: 'red' }),
  },
});

export const useUpdateLocation = createPatchMutationHook({
  endpoint: 'v1/locations/:locationId',
  bodySchema: LocationUpdate,
  responseSchema: Location,
  rMutationParams: {
    onSuccess: (_d, _v, _c, qc) => {
      qc.invalidateQueries({ queryKey: ['locations'] });
      notifications.show({ message: 'Площадка обновлена' });
    },
    onError: (error) => notifications.show({ message: getErrorMessage(error), color: 'red' }),
  },
});

export const useDeleteLocation = createDeleteMutationHook({
  endpoint: 'v1/locations/:locationId',
  rMutationParams: {
    onSuccess: (_d, _v, _c, qc) => {
      qc.invalidateQueries({ queryKey: ['locations'] });
      notifications.show({ message: 'Площадка удалена' });
    },
    onError: (error) => notifications.show({ message: getErrorMessage(error), color: 'red' }),
  },
});
