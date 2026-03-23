import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { getDummyPayload } from './dummyData';

const SERVLET_TO_DATA_ROOT: Record<string, string> = {
  cpicaseservlet: 'cpiPatList',
  uncodeservlet: 'cpiUnCodePatList',
  msgopcservlet: 'msGopcPatList',
  moinchargeservlet: 'moPatList',
  opservlet: 'opPatList',
  usergroupservlet: 'cpiUserGrpPatList',
  absentservlet: 'cpiAbsPatList',
  gopcservlet: 'gopcPatList',
  activemoservlet: 'cpiActiveMoPatList',
  activeteamservlet: 'cpiActiveTeamPatList',
};

function installDummyFetchMock(): void {
  const originalFetch = window.fetch;
  window.fetch = function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const url = typeof input === 'string' ? input : input instanceof Request ? input.url : input.href;
    const pathname = url.split('?')[0].replace(/^.*\//, '');
    const dataRoot = SERVLET_TO_DATA_ROOT[pathname];
    if (dataRoot) {
      const payload = getDummyPayload(dataRoot);
      return Promise.resolve(
        new Response(JSON.stringify(payload), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );
    }
    return originalFetch.call(window, input, init);
  };
}

installDummyFetchMock();

const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
