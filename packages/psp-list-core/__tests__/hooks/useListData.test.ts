import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useListData } from '../../src/hooks/useListData';
import type { BasePatientRecord } from '../../src/types/patient-record';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

const mockRecords: BasePatientRecord[] = [
  { id: '1', name: 'Alice', bed: '1' },
  { id: '2', name: 'Bob', bed: '2' },
];

describe('useListData', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should return empty rows initially when loading', () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ patList: mockRecords }),
    });

    const { result } = renderHook(
      () =>
        useListData<BasePatientRecord>({
          servletUrl: '/api/test',
          dataRoot: 'patList',
          params: { ward: 'A01' },
        }),
      { wrapper: createWrapper() },
    );

    expect(result.current.rows).toEqual([]);
    expect(result.current.isLoading).toBe(true);
  });

  it('should fetch and return rows on success', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ patList: mockRecords }),
    });

    const { result } = renderHook(
      () =>
        useListData<BasePatientRecord>({
          servletUrl: '/api/test',
          dataRoot: 'patList',
          params: { ward: 'A01' },
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.rows).toEqual(mockRecords);
    expect(result.current.totalCount).toBe(2);
    expect(result.current.error).toBeNull();
  });

  it('should return error on fetch failure', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    const { result } = renderHook(
      () =>
        useListData<BasePatientRecord>({
          servletUrl: '/api/test',
          dataRoot: 'patList',
          params: { ward: 'A01' },
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).not.toBeNull();
    expect(result.current.error?.message).toContain('500');
  });

  it('should return empty rows when dataRoot is missing in response', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ otherKey: [] }),
    });

    const { result } = renderHook(
      () =>
        useListData<BasePatientRecord>({
          servletUrl: '/api/test',
          dataRoot: 'patList',
          params: {},
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.rows).toEqual([]);
    expect(result.current.totalCount).toBe(0);
  });

  it('should not fetch when enabled is false', async () => {
    global.fetch = jest.fn();

    const { result } = renderHook(
      () =>
        useListData<BasePatientRecord>({
          servletUrl: '/api/test',
          dataRoot: 'patList',
          params: {},
          enabled: false,
        }),
      { wrapper: createWrapper() },
    );

    await new Promise((r) => setTimeout(r, 100));
    expect(global.fetch).not.toHaveBeenCalled();
    expect(result.current.rows).toEqual([]);
  });

  it('should pass params as query string', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ patList: [] }),
    });

    renderHook(
      () =>
        useListData<BasePatientRecord>({
          servletUrl: '/api/test',
          dataRoot: 'patList',
          params: { ward: 'A01', hosp: 'QMH' },
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(calledUrl).toContain('ward=A01');
    expect(calledUrl).toContain('hosp=QMH');
  });
});
