import { useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { PatientRecord } from '../types/patient-record';

export interface UseListDataConfig {
  servletUrl: string;
  dataRoot: string;
  params: Record<string, string>;
  enabled?: boolean;
}

export interface UseListDataReturn<T extends PatientRecord> {
  rows: T[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  clearData: () => void;
  totalCount: number;
}

async function fetchListData<T extends PatientRecord>(
  servletUrl: string,
  dataRoot: string,
  params: Record<string, string>,
): Promise<T[]> {
  const searchParams = new URLSearchParams(params);
  const url = `${servletUrl}?${searchParams.toString()}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  const json: Record<string, unknown> = await response.json();
  const data = json[dataRoot];
  if (!Array.isArray(data)) return [];
  return data as T[];
}

/**
 * TanStack Query wrapper replacing Ext.data.Store + HttpProxy.
 * queryKey derived from URL + params ensures automatic cache invalidation.
 */
export function useListData<T extends PatientRecord>(
  config: UseListDataConfig,
): UseListDataReturn<T> {
  const { servletUrl, dataRoot, params, enabled = true } = config;
  const queryClient = useQueryClient();

  const queryKey = useMemo(
    () => ['psp-list', servletUrl, params] as const,
    [servletUrl, params],
  );

  const { data, isLoading, error, refetch: rqRefetch } = useQuery<T[], Error>({
    queryKey,
    queryFn: () => fetchListData<T>(servletUrl, dataRoot, params),
    enabled,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  const rows = data ?? ([] as T[]);
  const totalCount = rows.length;

  const refetch = useCallback(() => {
    rqRefetch();
  }, [rqRefetch]);

  const clearData = useCallback(() => {
    queryClient.setQueryData(queryKey, []);
  }, [queryClient, queryKey]);

  return useMemo(
    () => ({ rows, isLoading, error: error ?? null, refetch, clearData, totalCount }),
    [rows, isLoading, error, refetch, clearData, totalCount],
  );
}
