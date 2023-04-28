import { Component } from "solid-js";
import { Outlet } from '@solidjs/router';

import Toolbar from './Toolbar';
import Layout from '../components/layout/Layout';

const AboutLayout: Component = () => {
    const toolbar = <Toolbar />;

    return (
        <Layout toolbar={toolbar}>
            <div class="text-center m-y-8">
                <img src="/icon.svg" class="display-inline w-[156px] h-[156px] mb-2" />
                <br/>
                <h2 class="text-xl text-primary"><a href="https://www.mikeandwan.us">mikeandwan.us</a></h2>
                <h2 class="text-xl text-primary">Photos</h2>
                <h2 class="text-xl text-primary">v{import.meta.env.VITE_APP_VERSION}</h2>
            </div>
            <div class="m-x-[10%]">
                <Outlet />
            </div>
        </Layout>
    );
};

export default AboutLayout;
