import { Component } from "solid-js";
import { Outlet } from "@solidjs/router";

import Toolbar from "./Toolbar";
import Layout from "../components/layout/Layout";

const AboutLayout: Component = () => {
    return (
        <Layout toolbar={<Toolbar />}>
            <div class="font-brand text-6xl text-center mt-4 md:my-8">
                <img src="/icon.svg" width="156" height="156" class="inline mb-2" />
                <h2 class="text-primary"><a href="https://www.mikeandwan.us">mikeandwan.us</a></h2>
                <h2 class="text-secondary">Photos</h2>
                <h2 class="text-secondary m-t-[-1rem]">v{import.meta.env.VITE_APP_VERSION}</h2>
            </div>
            <div class="mx-4 md:mx-10%">
                <Outlet />
            </div>
        </Layout>
    );
};

export default AboutLayout;
