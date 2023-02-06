import type { Component } from "solid-js";
import { useRoutes } from '@solidjs/router';

import PrimaryNav from './components/PrimaryNav';
import { appRoutes } from './routes';

const App: Component = () => {
    const Routes = useRoutes(appRoutes);

    return <>
        <PrimaryNav></PrimaryNav>
        <Routes />
    </>
};

export default App;
