import '@unocss/reset/tailwind.css'
import 'uno.css';

import { render } from 'solid-js/web';
import { Router } from '@solidjs/router';

import App from './App';
import { AllSettingsProvider } from './contexts/AllSettingsProvider';
import { CategoryProvider } from './contexts/CategoryContext';
import { PhotoListProvider } from './contexts/PhotoListContext';
import { FullscreenProvider } from './contexts/FullscreenContext';

render(() =>
        <AllSettingsProvider>
        <CategoryProvider>
        <PhotoListProvider>
        <FullscreenProvider>
        <Router>
            <App />
        </Router>
        </FullscreenProvider>
        </PhotoListProvider>
        </CategoryProvider>
        </AllSettingsProvider>
    ,
    document.getElementById('root')
);
