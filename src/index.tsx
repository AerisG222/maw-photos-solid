import '@unocss/reset/tailwind.css'
import 'uno.css';

import { render } from 'solid-js/web';
import { Router } from '@solidjs/router';

import App from './App';
import { AllSettingsProvider } from './contexts/AllSettingsProvider';

render(() =>
        <AllSettingsProvider>
        <Router>
            <App />
        </Router>
        </AllSettingsProvider>
    ,
    document.getElementById('root')
);
