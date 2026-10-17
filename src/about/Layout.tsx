import { Component } from "solid-js";
import { Outlet } from "@tanstack/solid-router";

import Toolbar from "./components/Toolbar";
import Layout from "../_components/layout/Layout";
import BrandHeader from "../_components/brand/BrandHeader";

const AboutLayout: Component = () => {
    return (
        <Layout toolbar={<Toolbar />}>
            <BrandHeader showVersion />

            <div class="mx-4 md:mx-10%">
                <Outlet />
            </div>
        </Layout>
    );
};

export default AboutLayout;
