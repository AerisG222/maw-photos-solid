import About from './pages/About';
import Home from './pages/Home';
import Random from './pages/Random';
import Search from './pages/Search';
import Settings from './pages/Settings';
import Stats from './pages/Stats';

export const home = {
    icon: "i-ic-round-home",
    name: "Home",
    path: "/",
    component: Home
}

export const search = {
    icon: "i-ic-round-search",
    name: "Search",
    path: "/search",
    component: Search
}

export const random = {
    icon: "i-ic-round-shuffle",
    name: "Random",
    path: "/random",
    component: Random
}

export const stats = {
    icon: "i-ic-round-bar-chart",
    name: "Statistics",
    path: "/stats",
    component: Stats
}

export const about = {
    icon: "i-ic-outline-info",
    name: "About",
    path: "/about",
    component: About
}

export const settings = {
    icon: "i-ic-baseline-settings",
    name: "Settings",
    path: "/settings",
    component: Settings
}

export const appRoutes = [
    home,
    search,
    random,
    stats,
    about,
    settings
];
