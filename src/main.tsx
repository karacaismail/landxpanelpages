import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import '@/i18n';
import './styles/tailwind.css';
import './styles/globals.scss';
import 'leaflet/dist/leaflet.css';
import { router } from './router';

const qc = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, retry: 0, refetchOnWindowFocus: false }
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={qc}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
