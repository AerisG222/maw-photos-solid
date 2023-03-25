import '@unocss/reset/tailwind.css'
import 'uno.css';

import { render } from 'solid-js/web';
import { Router } from '@solidjs/router';

import App from './App';
import { AppSettingsProvider } from './settings/_context';

render(() =>
        <AppSettingsProvider>
        <Router>
            <App />
        </Router>
        </AppSettingsProvider>
    ,
    document.getElementById('root')
);
