import '@unocss/reset/tailwind.css'
import 'uno.css';

import { render } from 'solid-js/web';
import { Router } from '@solidjs/router';
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';

import App from './App';
import { AllSettingsProvider } from './contexts/AllSettingsProvider';
import { CategoryProvider } from './contexts/CategoryContext';

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
        <CategoryProvider>
        <Router>
            <App />
        </Router>
        </CategoryProvider>
        </QueryClientProvider>
        </AllSettingsProvider>
    ,
    document.getElementById('root')
);
