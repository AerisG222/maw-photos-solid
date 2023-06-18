import '@unocss/reset/tailwind.css'
import 'uno.css';

import { render } from 'solid-js/web';
import { Router } from '@solidjs/router';

import App from './App';
import { AllSettingsProvider } from './contexts/AllSettingsProvider';
import { CategoryProvider } from './contexts/CategoryContext';
import { PhotoListProvider } from './contexts/PhotoListContext';
import { PhotoEffectsProvider } from './contexts/PhotoEffectsContext';
import { FullscreenProvider } from './contexts/FullscreenContext';

render(() =>
        <AllSettingsProvider>
        <CategoryProvider>
        <PhotoListProvider>
        <PhotoEffectsProvider>
        <FullscreenProvider>
        <Router>
            <App />
        </Router>
        </FullscreenProvider>
        </PhotoEffectsProvider>
        </PhotoListProvider>
        </CategoryProvider>
        </AllSettingsProvider>
    ,
    document.getElementById('root')
);
