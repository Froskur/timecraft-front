import { notifications } from '@mantine/notifications';
import {
  Organization,
  OrganizationCreate,
  OrganizationList,
  OrganizationUpdate,
} from '@/api/entities';
import { getErrorMessage } from '@/api/error-message';
import {
  createDeleteMutationHook,
  createGetQueryHook,
  createPatchMutationHook,
  createPostMutationHook,
} from '@/api/helpers';
export const useListOrganizations = createGetQueryHook({
  endpoint: 'v1/organizations',
  responseSchema: OrganizationList,
  rQueryParams: {
    queryKey: ['organizations'],
  },
});

export const useCreateOrganization = createPostMutationHook({
  endpoint: 'v1/organizations',
  bodySchema: OrganizationCreate,
  responseSchema: Organization,
  rMutationParams: {
    onSuccess: (_d, _v, _c, qc) => {
      qc.invalidateQueries({ queryKey: ['organizations'] });
      notifications.show({ message: 'Организация создана' });
    },
    onError: (error) => notifications.show({ message: getErrorMessage(error), color: 'red' }),
  },
});

export const useUpdateOrganization = createPatchMutationHook({
  endpoint: 'v1/organizations/:organizationId',
  bodySchema: OrganizationUpdate,
  responseSchema: Organization,
  rMutationParams: {
    onSuccess: (_d, _v, _c, qc) => {
      qc.invalidateQueries({ queryKey: ['organizations'] });
      notifications.show({ message: 'Организация обновлена' });
    },
    onError: (error) => notifications.show({ message: getErrorMessage(error), color: 'red' }),
  },
});

export const useDeleteOrganization = createDeleteMutationHook({
  endpoint: 'v1/organizations/:organizationId',
  rMutationParams: {
    onSuccess: (_d, _v, _c, qc) => {
      qc.invalidateQueries({ queryKey: ['organizations'] });
      notifications.show({ message: 'Организация удалена' });
    },
    onError: (error) => notifications.show({ message: getErrorMessage(error), color: 'red' }),
  },
});
