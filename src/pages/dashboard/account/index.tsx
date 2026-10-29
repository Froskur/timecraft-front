import { useEffect } from 'react';
import { Alert, Button, Group, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Page } from '@/components/page';
import { PageHeader } from '@/components/page-header';
import { useGetAccountInfo, useUpdateAccount } from '@/hooks';
import { QueryState } from '../query-state';

export default function AccountPage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useGetAccountInfo();
  const { mutate: updateAccount, isPending } = useUpdateAccount();

  const form = useForm({
    initialValues: {
      name: '',
      timezone: '',
      locale: '',
    },
  });

  useEffect(() => {
    if (data) {
      form.setValues({
        name: data.name,
        timezone: data.timezone,
        locale: data.locale ?? '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.id, data?.updatedAt]);

  const handleSubmit = form.onSubmit((values) => {
    updateAccount({
      variables: {
        name: values.name.trim(),
        timezone: values.timezone.trim(),
        locale: values.locale.trim() || undefined,
      },
    });
  });

  return (
    <Page title="Аккаунт">
      <PageHeader title="Аккаунт">
        <Button variant="default" onClick={() => refetch()} loading={isFetching}>
          Обновить
        </Button>
      </PageHeader>

      <Text c="dimmed" mb="md" maw={480}>
        Текущий SaaS-аккаунт. Можно изменить название, часовой пояс и локаль.
      </Text>

      <QueryState isLoading={isLoading} isError={isError} error={error}>
        {data && (
          <form onSubmit={handleSubmit}>
            <Stack maw={480} gap="md">
              <Alert color="gray" variant="light">
                <Text size="sm">
                  ID: <code>{data.id}</code>
                </Text>
                <Text size="sm">Статус: {data.status}</Text>
              </Alert>

              <TextInput label="Название" required {...form.getInputProps('name')} />
              <TextInput
                label="Часовой пояс (IANA)"
                required
                placeholder="Europe/Moscow"
                {...form.getInputProps('timezone')}
              />
              <TextInput label="Локаль" placeholder="ru-RU" {...form.getInputProps('locale')} />

              <Group>
                <Button type="submit" loading={isPending}>
                  Сохранить
                </Button>
              </Group>
            </Stack>
          </form>
        )}
      </QueryState>
    </Page>
  );
}
