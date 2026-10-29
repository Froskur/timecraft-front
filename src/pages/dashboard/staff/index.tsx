import { useState } from 'react';
import { Button, Group, Modal, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import { Staff } from '@/api/entities';
import { AddButton } from '@/components/add-button';
import { DataTable } from '@/components/data-table';
import { Page } from '@/components/page';
import { PageHeader } from '@/components/page-header';
import { useCreateStaff, useDeleteStaff, useListStaff, useUpdateStaff } from '@/hooks';
import { QueryState } from '../query-state';

type FormValues = {
  fullName: string;
  displayName: string;
  email: string;
};

export default function StaffPage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useListStaff();
  const { mutate: createItem, isPending: creating } = useCreateStaff();
  const { mutate: updateItem, isPending: updating } = useUpdateStaff();
  const { mutate: deleteItem } = useDeleteStaff();

  const [opened, setOpened] = useState(false);
  const [editing, setEditing] = useState<Staff | null>(null);

  const form = useForm<FormValues>({
    initialValues: { fullName: '', displayName: '', email: '' },
    validate: {
      fullName: (v) => (v.trim() ? null : 'Укажите ФИО'),
      email: (v) => {
        if (!v.trim()) return null;
        return /^\S+@\S+\.\S+$/.test(v) ? null : 'Некорректный email';
      },
    },
  });

  const openCreate = () => {
    setEditing(null);
    form.setValues({ fullName: '', displayName: '', email: '' });
    setOpened(true);
  };

  const openEdit = (item: Staff) => {
    setEditing(item);
    form.setValues({
      fullName: item.fullName,
      displayName: item.displayName ?? '',
      email: item.email ?? '',
    });
    setOpened(true);
  };

  const close = () => {
    setOpened(false);
    setEditing(null);
    form.reset();
  };

  const handleSubmit = form.onSubmit((values) => {
    const email = values.email.trim();
    if (editing) {
      updateItem(
        {
          variables: {
            fullName: values.fullName.trim(),
            displayName: values.displayName.trim() || null,
            email: email || null,
          },
          route: { staffId: editing.id },
        },
        { onSuccess: close }
      );
    } else {
      createItem(
        {
          variables: {
            fullName: values.fullName.trim(),
            displayName: values.displayName.trim() || undefined,
            email: email || undefined,
            organizationIds: [],
            locationIds: [],
          },
        },
        { onSuccess: close }
      );
    }
  });

  const confirmDelete = (item: Staff) => {
    modals.openConfirmModal({
      title: 'Удалить сотрудника?',
      children: <Text size="sm">«{item.fullName}» будет удалён из справочника.</Text>,
      labels: { confirm: 'Удалить', cancel: 'Отмена' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteItem({ model: item, route: { staffId: item.id } }),
    });
  };

  const items = data?.items ?? [];

  return (
    <Page title="Сотрудники">
      <PageHeader title="Сотрудники">
        <Group>
          <Button variant="default" onClick={() => refetch()} loading={isFetching}>
            Обновить
          </Button>
          <AddButton onClick={openCreate}>Добавить</AddButton>
        </Group>
      </PageHeader>

      <Text c="dimmed" mb="md" maw={520}>
        Опциональный справочник сотрудников. Назначения на org/location — позже.
      </Text>

      <QueryState
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={!isLoading && !isError && items.length === 0}
        emptyTitle="Сотрудников пока нет"
        emptyDescription="Нажмите «Добавить», чтобы создать первого."
      >
        <DataTable.Container>
          <DataTable.Table
            records={items}
            idAccessor="id"
            columns={[
              { accessor: 'fullName', title: 'ФИО' },
              {
                accessor: 'displayName',
                title: 'Отображаемое',
                render: (row) => row.displayName || '—',
              },
              { accessor: 'email', title: 'Email', render: (row) => row.email || '—' },
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
        title={editing ? 'Редактировать сотрудника' : 'Новый сотрудник'}
      >
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput label="ФИО" required {...form.getInputProps('fullName')} />
            <TextInput label="Отображаемое имя" {...form.getInputProps('displayName')} />
            <TextInput label="Email" {...form.getInputProps('email')} />
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
