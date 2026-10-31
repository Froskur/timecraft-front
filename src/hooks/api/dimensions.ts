import { notifications } from '@mantine/notifications';
import {
  Dimension,
  DimensionCreate,
  DimensionList,
  DimensionUpdate,
  DimensionValue,
  DimensionValueCreate,
  DimensionValueList,
  DimensionValueUpdate,
} from '@/api/entities';
import { getErrorMessage } from '@/api/error-message';
import {
  createDeleteMutationHook,
  createGetQueryHook,
  createPatchMutationHook,
  createPostMutationHook,
} from '@/api/helpers';

export const useListDimensions = createGetQueryHook({
  endpoint: '/v1/dimensions',
  responseSchema: DimensionList,
  rQueryParams: {
    queryKey: ['dimensions'],
  },
});

export const useCreateDimension = createPostMutationHook({
  endpoint: '/v1/dimensions',
  bodySchema: DimensionCreate,
  responseSchema: Dimension,
  rMutationParams: {
    onSuccess: (_d, _v, _c, qc) => {
      qc.invalidateQueries({ queryKey: ['dimensions'] });
      notifications.show({ message: 'Разрез создан' });
    },
    onError: (error) => notifications.show({ message: getErrorMessage(error), color: 'red' }),
  },
});

export const useUpdateDimension = createPatchMutationHook({
  endpoint: '/v1/dimensions/:dimensionId',
  bodySchema: DimensionUpdate,
  responseSchema: Dimension,
  rMutationParams: {
    onSuccess: (_d, _v, _c, qc) => {
      qc.invalidateQueries({ queryKey: ['dimensions'] });
      notifications.show({ message: 'Разрез обновлён' });
    },
    onError: (error) => notifications.show({ message: getErrorMessage(error), color: 'red' }),
  },
});

export const useDeleteDimension = createDeleteMutationHook({
  endpoint: '/v1/dimensions/:dimensionId',
  rMutationParams: {
    onSuccess: (_d, _v, _c, qc) => {
      qc.invalidateQueries({ queryKey: ['dimensions'] });
      qc.invalidateQueries({ queryKey: ['dimension-values'] });
      notifications.show({ message: 'Разрез удалён' });
    },
    onError: (error) => notifications.show({ message: getErrorMessage(error), color: 'red' }),
  },
});

export const useListDimensionValues = createGetQueryHook<
  typeof DimensionValueList,
  { dimensionId: string }
>({
  endpoint: '/v1/dimensions/:dimensionId/values',
  responseSchema: DimensionValueList,
  rQueryParams: {
    queryKey: ['dimension-values'],
  },
});

export const useCreateDimensionValue = createPostMutationHook<
  typeof DimensionValueCreate,
  typeof DimensionValue,
  { dimensionId: string }
>({
  endpoint: '/v1/dimensions/:dimensionId/values',
  bodySchema: DimensionValueCreate,
  responseSchema: DimensionValue,
  rMutationParams: {
    onSuccess: (_d, _v, _c, qc) => {
      qc.invalidateQueries({ queryKey: ['dimension-values'] });
      notifications.show({ message: 'Значение создано' });
    },
    onError: (error) => notifications.show({ message: getErrorMessage(error), color: 'red' }),
  },
});

export const useUpdateDimensionValue = createPatchMutationHook<
  typeof DimensionValueUpdate,
  typeof DimensionValue,
  { dimensionValueId: string }
>({
  endpoint: '/v1/dimension-values/:dimensionValueId',
  bodySchema: DimensionValueUpdate,
  responseSchema: DimensionValue,
  rMutationParams: {
    onSuccess: (_d, _v, _c, qc) => {
      qc.invalidateQueries({ queryKey: ['dimension-values'] });
      notifications.show({ message: 'Значение обновлено' });
    },
    onError: (error) => notifications.show({ message: getErrorMessage(error), color: 'red' }),
  },
});

export const useDeleteDimensionValue = createDeleteMutationHook({
  endpoint: '/v1/dimension-values/:dimensionValueId',
  rMutationParams: {
    onSuccess: (_d, _v, _c, qc) => {
      qc.invalidateQueries({ queryKey: ['dimension-values'] });
      qc.invalidateQueries({ queryKey: ['resources'] });
      notifications.show({ message: 'Значение удалено' });
    },
    onError: (error) => notifications.show({ message: getErrorMessage(error), color: 'red' }),
  },
});
