import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { client } from '@/api/axios';
import { Dimension, DimensionValue, DimensionValueList } from '@/api/entities';
import { useListDimensions } from './dimensions';

export type DimensionValueOption = {
  value: string;
  label: string;
  group: string;
  dimensionId: string;
};

/** Loads all dimensions and their values for selects / labels. */
export function useDimensionValueCatalog() {
  const dimensionsQuery = useListDimensions();
  const dimensions = dimensionsQuery.data?.items ?? [];

  const valueQueries = useQueries({
    queries: dimensions.map((dimension) => ({
      queryKey: ['dimension-values', { dimensionId: dimension.id }],
      queryFn: async () => {
        const response = await client.get(`/v1/dimensions/${dimension.id}/values`);
        return DimensionValueList.parse(response.data);
      },
      enabled: dimensionsQuery.isSuccess,
    })),
  });

  const isLoading =
    dimensionsQuery.isLoading || valueQueries.some((query) => query.isLoading && query.fetchStatus !== 'idle');
  const isError = dimensionsQuery.isError || valueQueries.some((query) => query.isError);
  const error = dimensionsQuery.error ?? valueQueries.find((query) => query.error)?.error;

  const valuesByDimensionId = useMemo(() => {
    const map = new Map<string, DimensionValue[]>();
    dimensions.forEach((dimension, index) => {
      map.set(dimension.id, valueQueries[index]?.data?.items ?? []);
    });
    return map;
  }, [dimensions, valueQueries]);

  const valueById = useMemo(() => {
    const map = new Map<string, DimensionValue & { dimension?: Dimension }>();
    dimensions.forEach((dimension, index) => {
      (valueQueries[index]?.data?.items ?? []).forEach((value) => {
        map.set(value.id, { ...value, dimension });
      });
    });
    return map;
  }, [dimensions, valueQueries]);

  const options = useMemo<DimensionValueOption[]>(() => {
    const list: DimensionValueOption[] = [];
    dimensions.forEach((dimension, index) => {
      (valueQueries[index]?.data?.items ?? []).forEach((value) => {
        list.push({
          value: value.id,
          label: value.code ? `${value.name} (${value.code})` : value.name,
          group: dimension.name,
          dimensionId: dimension.id,
        });
      });
    });
    return list;
  }, [dimensions, valueQueries]);

  const labelForIds = (ids: string[]) => {
    if (!ids.length) return '—';
    return ids.map((id) => valueById.get(id)?.name ?? id).join(', ');
  };

  return {
    dimensions,
    valuesByDimensionId,
    valueById,
    options,
    labelForIds,
    isLoading,
    isError,
    error,
    refetch: () => {
      dimensionsQuery.refetch();
      valueQueries.forEach((query) => query.refetch());
    },
  };
}
