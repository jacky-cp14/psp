import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { PatientRecord } from '../../../src/types/patient-record';
import { List0Normal } from '../../lists/list0-normal';
import { List1Uncoded } from '../../lists/list1-uncoded';
import { List2MsGopc } from '../../lists/list2-ms-gopc';
import { List3MoInCharge } from '../../lists/list3-mo-incharge';
import { List4Op } from '../../lists/list4-op';
import { List5UserGroup } from '../../lists/list5-user-group';
import { List6Absent } from '../../lists/list6-absent';
import { List7Gopc } from '../../lists/list7-gopc';
import { List8ActiveMo } from '../../lists/list8-active-mo';
import { List9ActiveTeam } from '../../lists/list9-active-team';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children,
    );
  };
}

const noop = (_p: PatientRecord) => {};
const defaultParams = { hospCode: 'QMH', wardCode: 'WARD_A' };

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({}),
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Demo Lists Integration', () => {
  it('should render List 0 (Normal) with title and grid', () => {
    render(<List0Normal params={defaultParams} onPatientSelect={noop} />, {
      wrapper: createWrapper(),
    });
    expect(screen.getByText('Normal Patient List')).toBeInTheDocument();
    expect(screen.getByTestId('dual-grid-container')).toBeInTheDocument();
  });

  it('should render List 1 (Uncoded) with title', () => {
    render(<List1Uncoded params={defaultParams} onPatientSelect={noop} />, {
      wrapper: createWrapper(),
    });
    expect(screen.getByText('Uncoded Patient List')).toBeInTheDocument();
  });

  it('should render List 2 (MS GOPC) with title', () => {
    render(<List2MsGopc params={defaultParams} onPatientSelect={noop} />, {
      wrapper: createWrapper(),
    });
    expect(screen.getByText('MS GOPC Appointment List')).toBeInTheDocument();
  });

  it('should render List 3 (MO In-Charge) with title', () => {
    render(<List3MoInCharge params={defaultParams} onPatientSelect={noop} />, {
      wrapper: createWrapper(),
    });
    expect(screen.getByText('MO In-Charge Patient List')).toBeInTheDocument();
  });

  it('should render List 4 (OP) with title', () => {
    render(<List4Op params={defaultParams} onPatientSelect={noop} />, {
      wrapper: createWrapper(),
    });
    expect(screen.getByText('OP Appointment List')).toBeInTheDocument();
  });

  it('should render List 5 (User Group) with title', () => {
    render(<List5UserGroup params={defaultParams} onPatientSelect={noop} />, {
      wrapper: createWrapper(),
    });
    expect(screen.getByText('User Group List')).toBeInTheDocument();
  });

  it('should render List 6 (Absent) with title', () => {
    render(<List6Absent params={defaultParams} onPatientSelect={noop} />, {
      wrapper: createWrapper(),
    });
    expect(screen.getByText('Absent Patient List')).toBeInTheDocument();
  });

  it('should render List 7 (GOPC) with title', () => {
    render(<List7Gopc params={defaultParams} onPatientSelect={noop} />, {
      wrapper: createWrapper(),
    });
    expect(screen.getByText('GOPC Appointment List')).toBeInTheDocument();
  });

  it('should render List 8 (Active MO) with title', () => {
    render(<List8ActiveMo params={defaultParams} onPatientSelect={noop} />, {
      wrapper: createWrapper(),
    });
    expect(screen.getByText('Active Patient by MO/Specialist')).toBeInTheDocument();
  });

  it('should render List 9 (Active Team) with title', () => {
    render(<List9ActiveTeam params={defaultParams} onPatientSelect={noop} />, {
      wrapper: createWrapper(),
    });
    expect(screen.getByText('Active Patient by Team')).toBeInTheDocument();
  });
});
