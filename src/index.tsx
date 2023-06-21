import '@unocss/reset/tailwind.css'
import 'uno.css';

import { render } from 'solid-js/web';
import { Router } from '@solidjs/router';

import { AllSettingsProvider } from './contexts/settings/AllSettingsProvider';
import { CategoryProvider } from './contexts/CategoryContext';
import { FullscreenProvider } from './contexts/FullscreenContext';
import { LayoutOptionsProvider } from './contexts/LayoutOptionsContext';

import App from './App';

render(() =>
        <AllSettingsProvider>
        <CategoryProvider>
        <FullscreenProvider>
        <LayoutOptionsProvider>
        <Router>
            <App />
        </Router>
        </LayoutOptionsProvider>
        </FullscreenProvider>
        </CategoryProvider>
        </AllSettingsProvider>
    ,
    document.getElementById('root')
);
