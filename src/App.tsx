import { Route, Routes } from '@solidjs/router';
import type { Component } from "solid-js";

import PrimaryNav from './components/PrimaryNav';
import About from './pages/About';
import Home from './pages/Home';
import Random from './pages/Random';
import Search from './pages/Search';
import Settings from './pages/Settings';
import Stats from './pages/Stats';

const App: Component = () => {
    return <>
        <PrimaryNav></PrimaryNav>

        <Routes>
            <Route path="/" component={Home} />
            <Route path="/search" component={Search} />
            <Route path="/random" component={Random} />
            <Route path="/stats" component={Stats} />
            <Route path="/about" component={About} />
            <Route path="/settings" component={Settings} />
        </Routes>
    </>
};

export default App;
