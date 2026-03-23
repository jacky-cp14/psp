import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { BasePatientRecord } from './types/patient-record';
import { List0Normal } from './lists/list0-normal';
import { List1Uncoded } from './lists/list1-uncoded';
import { List2MsGopc } from './lists/list2-ms-gopc';
import { List3MoInCharge } from './lists/list3-mo-incharge';
import { List4Op } from './lists/list4-op';
import { List5UserGroup } from './lists/list5-user-group';
import { List6Absent } from './lists/list6-absent';
import { List7Gopc } from './lists/list7-gopc';
import { List8ActiveMo } from './lists/list8-active-mo';
import { List9ActiveTeam } from './lists/list9-active-team';
import { PerfLab } from './lists/perf-lab';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 0, refetchOnWindowFocus: false } },
});

const LISTS = [
  { id: 0, label: 'Normal', Component: List0Normal },
  { id: 1, label: 'Uncoded', Component: List1Uncoded },
  { id: 2, label: 'MS GOPC', Component: List2MsGopc },
  { id: 3, label: 'MO In-Charge', Component: List3MoInCharge },
  { id: 4, label: 'OP', Component: List4Op },
  { id: 5, label: 'User Group', Component: List5UserGroup },
  { id: 6, label: 'Absent', Component: List6Absent },
  { id: 7, label: 'GOPC', Component: List7Gopc },
  { id: 8, label: 'Active MO', Component: List8ActiveMo },
  { id: 9, label: 'Active Team', Component: List9ActiveTeam },
  { id: 10, label: 'Perf Lab', Component: PerfLab },
] as const;

export function App(): React.ReactElement {
  const [activeList, setActiveList] = useState(0);

  const handlePatientSelect = (patient: BasePatientRecord) => {
    console.log('Selected patient:', patient);
  };

  const ActiveList = LISTS[activeList].Component;

  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <nav style={{ display: 'flex', gap: 4, padding: 8, backgroundColor: '#1976d2' }}>
          {LISTS.map((list) => (
            <button
              key={list.id}
              onClick={() => setActiveList(list.id)}
              style={{
                padding: '4px 12px',
                backgroundColor: activeList === list.id ? '#fff' : 'transparent',
                color: activeList === list.id ? '#1976d2' : '#fff',
                border: '1px solid #fff',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: 12,
              }}
            >
              {list.label}
            </button>
          ))}
        </nav>
        <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              height: '80%',
              minHeight: 0,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <ActiveList
              params={{ hospCode: 'QMH', wardCode: 'WARD_A' }}
              onPatientSelect={handlePatientSelect}
            />
          </div>
        </main>
      </div>
    </QueryClientProvider>
  );
}
