import '@unocss/reset/tailwind.css'
import 'uno.css';

import { render } from 'solid-js/web';
import { Router } from '@solidjs/router';
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';

import App from './App';
import { AllSettingsProvider } from './contexts/AllSettingsProvider';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000
        }
    }
});

render(() =>
        <AllSettingsProvider>
        <QueryClientProvider client={queryClient}>
        <Router>
            <App />
        </Router>
        </QueryClientProvider>
        </AllSettingsProvider>
    ,
    document.getElementById('root')
);
