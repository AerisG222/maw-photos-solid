import About from './pages/About';
import Home from './pages/Home';
import Random from './pages/Random';
import Search from './pages/Search';
import Settings from './pages/Settings';
import Stats from './pages/Stats';

export const appRoutes = [
    {
        path: "/",
        component: Home
    },
    {
        path: "/search",
        component: Search
    },
    {
        path: "/random",
        component: Random
    },
    {
        path: "/stats",
        component: Stats
    },
    {
        path: "/about",
        component: About
    },
    {
        path: "/settings",
        component: Settings
    },
];
