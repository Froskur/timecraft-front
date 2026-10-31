import { useMemo, useState } from 'react';
import {
  Button,
  Group,
  Modal,
  MultiSelect,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import { Resource, ResourceKind } from '@/api/entities';
import { AddButton } from '@/components/add-button';
import { DataTable } from '@/components/data-table';
import { Page } from '@/components/page';
import { PageHeader } from '@/components/page-header';
import {
  useCreateResource,
  useDeleteResource,
  useDimensionValueCatalog,
  useListResources,
  useSetResourceDimensionValues,
  useUpdateResource,
} from '@/hooks';
import { QueryState } from '../query-state';

const KIND_OPTIONS: { value: ResourceKind; label: string }[] = [
  { value: 'person', label: 'Человек' },
  { value: 'room', label: 'Помещение' },
  { value: 'equipment', label: 'Оборудование' },
  { value: 'other', label: 'Другое' },
];

const KIND_LABEL: Record<ResourceKind, string> = {
  person: 'Человек',
  room: 'Помещение',
  equipment: 'Оборудование',
  other: 'Другое',
};

type FormValues = {
  kind: ResourceKind;
  name: string;
  displayName: string;
  code: string;
  dimensionValueIds: string[];
};

export default function ResourcesPage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useListResources();
  const catalog = useDimensionValueCatalog();
  const { mutate: createItem, isPending: creating } = useCreateResource();
  const { mutate: updateItem, isPending: updating } = useUpdateResource();
  const { mutate: setDimensionValues, isPending: linking } = useSetResourceDimensionValues();
  const { mutate: deleteItem } = useDeleteResource();

  const [opened, setOpened] = useState(false);
  const [editing, setEditing] = useState<Resource | null>(null);

  const multiSelectData = useMemo(() => {
    const groups = new Map<string, { value: string; label: string }[]>();
    for (const option of catalog.options) {
      const items = groups.get(option.group) ?? [];
      items.push({ value: option.value, label: option.label });
      groups.set(option.group, items);
    }
    return Array.from(groups.entries()).map(([group, items]) => ({ group, items }));
  }, [catalog.options]);

  const form = useForm<FormValues>({
    initialValues: {
      kind: 'person',
      name: '',
      displayName: '',
      code: '',
      dimensionValueIds: [],
    },
    validate: {
      name: (v) => (v.trim() ? null : 'Укажите название'),
      kind: (v) => (v ? null : 'Укажите тип'),
    },
  });

  const openCreate = () => {
    setEditing(null);
    form.setValues({
      kind: 'person',
      name: '',
      displayName: '',
      code: '',
      dimensionValueIds: [],
    });
    setOpened(true);
  };

  const openEdit = (item: Resource) => {
    setEditing(item);
    form.setValues({
      kind: item.kind,
      name: item.name,
      displayName: item.displayName ?? '',
      code: item.code ?? '',
      dimensionValueIds: [...item.dimensionValueIds],
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
      kind: values.kind,
      name: values.name.trim(),
      displayName: values.displayName.trim() || undefined,
      code: values.code.trim() || undefined,
      dimensionValueIds: values.dimensionValueIds,
    };

    if (editing) {
      updateItem(
        {
          variables: {
            kind: payload.kind,
            name: payload.name,
            displayName: payload.displayName ?? null,
            code: payload.code ?? null,
          },
          route: { resourceId: editing.id },
        },
        {
          onSuccess: () => {
            setDimensionValues(
              {
                variables: { dimensionValueIds: payload.dimensionValueIds },
                route: { resourceId: editing.id },
              },
              { onSuccess: close }
            );
          },
        }
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
          <Button
            variant="default"
            onClick={() => {
              refetch();
              catalog.refetch();
            }}
            loading={isFetching}
          >
            Обновить
          </Button>
          <AddButton onClick={openCreate}>Добавить</AddButton>
        </Group>
      </PageHeader>

      <Text c="dimmed" mb="md" maw={560}>
        Единицы справочника и записи: люди, помещения, оборудование. Значения разрезов
        необязательны.
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
              {
                accessor: 'kind',
                title: 'Тип',
                width: 140,
                render: (row) => KIND_LABEL[row.kind] ?? row.kind,
              },
              { accessor: 'name', title: 'Название' },
              {
                accessor: 'displayName',
                title: 'Отображаемое',
                render: (row) => row.displayName || '—',
              },
              { accessor: 'code', title: 'Код', render: (row) => row.code || '—' },
              {
                accessor: 'dimensionValueIds',
                title: 'Разрезы',
                render: (row) => catalog.labelForIds(row.dimensionValueIds),
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
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <Stack>
            <Select
              label="Тип"
              required
              data={KIND_OPTIONS}
              value={form.values.kind}
              onChange={(value) =>
                form.setFieldValue('kind', (value as ResourceKind) || 'person')
              }
            />
            <TextInput label="Название" required {...form.getInputProps('name')} />
            <TextInput label="Отображаемое имя" {...form.getInputProps('displayName')} />
            <TextInput label="Код" {...form.getInputProps('code')} />
            <MultiSelect
              label="Значения разрезов"
              description="Необязательно. Можно назначить значения по нескольким разрезам."
              data={multiSelectData}
              searchable
              clearable
              value={form.values.dimensionValueIds ?? []}
              onChange={(value) => form.setFieldValue('dimensionValueIds', value ?? [])}
              placeholder={
                catalog.options.length ? 'Выберите значения' : 'Сначала создайте разрезы и значения'
              }
            />
            <Group justify="flex-end">
              <Button variant="default" onClick={close}>
                Отмена
              </Button>
              <Button type="submit" loading={creating || updating || linking}>
                Сохранить
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Page>
  );
}
