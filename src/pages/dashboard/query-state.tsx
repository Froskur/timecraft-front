import { ReactNode } from 'react';
import { Alert, Center, Loader, Stack, Text } from '@mantine/core';
import { getErrorMessage } from '@/api/error-message';

interface QueryStateProps {
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  children: ReactNode;
}

export function QueryState({
  isLoading,
  isError,
  error,
  isEmpty,
  emptyTitle = 'Пока пусто',
  emptyDescription = 'Добавьте первую запись.',
  children,
}: QueryStateProps) {
  if (isLoading) {
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );
  }

  if (isError) {
    return (
      <Alert color="red" title="Не удалось загрузить данные">
        {getErrorMessage(error)}
      </Alert>
    );
  }

  if (isEmpty) {
    return (
      <Stack gap="xs" py="xl" align="flex-start">
        <Text fw={600}>{emptyTitle}</Text>
        <Text c="dimmed" size="sm">
          {emptyDescription}
        </Text>
      </Stack>
    );
  }

  return children;
}
