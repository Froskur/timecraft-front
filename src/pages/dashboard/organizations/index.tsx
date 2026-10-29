import { useState } from 'react';
import { Button, Group, Modal, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import { Organization } from '@/api/entities';
import { AddButton } from '@/components/add-button';
import { DataTable } from '@/components/data-table';
import { Page } from '@/components/page';
import { PageHeader } from '@/components/page-header';
import {
  useCreateOrganization,
  useDeleteOrganization,
  useListOrganizations,
  useUpdateOrganization,
} from '@/hooks';
import { QueryState } from '../query-state';

type FormValues = { name: string };

export default function OrganizationsPage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useListOrganizations();
  const { mutate: createOrg, isPending: creating } = useCreateOrganization();
  const { mutate: updateOrg, isPending: updating } = useUpdateOrganization();
  const { mutate: deleteOrg } = useDeleteOrganization();

  const [opened, setOpened] = useState(false);
  const [editing, setEditing] = useState<Organization | null>(null);

  const form = useForm<FormValues>({
    initialValues: { name: '' },
    validate: {
      name: (v) => (v.trim() ? null : 'Укажите название'),
    },
  });

  const openCreate = () => {
    setEditing(null);
    form.setValues({ name: '' });
    setOpened(true);
  };

  const openEdit = (item: Organization) => {
    setEditing(item);
    form.setValues({ name: item.name });
    setOpened(true);
  };

  const close = () => {
    setOpened(false);
    setEditing(null);
    form.reset();
  };

  const handleSubmit = form.onSubmit((values) => {
    if (editing) {
      updateOrg(
        { variables: { name: values.name.trim() }, route: { organizationId: editing.id } },
        { onSuccess: close }
      );
    } else {
      createOrg({ variables: { name: values.name.trim() } }, { onSuccess: close });
    }
  });

  const confirmDelete = (item: Organization) => {
    modals.openConfirmModal({
      title: 'Удалить организацию?',
      children: <Text size="sm">«{item.name}» будет удалена из справочника.</Text>,
      labels: { confirm: 'Удалить', cancel: 'Отмена' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteOrg({ model: item, route: { organizationId: item.id } }),
    });
  };

  const items = data?.items ?? [];

  return (
    <Page title="Организации">
      <PageHeader title="Организации">
        <Group>
          <Button variant="default" onClick={() => refetch()} loading={isFetching}>
            Обновить
          </Button>
          <AddButton onClick={openCreate}>Добавить</AddButton>
        </Group>
      </PageHeader>

      <Text c="dimmed" mb="md" maw={520}>
        Опциональные организации внутри аккаунта. Можно работать и без них.
      </Text>

      <QueryState
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={!isLoading && !isError && items.length === 0}
        emptyTitle="Организаций пока нет"
        emptyDescription="Нажмите «Добавить», чтобы создать первую."
      >
        <DataTable.Container>
          <DataTable.Table
            records={items}
            idAccessor="id"
            columns={[
              { accessor: 'name', title: 'Название' },
              { accessor: 'status', title: 'Статус', width: 120 },
              {
                accessor: 'actions',
                title: '',
                width: 100,
                render: (row) => (
                  <DataTable.Actions
                    onEdit={() => openEdit(row)}
                    onDelete={() => confirmDelete(row)}
                  />
                ),
              },
            ]}
          />
        </DataTable.Container>
      </QueryState>

      <Modal
        opened={opened}
        onClose={close}
        title={editing ? 'Редактировать организацию' : 'Новая организация'}
      >
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput label="Название" required {...form.getInputProps('name')} />
            <Group justify="flex-end">
              <Button variant="default" onClick={close}>
                Отмена
              </Button>
              <Button type="submit" loading={creating || updating}>
                Сохранить
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Page>
  );
}
