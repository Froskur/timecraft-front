import { useMemo, useState } from 'react';
import { Button, Group, Modal, Select, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import { Location } from '@/api/entities';
import { AddButton } from '@/components/add-button';
import { DataTable } from '@/components/data-table';
import { Page } from '@/components/page';
import { PageHeader } from '@/components/page-header';
import {
  useCreateLocation,
  useDeleteLocation,
  useListLocations,
  useListOrganizations,
  useUpdateLocation,
} from '@/hooks';
import { QueryState } from '../query-state';

type FormValues = {
  name: string;
  timezone: string;
  address: string;
  organizationId: string | null;
};

export default function LocationsPage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useListLocations();
  const { data: orgs } = useListOrganizations();
  const { mutate: createItem, isPending: creating } = useCreateLocation();
  const { mutate: updateItem, isPending: updating } = useUpdateLocation();
  const { mutate: deleteItem } = useDeleteLocation();

  const [opened, setOpened] = useState(false);
  const [editing, setEditing] = useState<Location | null>(null);

  const orgOptions = useMemo(
    () =>
      (orgs?.items ?? []).map((o) => ({
        value: o.id,
        label: o.name,
      })),
    [orgs]
  );

  const orgNameById = useMemo(() => {
    const map = new Map<string, string>();
    (orgs?.items ?? []).forEach((o) => map.set(o.id, o.name));
    return map;
  }, [orgs]);

  const form = useForm<FormValues>({
    initialValues: {
      name: '',
      timezone: 'Europe/Moscow',
      address: '',
      organizationId: null,
    },
    validate: {
      name: (v) => (v.trim() ? null : 'Укажите название'),
      timezone: (v) => (v.trim() ? null : 'Укажите часовой пояс'),
    },
  });

  const openCreate = () => {
    setEditing(null);
    form.setValues({
      name: '',
      timezone: 'Europe/Moscow',
      address: '',
      organizationId: null,
    });
    setOpened(true);
  };

  const openEdit = (item: Location) => {
    setEditing(item);
    form.setValues({
      name: item.name,
      timezone: item.timezone,
      address: item.address ?? '',
      organizationId: item.organizationId ?? null,
    });
    setOpened(true);
  };

  const close = () => {
    setOpened(false);
    setEditing(null);
    form.reset();
  };

  const handleSubmit = form.onSubmit((values) => {
    const payload = {
      name: values.name.trim(),
      timezone: values.timezone.trim(),
      address: values.address.trim() || undefined,
      organizationId: values.organizationId,
    };

    if (editing) {
      updateItem(
        { variables: payload, route: { locationId: editing.id } },
        { onSuccess: close }
      );
    } else {
      createItem({ variables: payload }, { onSuccess: close });
    }
  });

  const confirmDelete = (item: Location) => {
    modals.openConfirmModal({
      title: 'Удалить площадку?',
      children: <Text size="sm">«{item.name}» будет удалена из справочника.</Text>,
      labels: { confirm: 'Удалить', cancel: 'Отмена' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteItem({ model: item, route: { locationId: item.id } }),
    });
  };

  const items = data?.items ?? [];

  return (
    <Page title="Площадки">
      <PageHeader title="Площадки">
        <Group>
          <Button variant="default" onClick={() => refetch()} loading={isFetching}>
            Обновить
          </Button>
          <AddButton onClick={openCreate}>Добавить</AddButton>
        </Group>
      </PageHeader>

      <Text c="dimmed" mb="md" maw={520}>
        Опциональные площадки. Ресурсы могут жить и без привязки к площадке.
      </Text>

      <QueryState
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={!isLoading && !isError && items.length === 0}
        emptyTitle="Площадок пока нет"
        emptyDescription="Нажмите «Добавить», чтобы создать первую."
      >
        <DataTable.Container>
          <DataTable.Table
            records={items}
            idAccessor="id"
            columns={[
              { accessor: 'name', title: 'Название' },
              { accessor: 'timezone', title: 'Часовой пояс' },
              {
                accessor: 'organizationId',
                title: 'Организация',
                render: (row) =>
                  row.organizationId
                    ? (orgNameById.get(row.organizationId) ?? row.organizationId)
                    : '—',
              },
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
        title={editing ? 'Редактировать площадку' : 'Новая площадка'}
      >
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput label="Название" required {...form.getInputProps('name')} />
            <TextInput
              label="Часовой пояс (IANA)"
              required
              placeholder="Europe/Moscow"
              {...form.getInputProps('timezone')}
            />
            <TextInput label="Адрес" {...form.getInputProps('address')} />
            <Select
              label="Организация (необязательно)"
              clearable
              data={orgOptions}
              value={form.values.organizationId}
              onChange={(value) => form.setFieldValue('organizationId', value)}
              placeholder="Без организации"
            />
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
