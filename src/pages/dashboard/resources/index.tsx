import { useMemo, useState } from 'react';
import { Button, Group, Modal, Select, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import { Resource } from '@/api/entities';
import { AddButton } from '@/components/add-button';
import { DataTable } from '@/components/data-table';
import { Page } from '@/components/page';
import { PageHeader } from '@/components/page-header';
import {
  useCreateResource,
  useDeleteResource,
  useListLocations,
  useListOrganizations,
  useListResources,
  useUpdateResource,
} from '@/hooks';
import { QueryState } from '../query-state';

type FormValues = {
  name: string;
  displayName: string;
  code: string;
  organizationId: string | null;
  locationId: string | null;
};

export default function ResourcesPage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useListResources();
  const { data: orgs } = useListOrganizations();
  const { data: locations } = useListLocations();
  const { mutate: createItem, isPending: creating } = useCreateResource();
  const { mutate: updateItem, isPending: updating } = useUpdateResource();
  const { mutate: deleteItem } = useDeleteResource();

  const [opened, setOpened] = useState(false);
  const [editing, setEditing] = useState<Resource | null>(null);

  const orgOptions = useMemo(
    () => (orgs?.items ?? []).map((o) => ({ value: o.id, label: o.name })),
    [orgs]
  );
  const locationOptions = useMemo(
    () => (locations?.items ?? []).map((l) => ({ value: l.id, label: l.name })),
    [locations]
  );
  const orgNameById = useMemo(() => {
    const map = new Map<string, string>();
    (orgs?.items ?? []).forEach((o) => map.set(o.id, o.name));
    return map;
  }, [orgs]);
  const locationNameById = useMemo(() => {
    const map = new Map<string, string>();
    (locations?.items ?? []).forEach((l) => map.set(l.id, l.name));
    return map;
  }, [locations]);

  const form = useForm<FormValues>({
    initialValues: {
      name: '',
      displayName: '',
      code: '',
      organizationId: null,
      locationId: null,
    },
    validate: {
      name: (v) => (v.trim() ? null : 'Укажите название'),
    },
  });

  const openCreate = () => {
    setEditing(null);
    form.setValues({
      name: '',
      displayName: '',
      code: '',
      organizationId: null,
      locationId: null,
    });
    setOpened(true);
  };

  const openEdit = (item: Resource) => {
    setEditing(item);
    form.setValues({
      name: item.name,
      displayName: item.displayName ?? '',
      code: item.code ?? '',
      organizationId: item.organizationId ?? null,
      locationId: item.locationId ?? null,
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
      displayName: values.displayName.trim() || undefined,
      code: values.code.trim() || undefined,
      organizationId: values.organizationId,
      locationId: values.locationId,
    };

    if (editing) {
      updateItem(
        { variables: payload, route: { resourceId: editing.id } },
        { onSuccess: close }
      );
    } else {
      createItem({ variables: payload }, { onSuccess: close });
    }
  });

  const confirmDelete = (item: Resource) => {
    modals.openConfirmModal({
      title: 'Удалить ресурс?',
      children: <Text size="sm">«{item.name}» будет удалён из справочника.</Text>,
      labels: { confirm: 'Удалить', cancel: 'Отмена' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteItem({ model: item, route: { resourceId: item.id } }),
    });
  };

  const items = data?.items ?? [];

  return (
    <Page title="Ресурсы">
      <PageHeader title="Ресурсы">
        <Group>
          <Button variant="default" onClick={() => refetch()} loading={isFetching}>
            Обновить
          </Button>
          <AddButton onClick={openCreate}>Добавить</AddButton>
        </Group>
      </PageHeader>

      <Text c="dimmed" mb="md" maw={520}>
        Основные единицы записи: кресло, кабинет и т.п. Организация и площадка необязательны.
      </Text>

      <QueryState
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={!isLoading && !isError && items.length === 0}
        emptyTitle="Ресурсов пока нет"
        emptyDescription="Нажмите «Добавить», чтобы создать первый ресурс."
      >
        <DataTable.Container>
          <DataTable.Table
            records={items}
            idAccessor="id"
            columns={[
              { accessor: 'name', title: 'Название' },
              {
                accessor: 'displayName',
                title: 'Отображаемое',
                render: (row) => row.displayName || '—',
              },
              { accessor: 'code', title: 'Код', render: (row) => row.code || '—' },
              {
                accessor: 'locationId',
                title: 'Площадка',
                render: (row) =>
                  row.locationId ? (locationNameById.get(row.locationId) ?? row.locationId) : '—',
              },
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
        title={editing ? 'Редактировать ресурс' : 'Новый ресурс'}
      >
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput label="Название" required {...form.getInputProps('name')} />
            <TextInput label="Отображаемое имя" {...form.getInputProps('displayName')} />
            <TextInput label="Код" {...form.getInputProps('code')} />
            <Select
              label="Площадка (необязательно)"
              clearable
              data={locationOptions}
              value={form.values.locationId}
              onChange={(value) => form.setFieldValue('locationId', value)}
              placeholder="Без площадки"
            />
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
