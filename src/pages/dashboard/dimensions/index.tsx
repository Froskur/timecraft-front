import { useState } from 'react';
import {
  Button,
  Drawer,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import { Dimension, DimensionPreset, DimensionValue } from '@/api/entities';
import { AddButton } from '@/components/add-button';
import { DataTable } from '@/components/data-table';
import { Page } from '@/components/page';
import { PageHeader } from '@/components/page-header';
import {
  useCreateDimension,
  useCreateDimensionValue,
  useDeleteDimension,
  useDeleteDimensionValue,
  useListDimensions,
  useListDimensionValues,
  useUpdateDimension,
  useUpdateDimensionValue,
} from '@/hooks';
import { QueryState } from '../query-state';

const PRESET_OPTIONS: { value: DimensionPreset | ''; label: string }[] = [
  { value: '', label: 'Свой ключ' },
  { value: 'organization', label: 'Организация' },
  { value: 'location', label: 'Площадка' },
  { value: 'role', label: 'Роль' },
];

const PRESET_LABEL: Record<DimensionPreset, string> = {
  organization: 'Организация',
  location: 'Площадка',
  role: 'Роль',
};

type DimensionFormValues = {
  name: string;
  preset: DimensionPreset | '';
  key: string;
};

type ValueFormValues = {
  name: string;
  code: string;
};

function DimensionValuesPanel({ dimension }: { dimension: Dimension }) {
  const { data, isLoading, isError, error, refetch, isFetching } = useListDimensionValues({
    route: { dimensionId: dimension.id },
  });
  const { mutate: createValue, isPending: creating } = useCreateDimensionValue();
  const { mutate: updateValue, isPending: updating } = useUpdateDimensionValue();
  const { mutate: deleteValue } = useDeleteDimensionValue();

  const [opened, setOpened] = useState(false);
  const [editing, setEditing] = useState<DimensionValue | null>(null);

  const form = useForm<ValueFormValues>({
    initialValues: { name: '', code: '' },
    validate: {
      name: (v) => (v.trim() ? null : 'Укажите название'),
    },
  });

  const openCreate = () => {
    setEditing(null);
    form.setValues({ name: '', code: '' });
    setOpened(true);
  };

  const openEdit = (item: DimensionValue) => {
    setEditing(item);
    form.setValues({ name: item.name, code: item.code ?? '' });
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
      code: values.code.trim() || undefined,
    };

    if (editing) {
      updateValue(
        {
          variables: {
            name: payload.name,
            code: payload.code ?? null,
          },
          route: { dimensionValueId: editing.id },
        },
        { onSuccess: close }
      );
    } else {
      createValue(
        { variables: payload, route: { dimensionId: dimension.id } },
        { onSuccess: close }
      );
    }
  });

  const confirmDelete = (item: DimensionValue) => {
    modals.openConfirmModal({
      title: 'Удалить значение?',
      children: <Text size="sm">«{item.name}» будет удалено. Связи с ресурсами снимутся.</Text>,
      labels: { confirm: 'Удалить', cancel: 'Отмена' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteValue({ model: item, route: { dimensionValueId: item.id } }),
    });
  };

  const items = data?.items ?? [];

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <div>
          <Text fw={600}>{dimension.name}</Text>
          <Text size="sm" c="dimmed">
            ключ: {dimension.key}
            {dimension.preset ? ` · пресет: ${PRESET_LABEL[dimension.preset]}` : ''}
          </Text>
        </div>
        <Group>
          <Button variant="default" onClick={() => refetch()} loading={isFetching}>
            Обновить
          </Button>
          <AddButton onClick={openCreate}>Значение</AddButton>
        </Group>
      </Group>

      <QueryState
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={!isLoading && !isError && items.length === 0}
        emptyTitle="Значений пока нет"
        emptyDescription="Добавьте первое значение этого разреза."
      >
        <DataTable.Container>
          <DataTable.Table
            records={items}
            idAccessor="id"
            columns={[
              { accessor: 'name', title: 'Название' },
              { accessor: 'code', title: 'Код', render: (row) => row.code || '—' },
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
        title={editing ? 'Редактировать значение' : 'Новое значение'}
      >
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput label="Название" required {...form.getInputProps('name')} />
            <TextInput label="Код" {...form.getInputProps('code')} />
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
    </Stack>
  );
}

export default function DimensionsPage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useListDimensions();
  const { mutate: createItem, isPending: creating } = useCreateDimension();
  const { mutate: updateItem, isPending: updating } = useUpdateDimension();
  const { mutate: deleteItem } = useDeleteDimension();

  const [opened, setOpened] = useState(false);
  const [editing, setEditing] = useState<Dimension | null>(null);
  const [valuesFor, setValuesFor] = useState<Dimension | null>(null);

  const form = useForm<DimensionFormValues>({
    initialValues: { name: '', preset: '', key: '' },
    validate: {
      name: (v) => (v.trim() ? null : 'Укажите название'),
      key: (v, values) => {
        if (editing) return null;
        if (values.preset) return null;
        return v.trim() ? null : 'Укажите ключ или выберите пресет';
      },
    },
  });

  const openCreate = () => {
    setEditing(null);
    form.setValues({ name: '', preset: '', key: '' });
    setOpened(true);
  };

  const openEdit = (item: Dimension) => {
    setEditing(item);
    form.setValues({
      name: item.name,
      preset: item.preset ?? '',
      key: item.key,
    });
    setOpened(true);
  };

  const close = () => {
    setOpened(false);
    setEditing(null);
    form.reset();
  };

  const handleSubmit = form.onSubmit((values) => {
    if (editing) {
      updateItem(
        { variables: { name: values.name.trim() }, route: { dimensionId: editing.id } },
        { onSuccess: close }
      );
      return;
    }

    const payload = values.preset
      ? { name: values.name.trim(), preset: values.preset }
      : { name: values.name.trim(), key: values.key.trim() };

    createItem({ variables: payload }, { onSuccess: close });
  });

  const confirmDelete = (item: Dimension) => {
    modals.openConfirmModal({
      title: 'Удалить разрез?',
      children: (
        <Text size="sm">
          «{item.name}» и его значения будут архивированы. Связи с ресурсами могут конфликтовать.
        </Text>
      ),
      labels: { confirm: 'Удалить', cancel: 'Отмена' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteItem({ model: item, route: { dimensionId: item.id } }),
    });
  };

  const items = data?.items ?? [];

  return (
    <Page title="Разрезы">
      <PageHeader title="Разрезы">
        <Group>
          <Button variant="default" onClick={() => refetch()} loading={isFetching}>
            Обновить
          </Button>
          <AddButton onClick={openCreate}>Добавить</AddButton>
        </Group>
      </PageHeader>

      <Text c="dimmed" mb="md" maw={560}>
        Опциональные оси фильтрации ресурсов: организация, площадка, роль или свой ключ. Без
        разрезов можно работать с плоским списком ресурсов.
      </Text>

      <QueryState
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={!isLoading && !isError && items.length === 0}
        emptyTitle="Разрезов пока нет"
        emptyDescription="Нажмите «Добавить», чтобы создать первый разрез."
      >
        <DataTable.Container>
          <DataTable.Table
            records={items}
            idAccessor="id"
            columns={[
              { accessor: 'name', title: 'Название' },
              { accessor: 'key', title: 'Ключ', width: 140 },
              {
                accessor: 'preset',
                title: 'Пресет',
                width: 140,
                render: (row) =>
                  row.preset ? (PRESET_LABEL[row.preset] ?? row.preset) : '—',
              },
              { accessor: 'status', title: 'Статус', width: 120 },
              {
                accessor: 'actions',
                title: '',
                width: 180,
                render: (row) => (
                  <Group gap="xs" wrap="nowrap">
                    <Button size="compact-xs" variant="light" onClick={() => setValuesFor(row)}>
                      Значения
                    </Button>
                    <DataTable.Actions
                      onEdit={() => openEdit(row)}
                      onDelete={() => confirmDelete(row)}
                    />
                  </Group>
                ),
              },
            ]}
          />
        </DataTable.Container>
      </QueryState>

      <Modal
        opened={opened}
        onClose={close}
        title={editing ? 'Редактировать разрез' : 'Новый разрез'}
      >
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput label="Название" required {...form.getInputProps('name')} />
            {!editing && (
              <>
                <Select
                  label="Пресет"
                  data={PRESET_OPTIONS}
                  value={form.values.preset}
                  onChange={(value) =>
                    form.setFieldValue('preset', (value as DimensionPreset | '') ?? '')
                  }
                  allowDeselect={false}
                />
                {!form.values.preset && (
                  <TextInput
                    label="Ключ"
                    description="Латиница, уникален в аккаунте"
                    required
                    {...form.getInputProps('key')}
                  />
                )}
              </>
            )}
            {editing && (
              <Text size="sm" c="dimmed">
                Ключ и пресет после создания не меняются (ключ: {editing.key}).
              </Text>
            )}
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

      <Drawer
        opened={!!valuesFor}
        onClose={() => setValuesFor(null)}
        title="Значения разреза"
        position="right"
        size="lg"
      >
        {valuesFor && <DimensionValuesPanel dimension={valuesFor} />}
      </Drawer>
    </Page>
  );
}
