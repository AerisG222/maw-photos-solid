import '@unocss/reset/tailwind.css'
import 'uno.css';

import { render } from 'solid-js/web';
import { Router } from '@solidjs/router';

import App from './App';
import { AllSettingsProvider } from './contexts/settings/AllSettingsProvider';
import { CategoryProvider } from './contexts/CategoryContext';
import { FullscreenProvider } from './contexts/FullscreenContext';

render(() =>
        <AllSettingsProvider>
        <CategoryProvider>
        <FullscreenProvider>
        <Router>
            <App />
        </Router>
        </FullscreenProvider>
        </CategoryProvider>
        </AllSettingsProvider>
    ,
    document.getElementById('root')
);
